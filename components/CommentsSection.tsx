
import React, { useState } from 'react';
import { Comment } from '../types';

interface CommentsSectionProps {
  comments: Comment[];
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ comments }) => {
  const [userComment, setUserComment] = useState('');
  const [localComments, setLocalComments] = useState(comments);

  const handlePost = () => {
    if (!userComment.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(),
      author: 'u/current_user',
      text: userComment,
      upvotes: 1,
      timestamp: Date.now()
    };
    setLocalComments([newComment, ...localComments]);
    setUserComment('');
  };

  return (
    <div className="mt-8 border-t border-gray-200 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
        <i className="fa-solid fa-comments text-reddit-orange"></i>
        Discussion ({localComments.length})
      </h3>
      
      <div className="mb-6 flex gap-3">
        <input 
          type="text" 
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
          placeholder="What are your thoughts?"
          className="flex-1 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-reddit-orange/20"
        />
        <button 
          onClick={handlePost}
          className="bg-reddit-orange text-white rounded-full px-4 py-2 text-sm font-bold shadow-sm active:scale-95 transition-transform"
        >
          Post
        </button>
      </div>

      <div className="space-y-4">
        {localComments.map((comment) => (
          <div key={comment.id} className="flex gap-3 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-400">
              u/
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-900">{comment.author}</span>
                <span className="text-[10px] text-gray-400">• {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
              <div className="flex items-center gap-4 mt-2">
                <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-reddit-orange transition-colors">
                  <i className="fa-solid fa-arrow-up"></i> {comment.upvotes}
                </button>
                <button className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;

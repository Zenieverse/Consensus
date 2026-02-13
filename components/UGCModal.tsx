
import React, { useState } from 'react';

interface UGCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (question: string, options: string[]) => void;
}

const UGCModal: React.FC<UGCModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);

  if (!isOpen) return null;

  const handleOptionChange = (idx: number, val: string) => {
    const newOptions = [...options];
    newOptions[idx] = val;
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    if (!question || options.some(o => !o)) {
      alert("Please fill out all fields!");
      return;
    }
    onSubmit(question, options);
    setQuestion('');
    setOptions(['', '', '', '']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-reddit-orange text-white">
          <h2 className="text-lg font-bold">Submit a Daily Prompt</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-1">Your Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Which Reddit trope is the most annoying?"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-reddit-orange focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Options (4 Required)</label>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${idx + 1}`}
                  className="w-full p-2 text-sm rounded-md border border-gray-200 focus:border-reddit-orange focus:outline-none"
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 italic">
            Submissions are reviewed by moderators before appearing in the daily rotation.
          </p>
        </div>
        <div className="p-6 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 text-sm font-bold bg-reddit-orange text-white rounded-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-colors"
          >
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default UGCModal;

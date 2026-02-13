
import React from 'react';

interface OptionGridProps {
  options: string[];
  selectedOption: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

const OptionGrid: React.FC<OptionGridProps> = ({ options, selectedOption, onSelect, disabled }) => {
  return (
    <div className="space-y-3 mb-6">
      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
        Step 1: Your Personal Choice
      </label>
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={disabled}
            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
              selectedOption === index
                ? 'border-reddit-orange bg-orange-50'
                : 'border-gray-100 bg-gray-50 hover:border-gray-300'
            } ${disabled && selectedOption !== index ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className="font-medium text-gray-800">{option}</span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedOption === index ? 'border-reddit-orange bg-reddit-orange' : 'border-gray-300'
            }`}>
              {selectedOption === index && <i className="fa-solid fa-check text-white text-xs"></i>}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OptionGrid;

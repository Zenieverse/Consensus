
import React from 'react';

interface PredictionSelectorProps {
  options: string[];
  prediction: number | null;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

const PredictionSelector: React.FC<PredictionSelectorProps> = ({ options, prediction, onSelect, disabled }) => {
  return (
    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8">
      <label className="block text-sm font-bold text-blue-700 mb-3 uppercase tracking-wide">
        Step 2: Predict Reddit's Choice
      </label>
      <p className="text-sm text-blue-600 mb-4">
        Which answer do you think will get the <strong>most votes</strong> overall?
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            disabled={disabled}
            className={`p-3 text-sm text-center rounded-lg border transition-all ${
              prediction === index
                ? 'border-blue-500 bg-blue-500 text-white font-bold shadow-md'
                : 'border-blue-200 bg-white text-blue-800 hover:bg-blue-100'
            } ${disabled && prediction !== index ? 'opacity-50' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PredictionSelector;

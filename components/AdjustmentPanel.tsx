/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../state/store';

const AdjustmentPanel: React.FC = () => {
  const { isLoading, adjustmentPrompt, setAdjustmentPrompt, handleApplyAdjustment } = useStore();
  
  const presets = [
    { name: 'Blur Background', prompt: 'Apply a realistic depth-of-field effect, making the background blurry while keeping the main subject in sharp focus.' },
    { name: 'Enhance Details', prompt: 'Slightly enhance the sharpness and details of the image without making it look unnatural.' },
    { name: 'Warmer Lighting', prompt: 'Adjust the color temperature to give the image warmer, golden-hour style lighting.' },
    { name: 'Studio Light', prompt: 'Add dramatic, professional studio lighting to the main subject.' },
  ];

  const handlePresetClick = (prompt: string) => {
    setAdjustmentPrompt(prompt);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-center text-gray-300">Professional Adjustment</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            className={`w-full text-center bg-white/5 border border-transparent text-gray-300 font-semibold py-2 px-3 rounded-md transition-all duration-200 ease-in-out hover:bg-white/10 hover:border-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${adjustmentPrompt === preset.prompt ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500 bg-white/10' : ''}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={adjustmentPrompt}
        onChange={(e) => setAdjustmentPrompt(e.target.value)}
        placeholder="Or describe an adjustment..."
        className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading}
      />

      <button
          onClick={handleApplyAdjustment}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !adjustmentPrompt.trim()}
      >
          Apply Adjustment
      </button>
    </div>
  );
};

export default AdjustmentPanel;
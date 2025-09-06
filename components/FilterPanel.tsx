/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../state/store';

const FilterPanel: React.FC = () => {
  const { isLoading, filterPrompt, setFilterPrompt, handleApplyFilter } = useStore();

  const presets = [
    { name: 'Synthwave', prompt: 'Apply a vibrant 80s synthwave aesthetic with neon magenta and cyan glows, and subtle scan lines.' },
    { name: 'Anime', prompt: 'Give the image a vibrant Japanese anime style, with bold outlines, cel-shading, and saturated colors.' },
    { name: 'Lomo', prompt: 'Apply a Lomography-style cross-processing film effect with high-contrast, oversaturated colors, and dark vignetting.' },
    { name: 'Glitch', prompt: 'Transform the image into a futuristic holographic projection with digital glitch effects and chromatic aberration.' },
  ];
  
  const handlePresetClick = (prompt: string) => {
    setFilterPrompt(prompt);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-center text-gray-300">Apply a Filter</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {presets.map(preset => (
          <button
            key={preset.name}
            onClick={() => handlePresetClick(preset.prompt)}
            disabled={isLoading}
            className={`w-full text-center bg-white/5 border border-transparent text-gray-300 font-semibold py-2 px-3 rounded-md transition-all duration-200 ease-in-out hover:bg-white/10 hover:border-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${filterPrompt === preset.prompt ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-blue-500 bg-white/10' : ''}`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <input
        type="text"
        value={filterPrompt}
        onChange={e => setFilterPrompt(e.target.value)}
        placeholder="Or describe a custom filter..."
        className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
        disabled={isLoading}
      />
      
      <button
        onClick={handleApplyFilter}
        className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
        disabled={isLoading || !filterPrompt.trim()}
      >
        Apply Filter
      </button>
    </div>
  );
};

export default FilterPanel;
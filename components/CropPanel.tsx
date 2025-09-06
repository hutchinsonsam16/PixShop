/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../state/store';

type AspectRatio = 'free' | '1:1' | '16:9';

const CropPanel: React.FC = () => {
  const { isLoading, completedCrop, aspect, setAspect, handleApplyCrop } = useStore();
  
  const handleAspectChange = (aspectValue: number | undefined) => {
    setAspect(aspectValue);
  }

  const aspects: { name: AspectRatio, value: number | undefined }[] = [
    { name: 'free', value: undefined },
    { name: '1:1', value: 1 / 1 },
    { name: '16:9', value: 16 / 9 },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-gray-300">Crop Image</h3>
      <p className="text-sm text-gray-400 -mt-2 text-center">Click and drag on the image to select an area, then apply the crop.</p>
      
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-400">Aspect Ratio:</span>
        {aspects.map(({ name, value }) => (
          <button
            key={name}
            onClick={() => handleAspectChange(value)}
            disabled={isLoading}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 ${
              aspect === value 
              ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-md shadow-blue-500/20' 
              : 'bg-white/10 hover:bg-white/20 text-gray-200'
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <button
        onClick={handleApplyCrop}
        disabled={isLoading || !completedCrop || completedCrop.width === 0}
        className="w-full mt-2 bg-gradient-to-br from-green-600 to-green-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
      >
        Apply Crop
      </button>
    </div>
  );
};

export default CropPanel;
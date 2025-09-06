/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { PaletteIcon } from './icons';
import { useStore } from '../state/store';

const ColorizePanel: React.FC = () => {
  const { isLoading, handleApplyColorize } = useStore();
  
  return (
    <div className="w-full flex flex-col items-center gap-4">
        <PaletteIcon className="w-8 h-8 text-cyan-400" />
      <h3 className="text-xl font-semibold text-center text-gray-200">Colorize Photo</h3>
      <p className="text-sm text-center text-gray-400">
        Bring your grayscale images to life. The AI will analyze the photo and add realistic, context-aware colors.
      </p>
      
      <button
          onClick={handleApplyColorize}
          className="w-full mt-2 bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold py-3 px-8 text-base rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
      >
          {isLoading ? 'Colorizing...' : 'Colorize Image'}
      </button>
    </div>
  );
};

export default ColorizePanel;
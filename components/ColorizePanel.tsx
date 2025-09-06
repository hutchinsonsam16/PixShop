/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { PaletteIcon } from './icons';

interface ColorizePanelProps {
  onApplyColorize: () => void;
  isLoading: boolean;
}

const ColorizePanel: React.FC<ColorizePanelProps> = ({ onApplyColorize, isLoading }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
        <PaletteIcon className="w-10 h-10 text-cyan-400" />
      <h3 className="text-xl font-semibold text-center text-gray-200">Colorize Black & White Photo</h3>
      <p className="text-md text-center text-gray-400 max-w-lg">
        Bring your grayscale images to life. The AI will analyze the photo and add realistic, context-aware colors.
      </p>
      
      <button
          onClick={onApplyColorize}
          className="w-full max-w-sm mt-4 bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-cyan-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
      >
          {isLoading ? 'Colorizing...' : 'Colorize Image'}
      </button>
    </div>
  );
};

export default ColorizePanel;
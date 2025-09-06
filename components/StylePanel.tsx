/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { UploadIcon, CloseIcon } from './icons';
import { useAppState } from '../state/appState';

interface StylePanelProps {
  onApplyStyle: () => void;
  isLoading: boolean;
  styleImage: File | null;
  setStyleImage: (file: File | null) => void;
}

const StylePanel: React.FC<StylePanelProps> = ({ onApplyStyle, isLoading, styleImage, setStyleImage }) => {
  const { state } = useAppState();
  const { styleImageUrl } = state;
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      setStyleImage(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <h3 className="text-lg font-semibold text-gray-300">Apply Image Style</h3>
      <p className="text-sm text-gray-400 -mt-2 text-center">Upload a reference image to transfer its style.</p>

      {!styleImageUrl ? (
         <div 
          className={`w-full h-32 flex flex-col items-center justify-center text-center p-4 transition-all duration-300 rounded-lg border-2 ${isDraggingOver ? 'bg-blue-500/10 border-dashed border-blue-400' : 'bg-black/20 border-dashed border-gray-600'}`}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          <UploadIcon className="w-6 h-6 text-gray-400 mb-2" />
          <label htmlFor="style-image-upload" className="font-semibold text-blue-400 cursor-pointer hover:underline text-sm">
            Choose an image
            <input id="style-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </label>
          <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
        </div>
      ) : (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden shadow-lg">
            <img src={styleImageUrl} alt="Style reference" className="w-full h-full object-cover" />
            <button
                onClick={() => setStyleImage(null)}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-1 text-white hover:bg-black/80 transition-all active:scale-90"
                aria-label="Remove style image"
                disabled={isLoading}
            >
                <CloseIcon className="w-4 h-4" />
            </button>
        </div>
      )}

      <button
        onClick={onApplyStyle}
        disabled={isLoading || !styleImage}
        className="w-full mt-2 bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
      >
        Apply Style
      </button>
    </div>
  );
};

export default StylePanel;
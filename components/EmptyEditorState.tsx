/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { UploadIcon } from './icons';

interface EmptyEditorStateProps {
  onFileSelect: (files: FileList | null) => void;
}

const EmptyEditorState: React.FC<EmptyEditorStateProps> = ({ onFileSelect }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    onFileSelect(e.dataTransfer.files);
  };

  return (
    <div 
      className={`w-full bg-gray-800/50 border-2 rounded-lg p-8 flex flex-col items-center justify-center gap-4 text-center animate-fade-in backdrop-blur-sm ${isDraggingOver ? 'border-dashed border-blue-400 bg-blue-500/10' : 'border-dashed border-gray-700'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={handleDrop}
    >
      <h2 className="text-2xl font-bold text-gray-200">Upload an Image to Start Editing</h2>
      <p className="text-gray-400 max-w-md">Once you upload an image, you can use the tools above to retouch, adjust, crop, or apply filters and styles.</p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <label htmlFor="image-upload-empty" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-full cursor-pointer group hover:bg-blue-500 transition-colors">
          <UploadIcon className="w-6 h-6 mr-3" />
          Upload Image
        </label>
        <input id="image-upload-empty" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
        <p className="text-sm text-gray-500">or drag and drop a file</p>
      </div>
    </div>
  );
};

export default EmptyEditorState;
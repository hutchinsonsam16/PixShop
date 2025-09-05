/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface GeneratePanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onGenerate(prompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-6 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-2xl font-bold text-center text-gray-200">Generate Image From Scratch</h3>
      <p className="text-md text-center text-gray-400 -mt-2">Describe the image you want to create. Be as detailed as you like.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic lion wearing a crown, studio lighting, hyperrealistic, 4k"
          className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
          aria-label="Image generation prompt"
        />
        <button
          type="submit"
          className="w-full max-w-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
};

export default GeneratePanel;
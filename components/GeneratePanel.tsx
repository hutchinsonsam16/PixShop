/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { MagicWandIcon } from './icons';
import { useStore } from '../state/store';

const GeneratePanel: React.FC = () => {
  const { 
    generatePrompt, 
    setGeneratePrompt,
    isLoading,
    isEnhancingPrompt,
    handleGenerateImageFromPrompt,
    handleEnhancePrompt,
  } = useStore();

  const themes = [
      { name: 'Photorealistic', value: ', photorealistic, 4k, ultra high definition, sharp focus' },
      { name: 'Anime', value: ', vibrant anime style, cel shaded, by studio ghibli' },
      { name: 'Fantasy Art', value: ', fantasy art, detailed, digital painting, by greg rutkowski' },
      { name: 'Sci-Fi', value: ', sci-fi concept art, futuristic, cyberpunk aesthetic' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (generatePrompt.trim() && !isLoading && !isEnhancingPrompt) {
      handleGenerateImageFromPrompt();
    }
  };
  
  const handleThemeClick = (themePrompt: string) => {
    // FIX: Use generatePrompt from useStore hook instead of get()
    setGeneratePrompt(
        generatePrompt.trim().replace(/,$/, '').trim() + themePrompt
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-bold text-center text-gray-200">Generate From Scratch</h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Describe the image you want to create.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <textarea
          value={generatePrompt}
          onChange={(e) => setGeneratePrompt(e.target.value)}
          placeholder="e.g., A majestic lion wearing a crown, studio lighting..."
          className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-3 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading || isEnhancingPrompt}
          aria-label="Image generation prompt"
        />

        <div className="w-full flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-400">
                <MagicWandIcon className="w-4 h-4" />
                <span>Need inspiration?</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isLoading || isEnhancingPrompt || !generatePrompt.trim()}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Enhance prompt with AI"
                >
                    {isEnhancingPrompt ? 'Enhancing...' : '✨ Enhance Prompt'}
                </button>
                {themes.map(theme => (
                    <button
                        key={theme.name}
                        type="button"
                        onClick={() => setGeneratePrompt(generatePrompt + theme.value)}
                        disabled={isLoading || isEnhancingPrompt}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-200 hover:bg-white/20 transition-colors disabled:opacity-50"
                        aria-label={`Add ${theme.name} style to prompt`}
                    >
                        {theme.name}
                    </button>
                ))}
            </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-8 text-base rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || isEnhancingPrompt || !generatePrompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
};

export default GeneratePanel;
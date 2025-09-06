/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { MagicWandIcon } from './icons';
import { enhancePrompt } from '../services/geminiService';
import { useAppState } from '../state/appState';

interface GeneratePanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { dispatch } = useAppState();

  const themes = [
      { name: 'Photorealistic', value: ', photorealistic, 4k, ultra high definition, sharp focus' },
      { name: 'Anime', value: ', vibrant anime style, cel shaded, by studio ghibli' },
      { name: 'Fantasy Art', value: ', fantasy art, detailed, digital painting, by greg rutkowski' },
      { name: 'Sci-Fi', value: ', sci-fi concept art, futuristic, cyberpunk aesthetic' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !isEnhancing) {
      onGenerate(prompt);
    }
  };
  
  const handleThemeClick = (themePrompt: string) => {
    setPrompt(prev => {
        const trimmed = prev.trim().replace(/,$/, '').trim();
        return `${trimmed}${themePrompt}`;
    });
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing || isLoading) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (error) {
      console.error("Failed to enhance prompt:", error);
      const message = error instanceof Error ? error.message : "An unknown error occurred.";
      dispatch({ type: 'SET_ERROR', payload: `Failed to enhance prompt: ${message}`});
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-xl font-bold text-center text-gray-200">Generate From Scratch</h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Describe the image you want to create.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A majestic lion wearing a crown, studio lighting..."
          className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-3 h-28 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading || isEnhancing}
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
                    disabled={isLoading || isEnhancing || !prompt.trim()}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Enhance prompt with AI"
                >
                    {isEnhancing ? 'Enhancing...' : '✨ Enhance Prompt'}
                </button>
                {themes.map(theme => (
                    <button
                        key={theme.name}
                        type="button"
                        onClick={() => handleThemeClick(theme.value)}
                        disabled={isLoading || isEnhancing}
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
          disabled={isLoading || isEnhancing || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
};

export default GeneratePanel;
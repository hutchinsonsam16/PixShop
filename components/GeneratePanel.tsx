/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { MagicWandIcon } from './icons';
import { enhancePrompt } from '../services/geminiService';

interface GeneratePanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const GeneratePanel: React.FC<GeneratePanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const themes = [
      { name: 'Photorealistic', value: ', photorealistic, 4k, ultra high definition, sharp focus' },
      { name: 'Anime', value: ', vibrant anime style, cel shaded, by studio ghibli' },
      { name: 'Fantasy Art', value: ', fantasy art, detailed, digital painting, by greg rutkowski' },
      { name: 'Sci-Fi', value: ', sci-fi concept art, futuristic, cyberpunk aesthetic' },
      { name: 'Vintage', value: ', vintage photograph, 1970s, grainy film, warm tones' },
      { name: 'Watercolor', value: ', watercolor painting, soft, blended colors' },
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
      // Future improvement: show an error toast to the user.
    } finally {
      setIsEnhancing(false);
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
          placeholder="e.g., A majestic lion wearing a crown, studio lighting..."
          className="w-full bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 h-32 focus:ring-2 focus:ring-blue-500 focus:outline-none transition disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading || isEnhancing}
          aria-label="Image generation prompt"
        />

        <div className="w-full flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
                <MagicWandIcon className="w-5 h-5" />
                <span>Need inspiration? Enhance your prompt or add a style:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                <button
                    type="button"
                    onClick={handleEnhancePrompt}
                    disabled={isLoading || isEnhancing || !prompt.trim()}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 text-gray-200 hover:bg-white/20 transition-colors disabled:opacity-50"
                        aria-label={`Add ${theme.name} style to prompt`}
                    >
                        {theme.name}
                    </button>
                ))}
            </div>
        </div>

        <button
          type="submit"
          className="w-full max-w-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || isEnhancing || !prompt.trim()}
        >
          {isLoading ? 'Generating...' : 'Generate Image'}
        </button>
      </form>
    </div>
  );
};

export default GeneratePanel;
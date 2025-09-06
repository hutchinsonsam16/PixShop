/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../state/store';
import { MagicWandIcon, PaintBrushIcon, PaletteIcon, CropIcon, SunIcon, FilterIcon, StyleIcon } from './icons';

type Tool = 'generate' | 'retouch' | 'colorize' | 'adjust' | 'filters' | 'crop' | 'style';

interface ToolConfig {
    id: Tool;
    name: string;
    icon: React.FC<{className?: string}>;
    disabled?: boolean;
}

const Toolbar: React.FC = () => {
    const { activeTool, historyIndex, setActiveTool } = useStore();

    const hasImage = historyIndex > -1;

    const tools: ToolConfig[] = [
        { id: 'generate', name: 'Generate', icon: MagicWandIcon },
        { id: 'retouch', name: 'Retouch', icon: PaintBrushIcon, disabled: !hasImage },
        { id: 'colorize', name: 'Colorize', icon: PaletteIcon, disabled: !hasImage },
        { id: 'crop', name: 'Crop', icon: CropIcon, disabled: !hasImage },
        { id: 'adjust', name: 'Adjust', icon: SunIcon, disabled: !hasImage },
        { id: 'filters', name: 'Filters', icon: FilterIcon, disabled: !hasImage },
        { id: 'style', name: 'Style Transfer', icon: StyleIcon, disabled: !hasImage },
    ];

    const handleToolSelect = (tool: Tool) => {
        if (tool !== 'generate' && !hasImage) return;
        setActiveTool(tool);
    };

    return (
        <aside className="bg-gray-900/50 border-r border-gray-700/50 p-2 flex flex-col items-center gap-2 backdrop-blur-sm">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => handleToolSelect(tool.id)}
                    disabled={tool.disabled}
                    className={`w-16 h-16 flex flex-col items-center justify-center rounded-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500
                        ${activeTool === tool.id 
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white' 
                            : 'text-gray-400 hover:bg-white/10 hover:text-gray-200 disabled:text-gray-600 disabled:hover:bg-transparent disabled:cursor-not-allowed'}
                    `}
                    aria-label={tool.name}
                    aria-pressed={activeTool === tool.id}
                >
                    <tool.icon className="w-6 h-6 mb-1 transition-transform group-hover:scale-110" />
                    <span className="text-xs font-medium">{tool.name}</span>
                </button>
            ))}
        </aside>
    );
};

export default Toolbar;
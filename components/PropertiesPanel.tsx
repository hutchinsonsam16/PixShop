/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../state/store';
import GeneratePanel from './GeneratePanel';
import AdjustmentPanel from './AdjustmentPanel';
import FilterPanel from './FilterPanel';
import CropPanel from './CropPanel';
import StylePanel from './StylePanel';
import ColorizePanel from './ColorizePanel';

const RetouchPanel: React.FC = () => {
    const { retouchPrompt, setRetouchPrompt, editHotspot, isLoading, handleRetouch } = useStore();

    return (
        <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-center text-gray-300">Retouch Image</h3>
            <p className="text-sm text-center text-gray-400">
                {editHotspot ? 'Great! Now describe your localized edit below.' : 'Click an area on the image to make a precise edit.'}
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleRetouch(); }} className="w-full flex items-center gap-2">
                <input
                    type="text"
                    value={retouchPrompt}
                    onChange={(e) => setRetouchPrompt(e.target.value)}
                    placeholder={editHotspot ? "e.g., 'change my shirt color to blue'" : "First click a point on the image"}
                    className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoading || !editHotspot}
                    aria-label="Retouch prompt"
                />
                <button
                    type="submit"
                    className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-6 text-base rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading || !retouchPrompt.trim() || !editHotspot}
                >
                    Apply
                </button>
            </form>
        </div>
    );
};

const PropertiesPanel: React.FC = () => {
    const activeTool = useStore(s => s.activeTool);

    const renderPanelContent = () => {
        switch (activeTool) {
            case 'generate':
                return <GeneratePanel />;
            case 'retouch':
                return <RetouchPanel />;
            case 'adjust':
                return <AdjustmentPanel />;
            case 'filters':
                return <FilterPanel />;
            case 'crop':
                return <CropPanel />;
            case 'style':
                return <StylePanel />;
            case 'colorize':
                return <ColorizePanel />;
            default:
                return <div className="p-4 text-center text-gray-500">Select a tool to see its properties.</div>;
        }
    }

    return (
        <div className="p-4">
            {renderPanelContent()}
        </div>
    );
};

export default PropertiesPanel;
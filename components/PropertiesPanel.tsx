/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useAppState, useActions } from '../state/appState';
import GeneratePanel from './GeneratePanel';
import AdjustmentPanel from './AdjustmentPanel';
import FilterPanel from './FilterPanel';
import CropPanel from './CropPanel';
import StylePanel from './StylePanel';
import ColorizePanel from './ColorizePanel';

const RetouchPanel: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { handleGenerate } = useActions();
    const { prompt, editHotspot, isLoading } = state;

    return (
        <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-center text-gray-400">
                {editHotspot ? 'Great! Now describe your localized edit below.' : 'Click an area on the image to make a precise edit.'}
            </p>
            <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }} className="w-full flex items-center gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => dispatch({ type: 'SET_PROMPT', payload: e.target.value })}
                    placeholder={editHotspot ? "e.g., 'change my shirt color to blue'" : "First click a point on the image"}
                    className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoading || !editHotspot}
                    aria-label="Retouch prompt"
                />
                <button
                    type="submit"
                    className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-3 px-6 text-base rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-gray-600 disabled:to-gray-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isLoading || !prompt.trim() || !editHotspot}
                >
                    Apply
                </button>
            </form>
        </div>
    );
};

const PropertiesPanel: React.FC = () => {
    const { state, dispatch } = useAppState();
    const { handleGenerateImageFromPrompt, handleApplyAdjustment, handleApplyFilter, handleApplyCrop, handleApplyStyle, handleSetStyleImage, handleApplyColorize } = useActions();
    const { activeTool, isLoading, completedCrop, styleImage } = state;

    const renderPanelContent = () => {
        switch (activeTool) {
            case 'generate':
                return <GeneratePanel onGenerate={handleGenerateImageFromPrompt} isLoading={isLoading} />;
            case 'retouch':
                return <RetouchPanel />;
            case 'adjust':
                return <AdjustmentPanel onApplyAdjustment={handleApplyAdjustment} isLoading={isLoading} />;
            case 'filters':
                return <FilterPanel onApplyFilter={handleApplyFilter} isLoading={isLoading} />;
            case 'crop':
                return <CropPanel onApplyCrop={() => handleApplyCrop(React.createRef<HTMLImageElement>())} onSetAspect={(aspect) => dispatch({ type: 'SET_ASPECT', payload: aspect })} isLoading={isLoading} isCropping={!!completedCrop?.width && completedCrop.width > 0} />;
            case 'style':
                return <StylePanel onApplyStyle={handleApplyStyle} isLoading={isLoading} styleImage={styleImage} setStyleImage={handleSetStyleImage} />;
            case 'colorize':
                return <ColorizePanel onApplyColorize={handleApplyColorize} isLoading={isLoading} />;
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

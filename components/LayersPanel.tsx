/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { useStore } from '../state/store';

const LayersPanel: React.FC = () => {
    const { history, historyIndex, setHistoryIndex } = useStore();

    if (history.length === 0) {
        return <div className="p-4 text-center text-gray-500 text-sm">No image loaded. Upload an image to start.</div>;
    }

    return (
        <div className="p-2 flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-gray-400 px-2">Layers</h3>
            <ul className="flex flex-col-reverse">
                {history.map((item, index) => (
                    <li key={item.id}>
                        <button
                            onClick={() => setHistoryIndex(index)}
                            className={`w-full flex items-center gap-3 p-2 rounded-md text-left transition-colors duration-200 ${
                                index === historyIndex
                                    ? 'bg-blue-500/20'
                                    : 'hover:bg-white/10'
                            }`}
                        >
                            <div className="flex-shrink-0 w-12 h-12 rounded-md bg-black/30 overflow-hidden">
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className={`text-sm font-medium ${index === historyIndex ? 'text-blue-300' : 'text-gray-300'}`}>
                                {item.name}
                            </span>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LayersPanel;
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import PropertiesPanel from './PropertiesPanel';
import LayersPanel from './LayersPanel';

type SidebarTab = 'properties' | 'layers';

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<SidebarTab>('properties');

    return (
        <aside className="w-full md:w-96 bg-gray-900/50 border-l border-gray-700/50 flex flex-col backdrop-blur-sm">
            <div className="flex-shrink-0 border-b border-gray-700/50">
                <nav className="flex items-stretch">
                    <button 
                        onClick={() => setActiveTab('properties')}
                        className={`flex-1 p-3 text-sm font-semibold transition-colors duration-200 ${activeTab === 'properties' ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                    >
                        Properties
                    </button>
                    <div className="w-px bg-gray-700/50"></div>
                    <button 
                        onClick={() => setActiveTab('layers')}
                        className={`flex-1 p-3 text-sm font-semibold transition-colors duration-200 ${activeTab === 'layers' ? 'text-white bg-white/10' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
                    >
                        Layers
                    </button>
                </nav>
            </div>
            <div className="flex-grow overflow-y-auto">
                {activeTab === 'properties' && <PropertiesPanel />}
                {activeTab === 'layers' && <LayersPanel />}
            </div>
        </aside>
    );
};

export default Sidebar;

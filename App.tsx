/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useCallback } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { useStore } from './state/store';
import Header from './components/Header';
import Spinner from './components/Spinner';
import EmptyEditorState from './components/EmptyEditorState';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import Toast from './components/Toast';

import { UndoIcon, RedoIcon, EyeIcon } from './components/icons';

const ActionBar: React.FC = () => {
    const { history, historyIndex, undo, redo, resetHistory, resetState, setIsComparing } = useStore();
    const canUndo = historyIndex > 0;
    const canRedo = historyIndex < history.length - 1;

    const handleDownload = useCallback(() => {
      const currentImage = useStore.getState().history[useStore.getState().historyIndex]?.file;
      if (currentImage) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(currentImage);
          link.download = `edited-${currentImage.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
      }
    }, []);

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-gray-900/50 border-b border-gray-700/50 backdrop-blur-sm">
            <button onClick={undo} disabled={!canUndo} className="flex items-center justify-center bg-white/10 border border-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm hover:bg-white/20 hover:border-white/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Undo"> <UndoIcon className="w-5 h-5 mr-2" /> Undo </button>
            <button onClick={redo} disabled={!canRedo} className="flex items-center justify-center bg-white/10 border border-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm hover:bg-white/20 hover:border-white/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Redo"> <RedoIcon className="w-5 h-5 mr-2" /> Redo </button>
            <div className="h-6 w-px bg-gray-600 mx-1 hidden sm:block"></div>
            {canUndo && (
                <button
                    onMouseDown={() => setIsComparing(true)}
                    onMouseUp={() => setIsComparing(false)}
                    onMouseLeave={() => setIsComparing(false)}
                    onTouchStart={() => setIsComparing(true)}
                    onTouchEnd={() => setIsComparing(false)}
                    className="flex items-center justify-center bg-white/10 border border-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm hover:bg-white/20 hover:border-white/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Compare with original"
                >
                    <EyeIcon className="w-5 h-5 mr-2" /> Compare
                </button>
            )}
            <button onClick={resetHistory} disabled={!canUndo} className="flex items-center justify-center bg-transparent border border-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm hover:bg-white/20 hover:border-white/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"> Reset </button>
            <div className="flex-grow"></div>
            <button onClick={resetState} className="flex items-center justify-center bg-transparent border border-white/20 text-gray-200 font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out text-sm hover:bg-white/20 hover:border-white/30 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"> Upload New </button>
            <button onClick={handleDownload} disabled={history.length === 0} className="ml-2 bg-gradient-to-br from-green-600 to-green-500 text-white font-bold py-2 px-4 rounded-md transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:shadow-none disabled:transform-none"> Download Image </button>
        </div>
    );
};

const App: React.FC = () => {
    const { history, historyIndex, isLoading, activeTool, isComparing, crop, aspect, displayHotspot } = useStore();
    const { handleImageUpload, setHotspot, setCrop, setCompletedCrop } = useStore();
    
    const imgRef = useRef<HTMLImageElement>(null);
    
    const currentImageItem = history[historyIndex] ?? null;
    const originalImageItem = history[0] ?? null;

    const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (activeTool !== 'retouch' || !imgRef.current) return;
        
        const img = imgRef.current;
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        const { naturalWidth, naturalHeight, clientWidth, clientHeight } = img;
        const scaleX = naturalWidth / clientWidth;
        const scaleY = naturalHeight / clientHeight;

        setHotspot({
            display: { x: offsetX, y: offsetY },
            edit: { x: Math.round(offsetX * scaleX), y: Math.round(offsetY * scaleY) }
        });
    };

    const renderImageDisplay = () => {
        if (!currentImageItem) {
            return <EmptyEditorState onFileSelect={(files) => files && handleImageUpload(files[0])} />;
        }

        return (
            <div className="relative w-full h-full flex items-center justify-center p-8 bg-black/20">
                <div className="relative shadow-2xl rounded-xl overflow-hidden max-w-full max-h-full">
                    {isLoading && (
                        <div className="absolute inset-0 bg-black/70 z-30 flex flex-col items-center justify-center gap-4 animate-fade-in">
                            <Spinner />
                            <p className="text-gray-300">AI is working its magic...</p>
                        </div>
                    )}
                    
                    {activeTool === 'crop' ? (
                        <ReactCrop 
                            crop={crop} 
                            onChange={c => setCrop(c)} 
                            onComplete={c => setCompletedCrop(c)}
                            aspect={aspect}
                            className="max-h-full"
                        >
                            <img ref={imgRef} src={currentImageItem.url} alt="Crop this image" className="object-contain max-h-[calc(100vh-200px)]"/>
                        </ReactCrop>
                    ) : (
                        <div className={`relative ${activeTool === 'retouch' ? 'cursor-crosshair' : ''}`} onClick={handleImageClick}>
                             <img src={originalImageItem.url} alt="Original" className="object-contain max-h-[calc(100vh-200px)] pointer-events-none" />
                             <img ref={imgRef} src={currentImageItem.url} alt="Current" className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-200 ease-in-out ${isComparing ? 'opacity-0' : 'opacity-100'}`} />
                        </div>
                    )}

                    {displayHotspot && !isLoading && activeTool === 'retouch' && (
                        <div 
                            className="absolute rounded-full w-6 h-6 bg-blue-500/50 border-2 border-white pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                            style={{ left: `${displayHotspot.x}px`, top: `${displayHotspot.y}px` }}
                        >
                            <div className="absolute inset-0 rounded-full w-6 h-6 animate-ping bg-blue-400"></div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen text-gray-100 flex flex-col bg-gray-800">
            <Header />
            <Toast />
            <div className="flex-grow flex h-[calc(100vh-65px)]">
                <Toolbar />
                <main className="flex-grow flex flex-col">
                    <ActionBar />
                    {renderImageDisplay()}
                </main>
                <Sidebar />
            </div>
        </div>
    );
};

export default App;
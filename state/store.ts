/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { create } from 'zustand';
import { Crop, PixelCrop } from 'react-image-crop';
import * as geminiService from '../services/geminiService';

// TYPES
type Tool = 'generate' | 'retouch' | 'colorize' | 'adjust' | 'filters' | 'crop' | 'style';

export interface HistoryItem {
    id: string;
    file: File;
    name: string;
    url: string; // Object URL for rendering
}

interface AppState {
    // Core State
    history: HistoryItem[];
    historyIndex: number;
    isLoading: boolean;
    isEnhancingPrompt: boolean;
    error: { id: number, message: string } | null;
    activeTool: Tool;
    isComparing: boolean;

    // Tool-Specific State
    retouchPrompt: string;
    generatePrompt: string;
    filterPrompt: string;
    adjustmentPrompt: string;
    editHotspot: { x: number; y: number } | null;
    displayHotspot: { x: number; y: number } | null;
    styleImage: File | null;
    styleImageUrl: string | null;
    crop: Crop | undefined;
    completedCrop: PixelCrop | undefined;
    aspect: number | undefined;

    // Actions
    setActiveTool: (tool: Tool) => void;
    setError: (message: string | null) => void;
    setRetouchPrompt: (prompt: string) => void;
    setGeneratePrompt: (prompt: string) => void;
    setFilterPrompt: (prompt: string) => void;
    setAdjustmentPrompt: (prompt: string) => void;
    setHotspot: (hotspot: { edit: { x: number; y: number }; display: { x: number; y: number } } | null) => void;
    setCrop: (crop: Crop | undefined) => void;
    setCompletedCrop: (crop: PixelCrop | undefined) => void;
    setAspect: (aspect: number | undefined) => void;
    setIsComparing: (isComparing: boolean) => void;
    setHistoryIndex: (index: number) => void;

    // History Actions
    undo: () => void;
    redo: () => void;
    resetHistory: () => void;
    resetState: () => void;

    // Async Actions
    handleImageUpload: (file: File) => void;
    handleGenerateImageFromPrompt: () => Promise<void>;
    handleRetouch: () => Promise<void>;
    handleApplyFilter: () => Promise<void>;
    handleApplyAdjustment: () => Promise<void>;
    handleApplyColorize: () => Promise<void>;
    handleApplyStyle: () => Promise<void>;
    handleApplyCrop: () => Promise<void>;
    handleSetStyleImage: (file: File | null) => void;
    handleEnhancePrompt: () => Promise<void>;
}

// HELPERS
const dataURLtoFile = async (dataurl: string, filename: string): Promise<File> => {
    const res = await fetch(dataurl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};

const createHistoryItem = (file: File, name: string): HistoryItem => ({
    file,
    name,
    id: `${Date.now()}-${Math.random()}`,
    url: URL.createObjectURL(file),
});

const initialState = {
    history: [],
    historyIndex: -1,
    isLoading: false,
    isEnhancingPrompt: false,
    error: null,
    activeTool: 'generate' as Tool,
    isComparing: false,
    retouchPrompt: '',
    generatePrompt: '',
    filterPrompt: '',
    adjustmentPrompt: '',
    editHotspot: null,
    displayHotspot: null,
    styleImage: null,
    styleImageUrl: null,
    crop: undefined,
    completedCrop: undefined,
    aspect: undefined,
};

// STORE
// FIX: Refactored the store to define _performAction as a local helper function.
export const useStore = create<AppState>((set, get) => {
    // Generic action performer
    const _performAction = async (actionName: string, serviceCall: () => Promise<string>) => {
        set({ isLoading: true, error: null });
        try {
            const imageUrl = await serviceCall();
            const newImageFile = await dataURLtoFile(imageUrl, `${actionName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.png`);
            const newHistoryItem = createHistoryItem(newImageFile, actionName);
            
            set(state => {
                const newHistory = state.history.slice(0, state.historyIndex + 1);
                state.history.slice(state.historyIndex + 1).forEach(item => URL.revokeObjectURL(item.url));
                newHistory.push(newHistoryItem);
                return { history: newHistory, historyIndex: newHistory.length - 1, editHotspot: null, displayHotspot: null, crop: undefined, completedCrop: undefined };
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            get().setError(`Failed to ${actionName.toLowerCase()}. ${errorMessage}`);
        } finally {
            set({ isLoading: false });
        }
    };

    return {
        ...initialState,

        // SETTERS
        setActiveTool: (tool) => set({ activeTool: tool }),
        setError: (message) => set({ error: message ? { id: Date.now(), message } : null }),
        setRetouchPrompt: (prompt) => set({ retouchPrompt: prompt }),
        setGeneratePrompt: (prompt) => set({ generatePrompt: prompt }),
        setFilterPrompt: (prompt) => set({ filterPrompt: prompt }),
        setAdjustmentPrompt: (prompt) => set({ adjustmentPrompt: prompt }),
        setHotspot: (hotspot) => set({ editHotspot: hotspot?.edit ?? null, displayHotspot: hotspot?.display ?? null }),
        setCrop: (crop) => set({ crop }),
        setCompletedCrop: (crop) => set({ completedCrop: crop }),
        setAspect: (aspect) => set({ aspect }),
        setIsComparing: (isComparing) => set({ isComparing }),
        setHistoryIndex: (index) => set({ historyIndex: index, editHotspot: null, displayHotspot: null }),

        // HISTORY ACTIONS
        undo: () => set(state => ({
            historyIndex: Math.max(0, state.historyIndex - 1),
            editHotspot: null,
            displayHotspot: null
        })),
        redo: () => set(state => ({
            historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
            editHotspot: null,
            displayHotspot: null
        })),
        resetHistory: () => set({ historyIndex: 0, editHotspot: null, displayHotspot: null }),
        resetState: () => {
            get().history.forEach(item => URL.revokeObjectURL(item.url));
            const styleUrl = get().styleImageUrl;
            if (styleUrl) URL.revokeObjectURL(styleUrl);
            set(initialState);
        },

        // ASYNC ACTIONS
        handleImageUpload: (file) => {
            get().history.forEach(item => URL.revokeObjectURL(item.url));
            const newHistoryItem = createHistoryItem(file, 'Original Image');
            set({ ...initialState, history: [newHistoryItem], historyIndex: 0, activeTool: 'retouch' });
        },

        handleSetStyleImage: (file) => {
            const currentUrl = get().styleImageUrl;
            if (currentUrl) URL.revokeObjectURL(currentUrl);
            const url = file ? URL.createObjectURL(file) : null;
            set({ styleImage: file, styleImageUrl: url });
        },

        handleEnhancePrompt: async () => {
            const { generatePrompt, setError } = get();
            if (!generatePrompt.trim()) return;
            set({ isEnhancingPrompt: true });
            try {
                const enhanced = await geminiService.enhancePrompt(generatePrompt);
                set({ generatePrompt: enhanced });
            } catch (err) {
                const message = err instanceof Error ? err.message : "An unknown error occurred.";
                setError(`Failed to enhance prompt: ${message}`);
            } finally {
                set({ isEnhancingPrompt: false });
            }
        },
        
        handleGenerateImageFromPrompt: async () => {
            const { generatePrompt, setActiveTool } = get();
            await _performAction('Generate Image', () => geminiService.generateImageFromPrompt(generatePrompt));
            if (!get().error) {
                setActiveTool('retouch');
            }
        },

        handleRetouch: async () => {
            const { history, historyIndex, retouchPrompt, editHotspot, setError } = get();
            const currentImage = history[historyIndex]?.file;
            if (!currentImage || !retouchPrompt.trim() || !editHotspot) {
                setError('Please select an area on the image and provide a prompt.');
                return;
            }
            await _performAction('Retouch', () => geminiService.generateEditedImage(currentImage, retouchPrompt, editHotspot));
        },

        handleApplyFilter: async () => {
            const { history, historyIndex, filterPrompt } = get();
            const currentImage = history[historyIndex]?.file;
            if (!currentImage || !filterPrompt.trim()) return;
            await _performAction(filterPrompt, () => geminiService.generateFilteredImage(currentImage, filterPrompt));
        },

        handleApplyAdjustment: async () => {
            const { history, historyIndex, adjustmentPrompt } = get();
            const currentImage = history[historyIndex]?.file;
            if (!currentImage || !adjustmentPrompt.trim()) return;
            await _performAction(adjustmentPrompt, () => geminiService.generateAdjustedImage(currentImage, adjustmentPrompt));
        },

        handleApplyColorize: async () => {
            const { history, historyIndex } = get();
            const currentImage = history[historyIndex]?.file;
            if (!currentImage) return;
            await _performAction('Colorize', () => geminiService.generateColorizedImage(currentImage));
        },

        handleApplyStyle: async () => {
            const { history, historyIndex, styleImage, setError } = get();
            const currentImage = history[historyIndex]?.file;
            if (!currentImage || !styleImage) {
                setError('Please provide a content image and a style image.');
                return;
            }
            await _performAction('Style Transfer', () => geminiService.generateStyledImage(currentImage, styleImage));
        },

        handleApplyCrop: async () => {
            const { completedCrop, history, historyIndex } = get();
            const currentImageItem = history[historyIndex];
            if (!completedCrop || !currentImageItem) return;

            const image = new Image();
            image.src = currentImageItem.url;
            await new Promise(resolve => { image.onload = resolve });

            const canvas = document.createElement('canvas');
            const scaleX = image.naturalWidth / image.width;
            const scaleY = image.naturalHeight / image.height;
            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            ctx.drawImage(
                image,
                completedCrop.x * scaleX,
                completedCrop.y * scaleY,
                completedCrop.width * scaleX,
                completedCrop.height * scaleY,
                0,
                0,
                completedCrop.width,
                completedCrop.height,
            );
            const croppedImageUrl = canvas.toDataURL('image/png');
            await _performAction('Crop', () => Promise.resolve(croppedImageUrl));
        },
    };
});

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { createContext, useReducer, useContext, useEffect, useCallback, ReactNode } from 'react';
import { generateEditedImage, generateFilteredImage, generateAdjustedImage, generateStyledImage, generateImageFromPrompt, generateColorizedImage } from '../services/geminiService';
import { Crop, PixelCrop } from 'react-image-crop';

// Helper to convert a data URL string to a File object
const dataURLtoFile = async (dataurl: string, filename:string): Promise<File> => {
    const res = await fetch(dataurl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
}

// STATE AND TYPES
type Tool = 'generate' | 'retouch' | 'colorize' | 'adjust' | 'filters' | 'crop' | 'style';

export interface HistoryItem {
    id: string;
    file: File;
    name: string;
    url: string; // Object URL for rendering
}

interface AppState {
    history: HistoryItem[];
    historyIndex: number;
    isLoading: boolean;
    error: { id: number, message: string } | null;
    activeTool: Tool;
    prompt: string;
    editHotspot: { x: number; y: number } | null;
    displayHotspot: { x: number; y: number } | null;
    styleImage: File | null;
    styleImageUrl: string | null; // For previewing style image
    crop: Crop | undefined;
    completedCrop: PixelCrop | undefined;
    aspect: number | undefined;
    isComparing: boolean;
}

const initialState: AppState = {
    history: [],
    historyIndex: -1,
    isLoading: false,
    error: null,
    activeTool: 'generate',
    prompt: '',
    editHotspot: null,
    displayHotspot: null,
    styleImage: null,
    styleImageUrl: null,
    crop: undefined,
    completedCrop: undefined,
    aspect: undefined,
    isComparing: false,
};

// ACTIONS
type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TOOL'; payload: Tool }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'SET_HOTSPOT'; payload: { edit: { x: number; y: number }; display: { x: number; y: number } } | null }
  | { type: 'SET_CROP'; payload: Crop | undefined }
  | { type: 'SET_COMPLETED_CROP'; payload: PixelCrop | undefined }
  | { type: 'SET_ASPECT'; payload: number | undefined }
  | { type: 'SET_IS_COMPARING'; payload: boolean }
  | { type: 'SET_STYLE_IMAGE'; payload: { file: File | null; url: string | null } }
  | { type: 'INITIALIZE_HISTORY'; payload: HistoryItem }
  | { type: 'ADD_HISTORY_ITEM'; payload: HistoryItem }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  // FIX: Added SET_HISTORY_INDEX action type
  | { type: 'SET_HISTORY_INDEX'; payload: number }
  | { type: 'RESET_HISTORY' }
  | { type: 'RESET_STATE' };


// REDUCER
const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload ? { id: Date.now(), message: action.payload } : null };
    case 'SET_ACTIVE_TOOL':
      return { ...state, activeTool: action.payload };
    case 'SET_PROMPT':
        return { ...state, prompt: action.payload };
    case 'SET_HOTSPOT':
        return { ...state, editHotspot: action.payload?.edit ?? null, displayHotspot: action.payload?.display ?? null };
    case 'SET_CROP':
        return { ...state, crop: action.payload };
    case 'SET_COMPLETED_CROP':
        return { ...state, completedCrop: action.payload };
    case 'SET_ASPECT':
        return { ...state, aspect: action.payload };
    case 'SET_IS_COMPARING':
        return { ...state, isComparing: action.payload };
    case 'SET_STYLE_IMAGE':
        return { ...state, styleImage: action.payload.file, styleImageUrl: action.payload.url };
    case 'INITIALIZE_HISTORY':
      // Revoke URLs from previous history
      state.history.forEach(item => URL.revokeObjectURL(item.url));
      return { ...initialState, activeTool: 'retouch', history: [action.payload], historyIndex: 0 };
    case 'ADD_HISTORY_ITEM': {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      // Revoke URLs from redo stack that is being cleared
      state.history.slice(state.historyIndex + 1).forEach(item => URL.revokeObjectURL(item.url));
      newHistory.push(action.payload);
      return { ...state, history: newHistory, historyIndex: newHistory.length - 1, editHotspot: null, displayHotspot: null, crop: undefined, completedCrop: undefined };
    }
    case 'UNDO':
      return { ...state, historyIndex: Math.max(0, state.historyIndex - 1), editHotspot: null, displayHotspot: null };
    case 'REDO':
      return { ...state, historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1), editHotspot: null, displayHotspot: null };
    // FIX: Added handler for SET_HISTORY_INDEX action
    case 'SET_HISTORY_INDEX':
      return { ...state, historyIndex: action.payload, editHotspot: null, displayHotspot: null };
    case 'RESET_HISTORY':
        return { ...state, historyIndex: 0, editHotspot: null, displayHotspot: null };
    case 'RESET_STATE':
        state.history.forEach(item => URL.revokeObjectURL(item.url));
        if (state.styleImageUrl) URL.revokeObjectURL(state.styleImageUrl);
        return initialState;
    default:
      return state;
  }
};


// CONTEXT
const AppStateContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> }>({
  state: initialState,
  dispatch: () => null,
});

// PROVIDER
export const AppStateProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Effect to clean up object URLs on unmount
  useEffect(() => {
    return () => {
      state.history.forEach(item => URL.revokeObjectURL(item.url));
      if (state.styleImageUrl) {
          URL.revokeObjectURL(state.styleImageUrl);
      }
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
};

// HOOKS
export const useAppState = () => useContext(AppStateContext);

const createHistoryItem = (file: File, name: string): HistoryItem => ({
    file,
    name,
    id: `${Date.now()}-${Math.random()}`,
    url: URL.createObjectURL(file),
});

// ASYNC ACTION HOOK
export const useActions = () => {
    const { state, dispatch } = useAppState();
    const { history, historyIndex, prompt, editHotspot, styleImage, completedCrop } = state;
    const currentImage = history[historyIndex]?.file;
    
    const performAction = useCallback(async (actionName: string, serviceCall: () => Promise<string>) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        dispatch({ type: 'SET_ERROR', payload: null });
        try {
            const imageUrl = await serviceCall();
            const newImageFile = await dataURLtoFile(imageUrl, `${actionName.toLowerCase().replace(' ', '-')}-${Date.now()}.png`);
            dispatch({ type: 'ADD_HISTORY_ITEM', payload: createHistoryItem(newImageFile, actionName) });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            dispatch({ type: 'SET_ERROR', payload: `Failed to ${actionName.toLowerCase()}. ${errorMessage}` });
            console.error(err);
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [dispatch]);

    const handleImageUpload = (file: File) => {
        dispatch({ type: 'INITIALIZE_HISTORY', payload: createHistoryItem(file, 'Original Image') });
    };

    const handleGenerateImageFromPrompt = (generationPrompt: string) => {
        performAction('Generate Image', () => generateImageFromPrompt(generationPrompt))
            .then(() => dispatch({ type: 'SET_ACTIVE_TOOL', payload: 'retouch' }));
    };

    const handleGenerate = () => {
        if (!currentImage || !prompt.trim() || !editHotspot) {
            dispatch({ type: 'SET_ERROR', payload: 'Please select an area on the image and provide a prompt.' });
            return;
        }
        performAction('Retouch', () => generateEditedImage(currentImage, prompt, editHotspot));
    };
    
    const handleApplyFilter = (filterPrompt: string) => {
        if (!currentImage) return;
        performAction(filterPrompt, () => generateFilteredImage(currentImage, filterPrompt));
    };

    const handleApplyAdjustment = (adjustmentPrompt: string) => {
        if (!currentImage) return;
        performAction(adjustmentPrompt, () => generateAdjustedImage(currentImage, adjustmentPrompt));
    };

    const handleApplyColorize = () => {
        if (!currentImage) return;
        performAction('Colorize', () => generateColorizedImage(currentImage));
    };
    
    const handleApplyStyle = () => {
        if (!currentImage || !styleImage) {
            dispatch({ type: 'SET_ERROR', payload: 'Please provide a content image and a style image.' });
            return;
        }
        performAction('Style Transfer', () => generateStyledImage(currentImage, styleImage));
    };

    const handleApplyCrop = (imageRef: React.RefObject<HTMLImageElement>) => {
        if (!completedCrop || !imageRef.current) return;
        const image = imageRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = completedCrop.width;
        canvas.height = completedCrop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = completedCrop.width * pixelRatio;
        canvas.height = completedCrop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = 'high';
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
        performAction('Crop', () => Promise.resolve(croppedImageUrl));
    };
    
    const handleSetStyleImage = (file: File | null) => {
        if (state.styleImageUrl) {
            URL.revokeObjectURL(state.styleImageUrl);
        }
        const url = file ? URL.createObjectURL(file) : null;
        dispatch({ type: 'SET_STYLE_IMAGE', payload: { file, url } });
    };

    return { 
        handleImageUpload,
        handleGenerateImageFromPrompt,
        handleGenerate,
        handleApplyFilter,
        handleApplyAdjustment,
        handleApplyColorize,
        handleApplyStyle,
        handleApplyCrop,
        handleSetStyleImage,
    };
};

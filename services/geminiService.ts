/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

type ApiEditOperation = 'edit' | 'filter' | 'adjust' | 'colorize' | 'style';

// Generic handler for API calls that return an image
const fetchImageFromApi = async (endpoint: string, body: FormData | string, headers?: HeadersInit): Promise<string> => {
    const response = await fetch(endpoint, {
        method: 'POST',
        body,
        headers: typeof body === 'string' ? { 'Content-Type': 'application/json', ...headers } : headers
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred while processing the image.' }));
        throw new Error(errorData.message);
    }

    const result = await response.json();
    if (!result.imageUrl) {
        throw new Error('The AI model did not return an image. This can happen due to safety filters or if the request is too complex. Please try rephrasing your prompt.');
    }
    return result.imageUrl;
};

// Consolidated function to handle various image editing tasks
const generateImageTransformation = async (
    operation: ApiEditOperation,
    prompt: string,
    image1: File,
    image2?: File | null,
    hotspot?: { x: number, y: number } | null
): Promise<string> => {
    const formData = new FormData();
    formData.append('operation', operation);
    formData.append('prompt', prompt);
    formData.append('image1', image1);
    if (image2) {
        formData.append('image2', image2);
    }
    if (hotspot) {
        formData.append('hotspot', JSON.stringify(hotspot));
    }

    return fetchImageFromApi('/api/edit-image', formData);
};

export const generateImageFromPrompt = async (prompt: string): Promise<string> => {
    return fetchImageFromApi('/api/generate', JSON.stringify({ prompt }));
};

export const generateEditedImage = async (
    originalImage: File,
    userPrompt: string,
    hotspot: { x: number, y: number }
): Promise<string> => {
    const fullPrompt = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
User Request: "${userPrompt}"
Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}). The rest of the image must remain identical.
Output: Return ONLY the final edited image.`;
    return generateImageTransformation('edit', fullPrompt, originalImage, null, hotspot);
};

export const generateFilteredImage = async (
    originalImage: File,
    filterPrompt: string,
): Promise<string> => {
    const fullPrompt = `You are an expert photo editor AI. Apply a stylistic filter to the entire image. Do not change the composition or content, only apply the style.
Filter Request: "${filterPrompt}"
Output: Return ONLY the final filtered image.`;
    return generateImageTransformation('filter', fullPrompt, originalImage);
};

export const generateAdjustedImage = async (
    originalImage: File,
    adjustmentPrompt: string,
): Promise<string> => {
    const fullPrompt = `You are an expert photo editor AI. Perform a natural, global adjustment to the entire image. The result must be photorealistic.
User Request: "${adjustmentPrompt}"
Output: Return ONLY the final adjusted image.`;
    return generateImageTransformation('adjust', fullPrompt, originalImage);
};

export const generateColorizedImage = async (
    originalImage: File
): Promise<string> => {
    const fullPrompt = `You are a world-class expert in photo restoration. Colorize the provided black and white image. The colors must be photorealistic and context-aware. Preserve all original details.
Output: Return ONLY the final colorized image.`;
    return generateImageTransformation('colorize', fullPrompt, originalImage);
};

export const generateStyledImage = async (
    contentImage: File,
    styleImage: File
): Promise<string> => {
    const fullPrompt = `Analyze the artistic style of the second image (style image) and apply it to the first image (content image). Retain the subject of the content image.
Output: Return ONLY the final styled image.`;
    return generateImageTransformation('style', fullPrompt, contentImage, styleImage);
};

export const enhancePrompt = async (userPrompt: string): Promise<string> => {
    const response = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userPrompt })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown server error occurred while enhancing the prompt.' }));
        throw new Error(errorData.message);
    }

    const result = await response.json();
    if (!result.enhancedPrompt) {
        throw new Error('The AI model did not return an enhanced prompt.');
    }
    return result.enhancedPrompt;
};
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(() => {
  // Ensure the API_KEY is available during the build process.
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set. Please provide it before building.");
  }

  return {
    plugins: [react()],
    // This is needed for electron-builder to correctly package the app
    // and for Capacitor to find the assets.
    base: './',
    // The API key is no longer directly exposed to the client.
    // All API calls will be proxied through a secure backend (BFF).
  };
});
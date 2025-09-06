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
    define: {
      // The API key is sourced from the environment and made available to the client-side code,
      // adhering to the guideline of using process.env.API_KEY in the source.
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
    }
  };
});
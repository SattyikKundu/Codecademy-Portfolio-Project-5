import { defineConfig } from 'vite'; // Import defineConfig() from 'vite' library which wraps
                                     // the config object to give better type safety, autocompletion, and IDE support. 

import react from '@vitejs/plugin-react'; // Imported to enable React for vite (JSX, fast refrehes, etc.)

export default defineConfig({
  plugins: [react()], // register vite plugins here (only 'react' needed right now)
  server: {
    port: 3000,         // frontend server port for localhost
    open: true          // (optional) auto-opens browser when server starts
  }
});

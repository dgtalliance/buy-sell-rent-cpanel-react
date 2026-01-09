import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'serve') {
    return {
      plugins: [
        createHtmlPlugin({
          template: 'index.local.html',
        }),
        react(),
      ],
      server: {
        host: true,
        port: 5173,
        watch: {
          usePolling: true,
        },
      },
    };
  }
  return {
    plugins: [react()],
  };
});

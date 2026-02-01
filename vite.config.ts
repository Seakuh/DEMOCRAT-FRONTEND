import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/dip': {
        target: 'https://search.dip.bundestag.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dip/, '/api/v1'),
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            const apiKey = process.env.VITE_DIP_API_KEY;
            if (apiKey) {
              proxyReq.setHeader('Authorization', `ApiKey ${apiKey}`);
            }
          });
        },
      },
    },
  },
});

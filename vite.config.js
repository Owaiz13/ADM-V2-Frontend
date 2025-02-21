import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/@fortawesome/fontawesome-free/webfonts',
          dest: 'webfonts', // This will copy the fonts into the "dist/webfonts" folder
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      '@fortawesome': '/node_modules/@fortawesome',
    },
  },
});

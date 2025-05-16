import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '/src': '/src',
    },
    extensions: ['.js', '.jsx', '.json', '.md'], // ✅ this line
  },
});

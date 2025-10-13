// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige cualquier petición que comience con /api a tu backend en el puerto 3000
      '/api': {
        target: 'http://localhost:3000', 
        changeOrigin: true,
        secure: false,
      },
    },
    // Asegúrate de que el frontend corra en la porta esperada (ej: 5000)
    port: 5173, 
  },
});

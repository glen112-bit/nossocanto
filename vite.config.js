import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",

  resolve: {
        // Isso pode ajudar o axios a encontrar myData.json
        alias: {
              '@assets': '/src/assets',
                  },
                    },
        // }
  // }
})

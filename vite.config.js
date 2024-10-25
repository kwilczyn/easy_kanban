import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve' // Sprawdza, czy jest to tryb deweloperski

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // Tylko w trybie deweloperskim dodajemy konfigurację proxy
    ...(isDev && {
      server: {
        proxy: {
          '/api': {
            target: 'http://localhost:8000/api',
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      }
    })
  }
})

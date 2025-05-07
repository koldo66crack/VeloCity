import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  plugins: [tailwindcss(), react()],
  // only run this proxy when you do `npm run dev` (i.e. vite's "serve" command)
  server: command === 'serve'
    ? {
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false,
          },
        },
      }
    : undefined,
}))

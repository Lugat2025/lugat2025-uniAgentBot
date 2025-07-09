import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Artık /chat, /get_student gibi istekler backend'e gidecek
      '/chat': 'http://127.0.0.1:8000',
      '/get_student': 'http://127.0.0.1:8000',
      '/test': 'http://127.0.0.1:8000'
    }
  }
})

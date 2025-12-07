import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/entities/user', 'src/entities/notification'],
      exclude: [
        'src/**/*.test.*',
        'src/**/*.stories.*',
        'src/pages/**',
        'src/widgets/**',
        'src/shared/**',
        'src/app/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
      ],
    },
  },
})

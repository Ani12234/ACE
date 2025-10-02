import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  // Allow JSX syntax in .js files (CRA style)
  esbuild: {
    // Ensure import analysis can parse JSX in both .js and .jsx
    loader: 'jsx',
    include: [/src\/.*\.js$/, /src\/.*\.jsx$/],
    jsx: 'automatic',
    tsconfigRaw: {
      compilerOptions: {
        jsx: 'react-jsx'
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx', '.jsx': 'jsx' },
      jsx: 'automatic'
    }
  },
  preview: {
    port: 5173
  }
})

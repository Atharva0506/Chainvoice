import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base:'/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router')) return 'react-vendor';
            if (id.includes('@mui') || id.includes('@emotion')) return 'mui-vendor';
            if (id.includes('@lit-protocol')) return 'lit-vendor';
            if (id.includes('ethers') || id.includes('wagmi') || id.includes('viem') || id.includes('@rainbow-me') || id.includes('@walletconnect')) return 'web3-vendor';
            if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf-vendor';
            if (id.includes('framer-motion')) return 'animation-vendor';
            // Note: intentionally not returning a catch-all 'vendor' here 
            // to allow Rollup to safely resolve remaining shared dependencies without circular chunk errors.
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500
  }
})


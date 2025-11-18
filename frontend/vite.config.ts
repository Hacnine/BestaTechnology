import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
      host: "0.0.0.0",
      port: 8081,
      strictPort: true,
      // Proxy API requests to backend to avoid CORS/cookie issues in dev
      proxy: {
        '/user': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
        },
        // Add additional proxies as needed
        '/auth': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: '',
        },
      },
  },
  plugins: [
    react(),
  ],
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));


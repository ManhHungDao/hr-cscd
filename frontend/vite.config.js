import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Cấu hình tương thích tuyệt đối Windows + React 18 + MUI 6
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: "localhost",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // ✅ Cấu hình tương thích tuyệt đối Windows + React 18 + MUI 6
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     open: true,
//     host: "localhost",
//   },
//   resolve: {
//     alias: {
//       "@": "/src",
//     },
//   },
//   esbuild: {
//     jsxInject: `import React from 'react'`,
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: "localhost",
    proxy: {
      // mọi request bắt đầu bằng /api sẽ được chuyển sang backend
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        // nếu backend không có prefix /api thì bật rewrite:
        // rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@mock": path.resolve(__dirname, "./src/mocks"),
    },
  },
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
});

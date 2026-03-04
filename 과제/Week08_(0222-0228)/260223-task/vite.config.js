import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Goormexp/%EA%B3%BC%EC%A0%9C/Week08_(0222-0228)/260223-task/",
  server: {
    port: 3002,
    proxy: {
      "/api": {
        target: "http://54.180.25.65:3002",
        changeOrigin: true,
      },
    },
  },
});

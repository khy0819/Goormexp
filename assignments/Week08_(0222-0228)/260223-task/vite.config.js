import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Goormexp/assignments/23-react-app/dist/",

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

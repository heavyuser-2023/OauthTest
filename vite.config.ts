import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  base: "/quickmemo/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "Convex Auth App",
        short_name: "ConvexAuth",
        description: "A secure PWA for Google OAuth using Convex",
        theme_color: "#4f46e5", // Indigo-600
        background_color: "#f3f4f6",
        display: "standalone",
        icons: [
          {
            src: "vite.svg",
            sizes: "192x192",
            type: "image/svg+xml",
          },
          {
            src: "vite.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: false, // 개발 모드에서는 SW 비활성화 (캐시 간섭 방지)
      }
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: env.VITE_CONVEX_SITE_URL || "http://127.0.0.1:3211",
        changeOrigin: true,
      },
    },
  },
  };
});

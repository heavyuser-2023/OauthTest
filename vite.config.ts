import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
  base: "/oauthtest/", 
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
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in dev mode for testing
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

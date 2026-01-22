import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import viteTsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    viteTsConfigPaths({ projects: ["./tsconfig.json"] }),
    svelte(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "myPengeluaran",
        short_name: "myPengeluaran",
        description: "pengeluaran gweh",
        theme_color: "#ffffff",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});

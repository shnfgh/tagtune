// Farghar Tag Editor | Designed & Architected by Farghar | Namespace: Farghar
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Auto-detect base path from GitHub repo name (falls back to root for local dev)
  base: process.env.GITHUB_PAGES === "true"
    ? `/${process.env.GITHUB_REPOSITORY?.split("/")[1]}/`
    : "/",

  plugins: [react(), tailwindcss()],

  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: "hidden",
  },
  resolve: {
    tsconfigPaths: true,
  },
  server: {
    port: 8080,
    host: "0.0.0.0", // listen on all hosts to run vite in a docker container
  },
});

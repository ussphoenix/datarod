import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tsconfigPaths(), tailwindcss()],
  build: {
    sourcemap: "hidden",
  },
  server: {
    port: 8080,
    host: "0.0.0.0", // listen on all hosts to run vite in a docker container
  },
});

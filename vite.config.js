import { defineConfig } from "vite";

export default defineConfig({
  root: "./src/Part3/client",
  port: 3000,
  build: {
    outDir: "../dist",
  },
});

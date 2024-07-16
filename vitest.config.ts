import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // * This needs to be changed to "node" if the server actions using "jose" needs to be tested.
    // There is an environment called "edge-runtime" but when that is used tests react components throw an error
    environment: "jsdom",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  
});

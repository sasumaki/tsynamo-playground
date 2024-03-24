import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: [
    {
      alias: {
        "@aws-sdk/lib-dynamodb":
          "https://unpkg.com/@aws-sdk/lib-dynamodb/dist-es/index.js",
      },
    },
  ],
});

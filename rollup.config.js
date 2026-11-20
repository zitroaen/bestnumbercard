import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";

const dev = process.env.ROLLUP_WATCH === "true";

export default {
  input: "src/best-number-card.ts",
  output: {
    file: "dist/best-number-card.js",
    format: "es",
    inlineDynamicImports: true,
    sourcemap: false,
  },
  plugins: [
    resolve(),
    json(),
    typescript({ tsconfig: "./tsconfig.json", outDir: undefined }),
    !dev && terser({ format: { comments: false } }),
  ],
};

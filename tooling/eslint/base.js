import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * Shared flat config for every TypeScript workspace in OPSORA.
 * Type-aware linting is enabled via the project service, which
 * discovers each package's tsconfig.json automatically.
 */
export const baseConfig = tseslint.config(
  {
    ignores: ["dist/**", ".turbo/**", "node_modules/**", "migrations/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/require-await": "off",
    },
  },
  {
    files: ["**/*.js", "**/*.mjs"],
    ...tseslint.configs.disableTypeChecked,
  },
);

export default baseConfig;

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";


export default [
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      globals: {
        ...globals.browser,
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
        beforeEach: "readonly",
        jest: "readonly",
        process: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",
        },
      ],
    },
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    ignores: ["src/auditLog/**"], // ignore codes auditLog folder for now
  },
];
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vuePlugin from "eslint-plugin-vue";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import vueParser from "vue-eslint-parser";
import globals from "globals";

export default [
  js.configs.recommended,
  ...vuePlugin.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // Nuxt auto-imports
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        withDefaults: "readonly",
        defineNuxtConfig: "readonly",
        useRoute: "readonly",
        useRouter: "readonly",
        navigateTo: "readonly",
        useNotesStore: "readonly",
        useNoteEditStore: "readonly",
        useModal: "readonly",
        storeToRefs: "readonly",
        ref: "readonly",
        computed: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        onMounted: "readonly",
        nextTick: "readonly",
        defineStore: "readonly",
        // Types
        Note: "readonly",
        Todo: "readonly",
        ButtonVariant: "readonly",
        ButtonSize: "readonly",
        AppTheme: "readonly",
        // Utils
        deepClone: "readonly",
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettier,
    },
    rules: {
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "vue/component-name-in-template-casing": [
        "error",
        "PascalCase",
        {
          registeredComponentsOnly: false,
        },
      ],
    },
  },
  {
    ignores: [".nuxt/**", ".output/**", "node_modules/**", "dist/**"],
  },
];

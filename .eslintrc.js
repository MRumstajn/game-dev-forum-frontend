module.exports = {
  parser: "@typescript-eslint/parser",
  extends: [
    "prettier",
    "react-app",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["prettier", "react"],
  globals: {
    document: true,
  },
  rules: {
    "no-unused-expressions": "off",
    "no-use-before-define": 0,
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
      },
    ],
    "import/no-unresolved": "off",
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/prefer-interface": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/no-unused-expressions": ["warn"],
    "import/order": [
      "error",
      {
        alphabetize: { order: "asc", caseInsensitive: true },
        "newlines-between": "always",
        pathGroups: [
          {
            pattern: "react",
            group: "builtin",
            position: "before",
          },
          {
            pattern: "@tiller-ds/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "@nrich/**",
            group: "external",
            position: "before",
          },
          {
            pattern: "@*/**",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        groups: ["builtin", "external", "index"],
      },
    ],
  },
  settings: {
    react: {
      pragma: "React",
      version: "detect",
    },
  },
  reportUnusedDisableDirectives: true,
};

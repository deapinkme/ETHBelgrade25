module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "@typescript-eslint/no-unused-vars": ["warn", {
      "vars": "all",
      "args": "after-used",
      "ignoreRestSiblings": true,
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }]
  },
  overrides: [
    {
      files: ["app/page.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ]
}; 
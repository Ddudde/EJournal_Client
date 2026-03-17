import configs from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Translate ESLintRC-style configs into flat configs.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: configs['recommended'],
});

export default [
    ...compat.config({
        env: { node: true },
        parser: "@typescript-eslint/parser",
        parserOptions: {
            // project: "./tsconfig.json",
            ecmaFeatures: { "jsx": true }, // Поддержка JSX
            ecmaVersion: "latest", // Поддержка ES2022+
            sourceType: "module" // Поддержка ES-модули
        },
        plugins: ['@typescript-eslint'],
        extends: ["plugin:@typescript-eslint/recommended"],
        rules: {
            // Помогает избегать создания нестабильных вложенных компонентов
            // "react/no-unstable-nested-components": "warn",
            // Помогает находить неиспользуемые переменные 
            "@typescript-eslint/no-unused-vars": [ "warn",
            // Игнорирует параметры, начинающиеся с _
            {
                "destructuredArrayIgnorePattern": "^_",
                "argsIgnorePattern": "^_"
            }],
            "@typescript-eslint/no-empty-object-type": "off",
            // Требует использование import type для импортов типов
            "@typescript-eslint/consistent-type-imports": "warn",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off"
        }
    }),
    // Flat config for ESLint rules.
    {
        rules: {
            // camelcase: ['error', { ignoreDestructuring: true }],
        },
        ignores: ['*.css', '*.md', '*.svg', '/.idea', '/build', '/.vscode', '/node_modules', 'package.json', 'README.md', 'src.zip']
    }
];
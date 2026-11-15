import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const INTERNAL_IMPORT = '機能の内部ファイルを直接読み込まない。その機能の index.ts 経由にする。';
const OUTWARD_IMPORT = '依存の向きは app → features → shared の一方向にする。';
const ESCAPING_IMPORT = '機能の外へ出る相対パスを使わない。@/ から始まるパスで読み込む。';

/** Feature internals, however the path to them is spelled. */
const featureInternals = [
  { regex: '^@/features/[^/]+/.+', message: INTERNAL_IMPORT },
  { regex: '^(\\.\\./)+features/[^/]+/.+', message: INTERNAL_IMPORT },
];

/** The rule replaces earlier values, so every layer states its whole list. */
const restrictImports = (patterns) => ({
  'no-restricted-imports': ['error', { patterns }],
});

/** Inside a feature, `depth` is how many folders below the feature root the file sits. */
const featureLayer = (depth) => ({
  files: [`src/features/*/${'*/'.repeat(depth)}*.{ts,tsx}`],
  rules: restrictImports([
    ...featureInternals,
    { regex: '^@/app(/|$)', message: OUTWARD_IMPORT },
    { regex: `^(\\.\\./){${depth + 1},}`, message: ESCAPING_IMPORT },
  ]),
});

export default tseslint.config(
  { ignores: ['dist', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: reactHooks.configs.recommended.rules,
  },
  {
    files: ['*.{js,ts}', 'e2e/**/*.ts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['src/app/**/*.{ts,tsx}'],
    rules: restrictImports(featureInternals),
  },
  featureLayer(0),
  featureLayer(1),
  featureLayer(2),
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: restrictImports([
      { regex: '^@/(features|app)(/|$)', message: OUTWARD_IMPORT },
      { regex: '^(\\.\\./)+(features|app)(/|$)', message: OUTWARD_IMPORT },
    ]),
  },
);

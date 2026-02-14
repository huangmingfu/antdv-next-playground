import antfu from '@antfu/eslint-config';

export default antfu({
  unocss: true,
  stylistic: {
    indent: 2,
    semi: true,
    quotes: 'single',
  },
  formatters: true,
  ignores: [
    'src/template/*',
    'public/*',
  ],
});

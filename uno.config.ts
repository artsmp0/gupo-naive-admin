import { defineConfig, presetUno, presetAttributify } from 'unocss';

export default defineConfig({
  // https://unocss.dev/presets/attributify
  presets: [presetUno(), presetAttributify()],
  // https://unocss.dev/config/rules
  rules: [],
  // https://unocss.dev/config/shortcuts
  shortcuts: {
    'border-base': 'border-solid dark:border-white/9 border-[rgb(239, 239, 245)]'
  },
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      'text-color': 'var(--n-text-color)'
    }
  }
});

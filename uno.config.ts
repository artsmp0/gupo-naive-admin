import { defineConfig, presetUno, presetAttributify } from 'unocss';

export default defineConfig({
  // https://unocss.dev/presets/attributify
  presets: [presetUno(), presetAttributify()],
  // https://unocss.dev/config/rules
  rules: [],
  // https://unocss.dev/config/shortcuts
  shortcuts: {
    border: 'border-solid border-gray/50 border-1'
  },
  theme: {
    colors: {
      primary: 'var(--primary-color)',
      'text-color': 'var(--n-text-color)'
    }
  }
});

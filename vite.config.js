import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const appVersion = `v${pkg.version}`;

export default defineConfig({
  base: process.env.BASE_URL || '/',
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [
    {
      name: 'html-version-transform',
      transformIndexHtml(html) {
        return html.replace(
          /<span id="app-version"([^>]*)>.*?<\/span>/,
          `<span id="app-version"$1>${appVersion}</span>`
        );
      },
    },
  ],
});


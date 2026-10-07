// A regular Astro configuration: merge any content, MDX, RSS, or other integrations here.
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('./', import.meta.url));
if (!process.env.DAYSITE_ROOT) throw new Error('Set DAYSITE_ROOT to the daysite checkout');
const { createDaysiteConfig } = await import(/* @vite-ignore */ `${process.env.DAYSITE_ROOT}/src/config.mjs`);
export default await createDaysiteConfig({
  root, themeDir: root,
  siteConfig: process.env.DAYSITE_CONFIG,
  publicDir: process.env.DAYSITE_PUBLIC_DIR,
  outDir: process.env.DAYSITE_OUT_DIR ?? './dist',
});

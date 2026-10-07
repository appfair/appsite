import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
const root = process.env.DAYSITE_ROOT;
if (!root) throw new Error('Set DAYSITE_ROOT to a daysite checkout with npm ci installed; see README.md');
const result = spawnSync(process.execPath, [resolve(root, 'scripts/build-site.mjs'), 'build'], { stdio: 'inherit',
 env: { ...process.env, DAYSITE_THEME: process.cwd() } });
if (result.error) throw result.error;
process.exit(result.status ?? 1);

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
const root = fileURLToPath(new URL('../',import.meta.url));

function resources() {
  // Supply a synthetic vector to the generated module. Astro handles the real ?raw import.
  const generated = readFileSync(new URL('../src/generated/resources.mjs',import.meta.url),'utf8');
  return vm.runInNewContext(generated.replace(/^import .*;$/m,'const app_fair_logo = "<svg>synthetic fixture</svg>";')
    .replace('export const res =','globalThis.res =')+'\nres');
}

test('committed symbolic resources are current', () => {
 const result=spawnSync(process.execPath,['scripts/generate-resources.mjs','--check'],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
});
test('every supported publication locale has complete theme UI strings', () => {
 const catalogs=JSON.parse(readFileSync(new URL('../src/strings.json',import.meta.url),'utf8'));
 const res=resources();
 for(const locale of Object.keys(catalogs)) {
  for(const key of Object.keys(catalogs.en)) assert.equal(res.str(locale)[key](),catalogs[locale][key]);
 }
 assert.equal(res.str('fr-FR').journal_link(),catalogs.fr.journal_link);
 assert.equal(res.str('zh-Hans-CN').journal_link(),catalogs['zh-CN'].journal_link);
 assert.equal(res.str('pt-BR').footer_information(),catalogs['pt-BR'].footer_information);
 assert.throws(()=>res.str('xx-Unknown'),/translations are missing/);
 assert.match(res.vectors.app_fair_logo(),/synthetic fixture/);
});
test('theme imports symbolic UI and vector accessors and wraps the original controls', () => {
 const header=readFileSync(new URL('../src/components/Header.astro',import.meta.url),'utf8');
 const footer=readFileSync(new URL('../src/components/Footer.astro',import.meta.url),'utf8');
 assert.match(header,/daysite\/components\/Header.astro/);
 for(const source of [header,footer]) {
  assert.match(source,/res\.str\(/);
  assert.match(source,/res\.vectors\.app_fair_logo\(\)/);
 }
 assert.match(header,/https:\/\/appfair.net/);
});

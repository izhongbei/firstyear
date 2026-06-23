import { existsSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const required = [
  'public/images/wechat-qr.png',
  'public/images/og-cover.png',
];

let failed = false;
for (const rel of required) {
  const abs = join(root, rel);
  if (!existsSync(abs) || statSync(abs).size === 0) {
    console.error(`MISSING or empty: ${rel}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log('Asset check passed.');

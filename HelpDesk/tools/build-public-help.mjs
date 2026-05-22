import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const toolsDir = dirname(fileURLToPath(import.meta.url));
const helpDeskRoot = resolve(toolsDir, '..');
const repoRoot = resolve(helpDeskRoot, '..');
const publicHelpDir = resolve(repoRoot, 'Public', 'help');
const browserBuildDir = resolve(helpDeskRoot, 'dist', 'HelpDesk', 'browser');

console.log('Building HelpDesk for /help/...');
const build = spawnSync('npm run build -- --base-href /help/', {
  cwd: helpDeskRoot,
  shell: true,
  stdio: 'inherit',
});

if (build.status !== 0) {
  if (build.error) {
    console.error(build.error.message);
  }
  process.exit(build.status ?? 1);
}

console.log(`Replacing ${publicHelpDir}`);
await rm(publicHelpDir, { recursive: true, force: true });
await mkdir(publicHelpDir, { recursive: true });
await cp(browserBuildDir, publicHelpDir, { recursive: true });

console.log('Public Help Desk updated. Commit the repo changes when ready.');

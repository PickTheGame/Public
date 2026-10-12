import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

const publicRoot = resolve('Public');

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const htmlFiles = walk(publicRoot).filter((path) => extname(path) === '.html');
const failures = [];

function record(condition, message) {
  if (!condition) failures.push(message);
}

function resolveAsset(pagePath, reference) {
  const clean = reference.split('#')[0].split('?')[0];
  if (!clean || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(clean)) return null;
  const decoded = decodeURIComponent(clean);
  const candidate = decoded.startsWith('/')
    ? join(publicRoot, decoded.slice(1))
    : resolve(dirname(pagePath), decoded);
  if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) return join(candidate, 'index.html');
  if (!extname(candidate) && existsSync(`${candidate}.html`)) return `${candidate}.html`;
  return candidate;
}

for (const path of htmlFiles) {
  const html = readFileSync(path, 'utf8');
  const relative = path.slice(publicRoot.length + 1).replaceAll('\\', '/');

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const target = resolveAsset(path, match[1]);
    record(target === null || existsSync(target), `${relative}: missing local target ${match[1]}`);
  }

  for (const match of html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(match[1]);
    } catch (error) {
      failures.push(`${relative}: invalid JSON-LD (${error.message})`);
    }
  }

  if (/<main\b/i.test(html) && relative !== 'help/index.csr.html') {
    record(/class=["'][^"']*skip-link/i.test(html), `${relative}: missing skip link`);
  }
}

const home = readFileSync(join(publicRoot, 'index.html'), 'utf8');
record(!/(cdn\.tailwindcss|fonts\.googleapis|unpkg\.com\/aos|data-aos)/i.test(home), 'index.html: runtime styling or AOS dependency remains');
record((home.match(/<section class="hero-shell[\s\S]*?<\/section>/)?.[0].match(/<a\b/g) ?? []).length === 2, 'index.html: hero must contain exactly two primary actions');
record(/prefers-reduced-motion:\s*reduce/i.test(home), 'index.html: missing reduced-motion fallback');
record(/ScrollTrigger\.create/i.test(home) && /pin:\s*['"]\.journey-copy['"]/i.test(home), 'index.html: pinned journey motion is not wired');

const newsFiles = htmlFiles.filter((path) => path.includes(`${join('Public', 'news')}`) && !path.endsWith(join('news', 'welcome', 'index.html')));
for (const path of newsFiles) {
  const html = readFileSync(path, 'utf8');
  const relative = path.slice(publicRoot.length + 1).replaceAll('\\', '/');
  record(/rel="canonical"/i.test(html), `${relative}: missing canonical URL`);
  record(/property="og:title"/i.test(html), `${relative}: missing Open Graph title`);
  record(/name="twitter:card"/i.test(html), `${relative}: missing Twitter card metadata`);
}

if (failures.length) {
  console.error(`Site validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Validated ${htmlFiles.length} HTML files: internal targets, metadata, accessibility hooks, and homepage motion invariants are intact.`);

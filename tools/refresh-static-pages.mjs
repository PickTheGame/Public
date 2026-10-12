import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';

const dimensions = new Map([
  ['logo-wide.png', [369, 116]],
  ['confidence-formats-overview.svg', [1200, 700]],
  ['pickem-formats-overview.svg', [1200, 700]],
  ['matrix-scenario.png', [1560, 957]],
  ['confidence-week.png', [747, 491]],
  ['pickem-week.png', [1273, 603]],
]);

const files = [];
for await (const file of glob(['Public/news/**/*.html', 'Public/privacy-policy.html', 'Public/terms-of-service.html'])) {
  files.push(file);
}

for (const file of files) {
  let html = await readFile(file, 'utf8');
  html = html
    .replace(/^\s*<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com" \/?>\r?\n/gm, '')
    .replace(/^\s*<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin \/?>\r?\n/gm, '')
    .replace(/^\s*<link href="https:\/\/fonts\.googleapis\.com\/css2[^\n]+\r?\n/gm, '')
    .replace('<nav class="site-nav">', '<nav class="site-nav" aria-label="Primary navigation">')
    .replace('</script>  <meta property="og:type"', '</script>\n  <meta property="og:type"');

  if (html.includes('<main') && !html.includes('class="skip-link"')) {
    html = html.replace(/<body>\s*/, '<body>\n  <a class="skip-link" href="#main-content">Skip to content</a>\n');
  }
  html = html.replace(/<main(?![^>]*\bid=)/, '<main id="main-content"');
  if (html.includes('class="article-shell"')) {
    html = html
      .replace(/\n\s*<p class="eyebrow">[^<]*<\/p>/, '')
      .replace(/\n\s*<div class="chip-row">[\s\S]*?<\/div>/, '');
  }

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.replace(/&amp;/g, '&');
  const description = html.match(/<meta name="description" content="([^"]+)"\s*\/?\s*>/)?.[1];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"\s*\/?\s*>/)?.[1];
  if (title && description && canonical && !html.includes('property="og:title"')) {
    const social = `  <meta property="og:type" content="article" />\n  <meta property="og:title" content="${title}" />\n  <meta property="og:description" content="${description}" />\n  <meta property="og:url" content="${canonical}" />\n  <meta property="og:image" content="https://www.pickthegame.com/assets/hero-image.png" />\n  <meta name="twitter:card" content="summary_large_image" />\n`;
    html = html.replace('</head>', `${social}</head>`);
  }

  html = html.replace(/<img\b([^>]*?)>/g, (tag, attributes) => {
    const src = attributes.match(/\bsrc="([^"]+)"/)?.[1] ?? '';
    const filename = src.split('/').pop();
    const size = dimensions.get(filename);
    let next = tag;
    if (size && !/\bwidth=/.test(next)) {
      next = next.replace('<img', `<img width="${size[0]}" height="${size[1]}"`);
    }
    if (filename !== 'logo-wide.png' && !/\bloading=/.test(next)) {
      next = next.replace('<img', '<img loading="lazy"');
    }
    if (!/\bdecoding=/.test(next)) {
      next = next.replace('<img', '<img decoding="async"');
    }
    return next;
  });

  await writeFile(file, html);
}

console.log(`Refreshed ${files.length} static pages.`);

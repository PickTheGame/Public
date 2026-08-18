# PickTheGame Public Site Notes

This repository contains the static public website for PickTheGame.

## Adding a News Post

News posts live in the static `Public/news/` folder.

When adding a new post:

1. Create a new folder under `Public/news/` using a lowercase, hyphenated slug.
   - Example: `Public/news/multiple-survivor-entries/`

2. Add the article page at:
   - `Public/news/<slug>/index.html`

3. Use an existing post as the template.
   - Good examples:
     - `Public/news/scenario-mode/index.html`
     - `Public/news/demo-mode/index.html`

4. Update the main news listing:
   - `Public/news/index.html`
   - Add a new `<article class="news-card">` near the top of the `.news-grid`.
   - Keep cards in reverse chronological order.

5. Update the sitemap:
   - `Public/sitemap.xml`
   - Update the `/news/` `<lastmod>` date.
   - Add a new `<url>` entry for the post.

## News Post Conventions

- Use the current date unless the user provides a specific publish date.
- Display dates in article content like `August 8, 2026`.
- Use ISO dates in schema and sitemap like `2026-08-08`.
- Include `BlogPosting` JSON-LD metadata in the article page.
- Use relative asset paths from a post page:
  - CSS: `../../assets/site.css`
  - Logo: `../../assets/logo-wide.png`
  - Favicons: `../../assets/favicons/...`
  - Site script: `../../assets/site.js`
- Use relative links from a post page:
  - Back to news: `../`
  - Home/logo: `../../`
  - Terms/privacy: `../../terms-of-service.html`, `../../privacy-policy.html`

## Canonical URLs

Article pages use canonical URLs in this form:

```html
<link rel="canonical" href="https://www.pickthegame.com/news/<slug>/" />
```

The sitemap uses production URLs in this form:

```xml
<loc>https://www.pickthegame.com/news/<slug>/</loc>
```

Follow the existing pattern unless the site-wide URL convention is intentionally changed.

## Verification Checklist

After adding a post:

- Confirm the article exists at `Public/news/<slug>/index.html`.
- Confirm the news index links to `<slug>/`.
- Confirm `Public/sitemap.xml` parses as valid XML.
- Review `git diff -- Public/news/index.html Public/news/<slug>/index.html Public/sitemap.xml AGENTS.md`.

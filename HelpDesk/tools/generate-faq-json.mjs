import fs from "node:fs";
import path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";

/**
 * Input:
 *   src/assets/faq/*.md
 * Output:
 *   src/assets/faq/generated/faq.json
 *
 * Conventions supported:
 * - YAML front-matter per file:
 *     title, slug, category, tags (page-level)
 * - Each question begins with:
 *     ### Question text
 * - Optional per-question tags line immediately after question:
 *     **Tags:** a, b, c
 *
 * Output contains Markdown only (no HTML).
 */

const ROOT = process.cwd();
const INPUT_DIR = path.join(ROOT, "src/assets/faq");
const OUTPUT_DIR = path.join(INPUT_DIR, "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "faq.json");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function cleanBody(bodyMd) {
  const lines = bodyMd.split(/\r?\n/);

  return lines
    .filter((line) => {
      // Remove top-level title like "# Future Features..."
      if (line.match(/^#\s+/)) return false;

      // Remove standalone page-level tag lines
      if (line.match(/^\*\*Tags:\*\*/i)) return false;

      return true;
    })
    .join("\n")
    .trim();
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(String).map(t => t.trim()).filter(Boolean);
  return String(tags)
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
}

function makeId(slug, question) {
  const q = question
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${slug}::${q}`;
}

/**
 * Split a markdown body into QAs by "### " headings.
 * Returns [{ question, answerMd }]
 */
function extractQAs(bodyMd) {
  const lines = bodyMd.split(/\r?\n/);

  const qas = [];
  let currentQ = null;
  let currentA = [];

  const flush = () => {
    if (!currentQ) return;
    const answerMd = currentA.join("\n").trim();
    qas.push({ question: currentQ.trim(), answerMd });
    currentQ = null;
    currentA = [];
  };

  for (const line of lines) {
    const m = line.match(/^###\s+(.*)\s*$/);
    if (m) {
      flush();
      currentQ = m[1];
      continue;
    }
    currentA.push(line);
  }

  flush();
  return qas;
}

/**
 * If answer begins with "**Tags:** ..."
 * extract it and remove from answer markdown.
 */
function extractInlineTags(answerMd) {
  const lines = answerMd.split(/\r?\n/);
  const firstNonEmptyIdx = lines.findIndex(l => l.trim().length > 0);
  if (firstNonEmptyIdx === -1) return { tags: [], answerMd };

  const first = lines[firstNonEmptyIdx].trim();
  const m = first.match(/^\*\*Tags:\*\*\s*(.+)$/i);
  if (!m) return { tags: [], answerMd };

  const tags = m[1]
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);

  lines.splice(firstNonEmptyIdx, 1);
  return { tags, answerMd: lines.join("\n").trim() };
}

async function main() {
  const mdFiles = await fg(["*.md"], { cwd: INPUT_DIR, absolute: true });
  const sourceFiles = mdFiles.filter(f => !f.includes(`${path.sep}generated${path.sep}`));

  const categories = [];
  const faqs = [];

  for (const file of sourceFiles) {
    const raw = fs.readFileSync(file, "utf-8");
    const parsed = matter(raw);
    const fm = parsed.data ?? {};
    const body = cleanBody(parsed.content ?? "");

    const pageTitle = fm.title ?? path.basename(file, ".md");
    const slug = fm.slug ?? path.basename(file, ".md");
    const category = fm.category ?? slug;
    const pageTags = normalizeTags(fm.tags);

    categories.push({
      slug,
      title: pageTitle,
      category,
      tags: pageTags,
      sourceFile: path.relative(ROOT, file).replaceAll("\\", "/"),
    });

    const qas = extractQAs(body);

    for (const qa of qas) {
      const { tags: inlineTags, answerMd } = extractInlineTags(qa.answerMd);
      const question = qa.question.trim();

      faqs.push({
        id: makeId(slug, question),
        slug,
        category,
        pageTitle,
        question,
        tags: Array.from(new Set([...pageTags, ...inlineTags])),
        answerMd, // ✅ markdown only
      });
    }
  }

  categories.sort((a, b) => a.title.localeCompare(b.title));
  faqs.sort((a, b) => a.category.localeCompare(b.category) || a.question.localeCompare(b.question));

  const output = {
    generatedAt: new Date().toISOString(),
    schemaVersion: 1,
    categories,
    faqs,
  };

  ensureDir(OUTPUT_DIR);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  console.log(
    `✅ Generated ${faqs.length} FAQs from ${categories.length} pages → ${path.relative(ROOT, OUTPUT_FILE)}`
  );
}

main().catch(err => {
  console.error("❌ FAQ generation failed:", err);
  process.exit(1);
});
const fs = require("fs");

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePath(path) {
  if (!path) return "/";
  if (path === "/") return "/";
  return path.endsWith("/") ? path : `${path}/`;
}

function extractWikiTargets(content) {
  const targets = [];
  const pattern = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
  let match;

  while ((match = pattern.exec(content)) !== null) {
    const targetTitle = match[1].trim();
    if (targetTitle) {
      targets.push(targetTitle);
    }
  }

  return targets;
}

function stripFrontMatter(rawContent) {
  if (!rawContent.startsWith("---")) {
    return rawContent;
  }

  const end = rawContent.indexOf("\n---", 3);
  if (end === -1) {
    return rawContent;
  }

  return rawContent.slice(end + 4);
}

module.exports = function wikiLinksPlugin(eleventyConfig, options = {}) {
  const collectionName = options.collectionName || "wiki";
  const wikiBasePath = normalizePath(options.basePath || "/wiki/");

  eleventyConfig.addTransform("wiki-links", function transformWikiLinks(content) {
    if (!this.outputPath || !this.outputPath.endsWith(".html")) {
      return content;
    }

    return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
      const targetTitle = target.trim();
      const renderedLabel = (label || targetTitle).trim();
      const href = `${wikiBasePath}${slugify(targetTitle)}/`;
      return `<a href="${href}">${renderedLabel}</a>`;
    });
  });

  eleventyConfig.addCollection("wikiBacklinks", function wikiBacklinks(collectionApi) {
    const pages = collectionApi.getFilteredByTag(collectionName);
    const bySlug = new Map();

    for (const page of pages) {
      bySlug.set(slugify(page.data.title), page);
    }

    const backlinks = {};

    for (const page of pages) {
      const sourceUrl = normalizePath(page.url);
      const sourceTitle = page.data.title;
      const rawContent = fs.readFileSync(page.inputPath, "utf8");
      const targets = extractWikiTargets(stripFrontMatter(rawContent));

      for (const target of targets) {
        const targetPage = bySlug.get(slugify(target));
        if (!targetPage) continue;

        const targetUrl = normalizePath(targetPage.url);
        const list = backlinks[targetUrl] || [];

        const exists = list.some((entry) => entry.url === sourceUrl);
        if (!exists) {
          list.push({
            title: sourceTitle,
            url: sourceUrl,
          });
        }

        backlinks[targetUrl] = list;
      }
    }

    return backlinks;
  });
};

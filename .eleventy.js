const wikiLinksPlugin = require("./plugins/wiki-links");

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");

  eleventyConfig.addPlugin(wikiLinksPlugin, {
    collectionName: "wiki",
    basePath: "/wiki/",
  });

  eleventyConfig.addCollection("wikiCategories", function (collectionApi) {
    const pages = collectionApi.getFilteredByTag("wiki");
    const grouped = new Map();

    for (const page of pages) {
      const categories = Array.isArray(page.data.categories)
        ? page.data.categories
        : page.data.category
          ? [page.data.category]
          : [];

      for (const rawCategory of categories) {
        const name = String(rawCategory).trim();
        if (!name) continue;

        const slug = slugify(name);
        if (!grouped.has(slug)) {
          grouped.set(slug, { name, slug, pages: [] });
        }

        grouped.get(slug).pages.push(page);
      }
    }

    return [...grouped.values()]
      .map((entry) => ({
        ...entry,
        pages: entry.pages.sort((a, b) =>
          String(a.data.title).localeCompare(String(b.data.title)),
        ),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addCollection("sessionNotes", function (collectionApi) {
    const pages = collectionApi
      .getFilteredByTag("wiki")
      .filter((page) => page.url && page.url.startsWith("/wiki/sessions/"));

    return pages.sort((a, b) =>
      String(b.data.title).localeCompare(String(a.data.title), undefined, {
        numeric: true,
      }),
    );
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};

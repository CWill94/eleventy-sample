---
layout: layouts/base.njk
title: Wiki Home
---
# Wiki Home

Use `[[Wiki Links]]` inside any page tagged with `wiki`.

## Categories

<ul>
{% for category in collections.wikiCategories %}
  <li>
    <a href="/wiki/category/{{ category.slug }}/">{{ category.name }}</a>
    <span class="subtle">({{ category.pages.length }})</span>
  </li>
{% endfor %}
</ul>

## All Pages

<ul>
{% for entry in collections.wiki %}
  <li><a href="{{ entry.url }}">{{ entry.data.title }}</a></li>
{% endfor %}
</ul>

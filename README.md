# DnD Campaign Wiki (Eleventy + Decap CMS)

## Local development

- Install deps: `npm ci`
- Run dev server: `npm run start`
- Build: `npm run build`

## Decap CMS setup

This project includes Decap CMS at `/admin`:

- Admin UI: `/Users/umeworks/Desktop/eleventy-sample/src/admin/index.html`
- CMS config: `/Users/umeworks/Desktop/eleventy-sample/src/admin/config.yml`

### Required config changes

Edit `/Users/umeworks/Desktop/eleventy-sample/src/admin/config.yml` and replace:

- `YOUR_GITHUB_USERNAME/YOUR_REPO_NAME`
- `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME`
- `https://YOUR_OAUTH_GATEWAY_DOMAIN`

Decap on GitHub Pages needs an OAuth gateway for GitHub auth. Configure your chosen provider, then set:

- `base_url`: your gateway host
- `auth_endpoint`: provider endpoint (commonly `/api/auth`)

### Local CMS auth (optional)

For local testing without the production OAuth gateway:

- Run site: `npm run start`
- Run Decap local backend proxy in another terminal: `npx decap-server`

Then open:

- [http://localhost:8080/admin/](http://localhost:8080/admin/)

## GitHub Pages deployment

Workflow is configured at:

- `/Users/umeworks/Desktop/eleventy-sample/.github/workflows/deploy.yml`

What it does:

- Builds on push to `main`
- Auto-sets Eleventy `pathPrefix` for project/user pages
- Deploys `_site` via GitHub Pages Actions

### One-time GitHub setup

1. Push repo to GitHub.
2. In GitHub repo settings, set **Pages** source to **GitHub Actions**.
3. Ensure default branch is `main` (or update workflow trigger).
4. Update Decap CMS config placeholders and commit.

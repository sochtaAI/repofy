# Repofy

**Discover. Explore. Build.**

Repofy is an independent, mobile-first directory for discovering public open-source software on GitHub. It helps developers, students and curious builders find useful repositories across AI, web development, Android, Python and self-hosted software.

🌐 **Website:** https://repofy.qd.je/  
💻 **Repository:** https://github.com/sochtaAI/repofy

## What works today

- Live repository search powered by the GitHub public REST API
- Discovery filters for popular projects, AI & machine learning, web, Android, Python and self-hosted software
- Sorting by stars or recently updated
- Repository cards with owner, description, language, stars and update date
- Repository detail pages with metadata, topics and a README preview
- Local bookmarks stored in the current browser
- Responsive layouts for mobile and desktop
- Static hosting; no application server or API key required

## Run locally

Open `index.html` in a browser, or serve the repository folder with any static file server.

## GitHub Pages deployment

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`.
4. Save and wait for the deployment to finish.

The custom domain is stored in the root `CNAME` file as `repofy.qd.je`. In the domain provider's DNS settings, create:

| Type | Host / Name | Target |
|---|---|---|
| CNAME | `repofy` | `sochtaAI.github.io` |

If the provider uses a different DNS interface, keep the host as the subdomain `repofy` and point it to `sochtaAI.github.io`. Do not add a URL path. Then return to **Settings → Pages**, confirm the custom domain is `repofy.qd.je`, and enable **Enforce HTTPS** once GitHub reports the certificate is ready. DNS and certificate provisioning can take time.

The GitHub Pages fallback URL remains https://sochtaAI.github.io/repofy/.

## GitHub API behaviour and limitations

Repofy uses unauthenticated public GitHub API endpoints. GitHub applies rate limits to unauthenticated traffic, so search may temporarily fail when the shared limit is exhausted. Repository data is live and controlled by GitHub; Repofy does not independently verify project quality, security, maintenance status or licensing.

The “Popular” collection is a star-based discovery view, not a formal endorsement or a guaranteed real-time trending feed. Saved projects use browser localStorage and are not synced across devices or browsers.

## Suggest a project

Use the **Suggest a project** link on the website to open a structured GitHub issue. Submissions are suggestions, not automatic listings; maintainers should review the repository for relevance, accessibility, licensing clarity and basic project quality before featuring it.

## Attribution

Repository names, descriptions, owners, languages, star counts, dates and links are retrieved from GitHub. Each project links to its original repository. Repofy is an independent project and is not affiliated with GitHub.

## License

No license has been selected for this repository yet. Until a license is added, do not assume that the source code is available for reuse.

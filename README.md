# Repofy

**Discover. Explore. Build.**

Repofy is a lightweight, mobile-first open-source discovery website. It helps people explore public GitHub repositories across AI, web development, Android, Python and self-hosted software.

## Current features

- Live repository search using the GitHub public REST API
- Popular, AI & ML, Web, Android, Python and Self-hosted discovery filters
- Sort by stars or recently updated
- Repository cards with owner, description, stars, language and last update
- Responsive layout for mobile and desktop
- No API key or backend required for the first version

## Run locally

Open `index.html` in a browser, or serve this folder with any static file server.

## Deploy with GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Save and wait for the Pages deployment.
5. Your project site will be available at `https://sochtaAI.github.io/repofy/` once GitHub Pages finishes publishing.

## GitHub API notes

Repofy uses the unauthenticated public endpoint `GET https://api.github.com/search/repositories`. GitHub applies rate limits to unauthenticated requests. The site displays a friendly message when the limit is reached. Search results are live GitHub data; the Popular filter sorts repositories by stars and is not a formal endorsement or a precise real-time trending feed.

## Project data and attribution

Repository names, descriptions, owners, languages, star counts, update dates and links are retrieved from GitHub. Each repository links to its original GitHub page. Repofy is an independent discovery project and is not affiliated with GitHub.

## License

No project license has been selected yet. Do not assume this repository is open for reuse until a license is added.

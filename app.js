const API = "https://api.github.com/search/repositories";
const grid = document.querySelector("#project-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultCount = document.querySelector("#result-count");
const resultsLabel = document.querySelector("#results-label");
const sortSelect = document.querySelector("#sort-select");
const loadMoreButton = document.querySelector("#load-more");
const chips = [...document.querySelectorAll(".category-chip")];

let activeQuery = "stars:>1000 archived:false";
let page = 1;
let total = 0;
let loading = false;
let searchText = "";

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value || 0);
}

function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function projectCard(repo) {
  const card = make("article", "project-card");
  const top = make("div", "project-top");
  const avatar = make("img", "avatar");
  avatar.src = repo.owner?.avatar_url || "";
  avatar.alt = "";
  avatar.loading = "lazy";
  avatar.referrerPolicy = "no-referrer";
  const identity = make("div");
  identity.append(make("div", "repo-title", repo.name || "Untitled repository"));
  identity.append(make("div", "repo-owner", repo.full_name || "GitHub project"));
  top.append(avatar, identity);

  const description = make("p", "repo-desc", repo.description || "No description provided by the repository owner.");
  const bottom = make("div", "repo-bottom");
  const stars = make("span", "repo-stat", "★ " + formatNumber(repo.stargazers_count));
  const language = make("span", "repo-stat", "● " + (repo.language || "Other"));
  if (repo.language) language.querySelector?.("span");
  const updated = make("span", "repo-stat", "↻ " + new Date(repo.updated_at).toLocaleDateString());
  const link = make("a", "repo-link", "View ↗");
  link.href = repo.html_url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", "View " + (repo.full_name || "repository") + " on GitHub");
  bottom.append(stars, language, updated, link);
  card.append(top, description, bottom);
  return card;
}

function showMessage(message) {
  grid.replaceChildren(make("div", "empty-state", message));
}

async function loadProjects({ reset = false } = {}) {
  if (loading) return;
  if (reset) {
    page = 1;
    grid.innerHTML = '<div class="loading-card"><span class="loader"></span><p>Loading projects...</p></div>';
    loadMoreButton.hidden = true;
  }
  loading = true;
  loadMoreButton.disabled = true;
  loadMoreButton.textContent = "Loading...";
  const sort = sortSelect.value;
  const q = [activeQuery, searchText, "archived:false"].filter(Boolean).join(" ");
  const params = new URLSearchParams({ q, sort, order: "desc", per_page: "9", page: String(page) });
  try {
    const response = await fetch(API + "?" + params.toString(), {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (response.status === 403 || response.status === 429) throw new Error("GitHub's public API rate limit has been reached. Please wait a little and try again.");
    if (!response.ok) throw new Error("GitHub returned an error (" + response.status + "). Please try again.");
    const data = await response.json();
    const repos = Array.isArray(data.items) ? data.items : [];
    if (reset) grid.replaceChildren();
    if (!repos.length && page === 1) showMessage("No projects found. Try another search or category.");
    repos.forEach(repo => grid.append(projectCard(repo)));
    total = data.total_count || 0;
    resultCount.textContent = total ? formatNumber(total) + " repositories found" : "";
    resultsLabel.textContent = searchText ? 'Results for "' + searchText + '"' : "Popular open-source projects";
    loadMoreButton.hidden = repos.length < 9 || page * 9 >= total;
    page += 1;
  } catch (error) {
    if (reset) showMessage(error.message + " You can also browse projects directly on GitHub.");
    else {
      const note = make("div", "empty-state", error.message);
      grid.append(note);
    }
    resultCount.textContent = "";
  } finally {
    loading = false;
    loadMoreButton.disabled = false;
    loadMoreButton.innerHTML = 'Load more projects <span>↓</span>';
  }
}

chips.forEach(chip => chip.addEventListener("click", () => {
  chips.forEach(item => item.classList.toggle("active", item === chip));
  activeQuery = chip.dataset.query || "stars:>1000";
  searchText = "";
  searchInput.value = "";
  loadProjects({ reset: true });
}));

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchText = searchInput.value.trim();
  chips.forEach(chip => chip.classList.remove("active"));
  activeQuery = "";
  loadProjects({ reset: true });
});

sortSelect.addEventListener("change", () => loadProjects({ reset: true }));
loadMoreButton.addEventListener("click", () => loadProjects());
loadProjects({ reset: true });
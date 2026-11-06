const API = "https://api.github.com/search/repositories";
const grid = document.querySelector("#project-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const resultCount = document.querySelector("#result-count");
const resultsLabel = document.querySelector("#results-label");
const sortSelect = document.querySelector("#sort-select");
const loadMoreButton = document.querySelector("#load-more");
const chips = [...document.querySelectorAll(".category-chip")];
const savedButton = document.querySelector("#show-saved");
const savedCount = document.querySelector("#saved-count");

let activeQuery = "stars:>1000";
let page = 1, total = 0, loading = false, searchText = "", showingSaved = false;
const STORAGE_KEY = "repofy:saved-projects";

function formatNumber(value) {
  return new Intl.NumberFormat("en", { notation: value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value || 0);
}
function make(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function readSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
}
function writeSaved(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateSavedCount();
}
function updateSavedCount() { if (savedCount) savedCount.textContent = String(readSaved().length); }
function isSaved(fullName) { return readSaved().some(item => item.full_name === fullName); }
function toggleSaved(repo, button) {
  const items = readSaved();
  const exists = items.some(item => item.full_name === repo.full_name);
  writeSaved(exists ? items.filter(item => item.full_name !== repo.full_name) : [repo, ...items].slice(0, 100));
  button.textContent = exists ? "♡ Save" : "♥ Saved";
  button.classList.toggle("is-saved", !exists);
  if (showingSaved && exists) renderSaved();
}
function projectCard(repo) {
  const card = make("article", "project-card");
  const top = make("div", "project-top");
  const avatar = make("img", "avatar");
  avatar.src = repo.owner?.avatar_url || "";
  avatar.alt = ""; avatar.loading = "lazy"; avatar.referrerPolicy = "no-referrer";
  const identity = make("div");
  identity.append(make("div", "repo-title", repo.name || "Untitled repository"));
  identity.append(make("div", "repo-owner", repo.full_name || "GitHub project"));
  top.append(avatar, identity);
  const description = make("p", "repo-desc", repo.description || "No description provided by the repository owner.");
  const bottom = make("div", "repo-bottom");
  bottom.append(make("span", "repo-stat", "★ " + formatNumber(repo.stargazers_count)));
  bottom.append(make("span", "repo-stat", "● " + (repo.language || "Other")));
  bottom.append(make("span", "repo-stat", "↻ " + new Date(repo.updated_at).toLocaleDateString()));
  const actions = make("div", "card-actions");
  const detail = make("a", "repo-link", "Details ↗");
  detail.href = "./project.html?repo=" + encodeURIComponent(repo.full_name);
  const save = make("button", "save-button" + (isSaved(repo.full_name) ? " is-saved" : ""), isSaved(repo.full_name) ? "♥ Saved" : "♡ Save");
  save.type = "button"; save.addEventListener("click", () => toggleSaved(repo, save));
  actions.append(save, detail);
  card.append(top, description, bottom, actions);
  return card;
}
function showMessage(message) { grid.replaceChildren(make("div", "empty-state", message)); }
function renderSaved() {
  const items = readSaved();
  grid.replaceChildren();
  resultCount.textContent = items.length + " saved projects";
  resultsLabel.textContent = "Your saved collection";
  if (!items.length) showMessage("No saved projects yet. Explore the directory and tap ♡ Save on a project.");
  else items.forEach(repo => grid.append(projectCard(repo)));
  loadMoreButton.hidden = true;
}
async function loadProjects({ reset = false } = {}) {
  if (loading || showingSaved) return;
  if (reset) { page = 1; grid.replaceChildren(make("div", "loading-card", "Loading projects...")); loadMoreButton.hidden = true; }
  loading = true; loadMoreButton.disabled = true; loadMoreButton.textContent = "Loading...";
  const q = [activeQuery, searchText, "archived:false"].filter(Boolean).join(" ");
  const params = new URLSearchParams({ q, sort: sortSelect.value, order: "desc", per_page: "9", page: String(page) });
  try {
    const response = await fetch(API + "?" + params, { headers: { Accept: "application/vnd.github+json" } });
    if (response.status === 403 || response.status === 429) throw new Error("GitHub's public API rate limit has been reached. Please wait and try again.");
    if (!response.ok) throw new Error("GitHub returned an error (" + response.status + "). Please try again.");
    const data = await response.json(), repos = Array.isArray(data.items) ? data.items : [];
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
    else grid.append(make("div", "empty-state", error.message));
    resultCount.textContent = "";
  } finally {
    loading = false; loadMoreButton.disabled = false; loadMoreButton.innerHTML = 'Load more projects <span>↓</span>';
  }
}
function showDiscovery() {
  showingSaved = false;
  if (savedButton) savedButton.classList.remove("active");
  document.querySelector("#section-title").innerHTML = 'Explore projects<span class="heading-period">.</span>';
  document.querySelector("#section-subtitle").textContent = "Find useful repositories selected from public GitHub activity.";
  chips.forEach(chip => chip.classList.toggle("active", chip.dataset.query === activeQuery));
  loadProjects({ reset: true });
}
chips.forEach(chip => chip.addEventListener("click", () => {
  showingSaved = false; activeQuery = chip.dataset.query || "stars:>1000"; searchText = ""; searchInput.value = "";
  if (savedButton) savedButton.classList.remove("active");
  chips.forEach(item => item.classList.toggle("active", item === chip));
  loadProjects({ reset: true });
}));
searchForm.addEventListener("submit", event => {
  event.preventDefault(); showingSaved = false; searchText = searchInput.value.trim(); activeQuery = "";
  if (savedButton) savedButton.classList.remove("active");
  chips.forEach(chip => chip.classList.remove("active"));
  loadProjects({ reset: true });
});
sortSelect.addEventListener("change", () => loadProjects({ reset: true }));
loadMoreButton.addEventListener("click", () => loadProjects());
if (savedButton) savedButton.addEventListener("click", () => {
  showingSaved = !showingSaved;
  if (showingSaved) {
    savedButton.classList.add("active");
    document.querySelector("#section-title").textContent = "Saved projects.";
    document.querySelector("#section-subtitle").textContent = "Your bookmarks are stored on this device and browser.";
    chips.forEach(chip => chip.classList.remove("active"));
    renderSaved();
  } else showDiscovery();
});
updateSavedCount();
loadProjects({ reset: true });
const API = "https://api.github.com";
const root = document.querySelector("#project-detail");
const repoName = new URLSearchParams(location.search).get("repo");
const KEY = "repofy:saved-projects";
function savedItems(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function saveRepo(repo){const items=savedItems();const exists=items.some(x=>x.full_name===repo.full_name);localStorage.setItem(KEY,JSON.stringify(exists?items.filter(x=>x.full_name!==repo.full_name):[repo,...items].slice(0,100)));return !exists}
function el(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n}
function link(text,url,cls="detail-action"){const a=el("a",cls,text);a.href=url;a.target="_blank";a.rel="noopener noreferrer";return a}
function prettyDate(value){return value?new Date(value).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}):"Unknown"}
function render(repo,readme){
 root.replaceChildren();
 const head=el("section","detail-hero");
 const eyebrow=el("div","eyebrow small-eyebrow","OPEN SOURCE PROJECT");
 const title=el("h1","detail-title",repo.full_name);
 const desc=el("p","detail-description",repo.description||"No description provided by the repository owner.");
 const actions=el("div","detail-actions");
 actions.append(link("View on GitHub ↗",repo.html_url));
 const save=el("button","detail-action save-button",savedItems().some(x=>x.full_name===repo.full_name)?"♥ Saved":"♡ Save project");
 save.type="button";save.addEventListener("click",()=>{const added=saveRepo(repo);save.textContent=added?"♥ Saved":"♡ Save project";save.classList.toggle("is-saved",added)});actions.append(save);
 head.append(eyebrow,title,desc,actions);
 const stats=el("div","detail-stats");
 [[ "★ Stars",Number(repo.stargazers_count||0).toLocaleString() ],["⑂ Forks",Number(repo.forks_count||0).toLocaleString()],["◉ Issues",Number(repo.open_issues_count||0).toLocaleString()],["● Language",repo.language||"Not specified"]].forEach(([k,v])=>{const box=el("div","detail-stat");box.append(el("span","",k),el("strong","",v));stats.append(box)});
 const info=el("section","detail-panel");info.append(el("h2","","Repository information"));
 const rows=[["Owner",repo.owner?.login||"Unknown"],["Default branch",repo.default_branch||"Unknown"],["License",repo.license?.spdx_id||repo.license?.name||"Not specified"],["Created",prettyDate(repo.created_at)],["Last updated",prettyDate(repo.updated_at)],["Homepage",repo.homepage||"Not provided"]];
 const table=el("div","detail-info-grid");rows.forEach(([k,v])=>{const item=el("div","detail-info-item");item.append(el("span","",k),el("strong","",v));table.append(item)});info.append(table);
 if(Array.isArray(repo.topics)&&repo.topics.length){const topics=el("div","topic-list");repo.topics.forEach(topic=>topics.append(el("span","topic-tag",topic)));info.append(el("h3","","Topics"),topics)}
 const readmePanel=el("section","detail-panel");readmePanel.append(el("h2","","README preview"));
 if(readme){const pre=el("pre","readme-preview",readme.slice(0,14000));readmePanel.append(pre)}else readmePanel.append(el("p","detail-description","No README preview could be loaded. Open the repository on GitHub to read its documentation."));
 root.append(head,stats,info,readmePanel);
}
async function init(){
 if(!repoName||! /^[^/]+\/[^/]+$/.test(repoName)){root.textContent="Invalid repository link. Return to Repofy and select a project.";return}
 try{
  const response=await fetch(API+"/repos/"+repoName,{headers:{Accept:"application/vnd.github+json"}});
  if(response.status===403||response.status===429)throw new Error("GitHub API rate limit reached. Please wait and reload.");
  if(!response.ok)throw new Error("Repository could not be found or is not publicly accessible.");
  const repo=await response.json();
  document.title=repo.full_name+" — Repofy";
  let readme="";
  try{const raw=await fetch("https://raw.githubusercontent.com/"+repo.full_name+"/"+repo.default_branch+"/README.md");if(raw.ok)readme=await raw.text()}catch{}
  render(repo,readme);
 }catch(error){root.textContent=error.message}
}
init();
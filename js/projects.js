(function () {
  async function getProjects(includeDrafts = false) {
    const result = await db.list("projects", "*", { order:"sort_order", ascending:true });
    if (result.error) throw result.error;
    return includeDrafts ? result.data : result.data.filter(project => project.status === "published");
  }
  function projectImage(url, title, number = "") {
    const style = url ? ` style="background-image:url('${ui.esc(url).replace(/'/g,"%27")}')"` : "";
    return `<div class="project-image ${url ? "has-image" : ""}"${style}><span class="project-number">${ui.esc(number)}</span></div>`;
  }
  function projectCard(project, index = 0) {
    const tech = (Array.isArray(project.technologies) ? project.technologies : String(project.technologies || "").split(",")).filter(Boolean);
    const actions = [project.demo_url ? `<a href="${ui.esc(project.demo_url)}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>` : "", project.github_url ? `<a href="${ui.esc(project.github_url)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>` : "", `<a href="project.html?id=${encodeURIComponent(project.id)}">Details ↗</a>`].filter(Boolean).join("");
    return `<article class="project-card" data-category="${ui.esc(project.category || "Other")}" data-search="${ui.esc(`${project.title} ${project.category} ${tech.join(" ")}`.toLowerCase())}">${projectImage(project.thumbnail_url, project.title, String(index + 1).padStart(2,"0"))}<div class="project-body"><div class="project-meta"><span>${ui.esc(project.category || "Other")}</span><span>${project.featured ? "Featured" : "Selected"}</span></div><h3>${ui.esc(project.title)}</h3><p>${ui.esc(project.description)}</p><div class="tech-list">${tech.slice(0,4).map(item => `<span class="tech-chip">${ui.esc(item)}</span>`).join("")}</div><div class="project-actions">${actions}</div></div></article>`;
  }
  async function loadProjectDetail() {
    const id = new URLSearchParams(location.search).get("id");
    const target = ui.$("#project-detail-content"); if (!target || !id) return;
    const result = await db.one("projects","*",{eq:{id}});
    const project = result.data;
    if (!project || (!result.demo && project.status !== "published")) { target.innerHTML = `<div class="detail-loading"><h2>Project not found</h2><p>That project is not public or no longer exists.</p><a class="text-link" href="index.html#projects">Back to work ↗</a></div>`; return; }
    const tech = Array.isArray(project.technologies) ? project.technologies : String(project.technologies || "").split(",");
    const imageStyle = project.thumbnail_url ? ` style="background-image:url('${ui.esc(project.thumbnail_url).replace(/'/g,"%27")}')"` : "";
    document.title = `${project.title} — Alex Morgan`;
    target.innerHTML = `<div class="detail-hero"><p class="eyebrow"><span class="eyebrow-line"></span>${ui.esc(project.category || "Selected work")}</p><h1>${ui.esc(project.title)}</h1></div><div class="detail-image"${imageStyle}></div><div class="detail-grid"><div class="detail-description">${ui.esc(project.description)}</div><aside class="detail-side"><dl><div><dt>Category</dt><dd>${ui.esc(project.category || "—")}</dd></div><div><dt>Technology</dt><dd>${tech.filter(Boolean).map(ui.esc).join(" · ") || "—"}</dd></div><div><dt>Date</dt><dd>${ui.formatDate(project.created_at)}</dd></div><div><dt>Links</dt><dd>${project.demo_url ? `<a href="${ui.esc(project.demo_url)}" target="_blank" rel="noopener noreferrer">Live demo ↗</a><br>` : ""}${project.github_url ? `<a href="${ui.esc(project.github_url)}" target="_blank" rel="noopener noreferrer">Repository ↗</a>` : ""}</dd></div></dl></aside></div>`;
  }
  window.projectApi = { getProjects, projectCard, loadProjectDetail };
})();
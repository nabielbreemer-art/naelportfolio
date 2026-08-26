(function () {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;" }[char]));
  const slugify = value => String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const formatDate = (value, current = false) => {
    if (current) return "Present";
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-US",{month:"short",year:"numeric"}).format(new Date(`${value}T00:00:00`));
  };
  const getTheme = () => localStorage.getItem("portfolio-theme") || (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const applyTheme = theme => { document.documentElement.dataset.theme = theme; localStorage.setItem("portfolio-theme", theme); $$(".theme-icon").forEach(el => el.textContent = theme === "dark" ? "☼" : "☾"); };
  const toast = (message, type = "success") => { const region = $("#toast-region"); if (!region) return; const item = document.createElement("div"); item.className = `toast ${type}`; item.textContent = message; region.append(item); setTimeout(() => item.remove(), 3800); };
  const setBusy = (button, busy, label = "Saving…") => { if (!button) return; if (busy) { button.dataset.originalText = button.innerHTML; button.disabled = true; button.innerHTML = label; } else { button.disabled = false; button.innerHTML = button.dataset.originalText || button.innerHTML; } };
  const friendlyError = error => { console.error(error); return "Something went wrong. Please check your setup and try again."; };
  window.ui = { $, $$, esc, slugify, formatDate, getTheme, applyTheme, toast, setBusy, friendlyError };
  applyTheme(getTheme());
  $$("[data-theme-toggle]").forEach(button => button.addEventListener("click", () => applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark")));
})();
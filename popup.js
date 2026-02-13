// GoNow — Popup Script

let sortAsc = true;

const $ = (sel) => document.querySelector(sel);
const linkList = $("#link-list");
const addForm = $("#add-form");

// Storage helpers
function getLinks() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({ links: {} }, (data) => resolve(data.links));
  });
}

function saveLinks(links) {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ links }, resolve);
  });
}

// Render the link list
async function render() {
  const links = await getLinks();
  const entries = Object.entries(links);

  if (entries.length === 0) {
    linkList.innerHTML = '<div class="empty-state">No links yet. Add one above.</div>';
    return;
  }

  entries.sort(([a], [b]) =>
    sortAsc ? a.localeCompare(b) : b.localeCompare(a)
  );

  linkList.innerHTML = entries
    .map(
      ([keyword, url]) => `
    <div class="link-row" data-keyword="${escapeAttr(keyword)}">
      <span class="link-keyword">${escapeHtml(keyword)}</span>
      <input class="edit-input edit-keyword" value="${escapeAttr(keyword)}">
      <span class="link-url" title="${escapeAttr(url)}">${escapeHtml(url)}</span>
      <input class="edit-input edit-url" value="${escapeAttr(url)}">
      <div class="link-actions">
        <button class="edit-btn">Edit</button>
        <button class="save-btn" style="display:none">Save</button>
        <button class="cancel-btn" style="display:none">Cancel</button>
        <button class="delete">Del</button>
      </div>
    </div>`
    )
    .join("");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Add link
addForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = $("#add-keyword").value.trim();
  const url = $("#add-url").value.trim();

  if (!keyword || !url) return;

  try {
    new URL(url.replace("{}", "test"));
  } catch {
    alert("Please enter a valid URL.");
    return;
  }

  const links = await getLinks();
  links[keyword] = url;
  await saveLinks(links);

  $("#add-keyword").value = "";
  $("#add-url").value = "";
  render();
});

// Link list actions (edit, save, cancel, delete) via event delegation
linkList.addEventListener("click", async (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const row = btn.closest(".link-row");
  const originalKeyword = row.dataset.keyword;

  if (btn.classList.contains("edit-btn")) {
    row.classList.add("editing");
    btn.style.display = "none";
    row.querySelector(".save-btn").style.display = "";
    row.querySelector(".cancel-btn").style.display = "";
    row.querySelector(".delete").style.display = "none";
    row.querySelector(".edit-keyword").focus();
  } else if (btn.classList.contains("cancel-btn")) {
    render();
  } else if (btn.classList.contains("save-btn")) {
    const newKeyword = row.querySelector(".edit-keyword").value.trim();
    const newUrl = row.querySelector(".edit-url").value.trim();

    if (!newKeyword || !newUrl) return;

    try {
      new URL(newUrl.replace("{}", "test"));
    } catch {
      alert("Please enter a valid URL.");
      return;
    }

    const links = await getLinks();
    if (newKeyword !== originalKeyword) {
      delete links[originalKeyword];
    }
    links[newKeyword] = newUrl;
    await saveLinks(links);
    render();
  } else if (btn.classList.contains("delete")) {
    if (!confirm(`Delete "${originalKeyword}"?`)) return;
    const links = await getLinks();
    delete links[originalKeyword];
    await saveLinks(links);
    render();
  }
});

// Sort toggle
$("#sort-btn").addEventListener("click", () => {
  sortAsc = !sortAsc;
  $("#sort-btn").textContent = sortAsc ? "A-Z" : "Z-A";
  render();
});

// Export
$("#export-btn").addEventListener("click", async () => {
  const links = await getLinks();
  const blob = new Blob([JSON.stringify({ links }, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "gonow-links.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Import
$("#import-btn").addEventListener("click", () => {
  $("#import-file").click();
});

$("#import-file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!data.links || typeof data.links !== "object") {
        alert("Invalid file format. Expected { links: { ... } }");
        return;
      }

      // Validate all entries
      for (const [keyword, url] of Object.entries(data.links)) {
        if (typeof keyword !== "string" || typeof url !== "string") {
          alert("Invalid entry found in file.");
          return;
        }
      }

      const existing = await getLinks();
      const merged = { ...existing, ...data.links };
      await saveLinks(merged);
      render();
    } catch {
      alert("Failed to parse JSON file.");
    }
  };
  reader.readAsText(file);
  // Reset so the same file can be re-imported
  e.target.value = "";
});

// External links
$("#help-btn").addEventListener("click", () => {
  chrome.tabs.create({
    url: "https://chromewebstore.google.com/",
  });
});

$("#github-btn").addEventListener("click", () => {
  chrome.tabs.create({
    url: "https://github.com/nicobako/gonow",
  });
});

// Init
render();

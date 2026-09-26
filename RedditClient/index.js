const STORAGE_KEY = "reddit_lanes_v1";
const DEFAULT_LANES = ["news", "javascript", "aww"];

const lanesEl = document.getElementById("lanes");
const form = document.getElementById("add-form");
const input = document.getElementById("subreddit-input");
const messageEl = document.getElementById("message");

let lanes = loadLanes();

const canMakeNetworkRequests = location.protocol !== "file:";

if (!canMakeNetworkRequests) {
  setTimeout(() => {
    setMessage(
      "This page appears to be opened via file:// — please serve the folder over HTTP (e.g. python -m http.server) to allow network requests.",
      "error",
    );
  }, 10);
}

function loadLanes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_LANES.slice();
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (e) {
    console.warn(e);
  }
  return DEFAULT_LANES.slice();
}

function saveLanes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lanes));
}

function setMessage(text, type = "") {
  messageEl.textContent = text || "";
  messageEl.className = type ? `message ${type}` : "message";
}

function render() {
  lanesEl.innerHTML = "";
  if (lanes.length === 0) {
    lanesEl.innerHTML = '<p class="muted">No lanes. Add a subreddit above.</p>';
    return;
  }

  lanes.forEach((sub) => {
    const lane = document.createElement("section");
    lane.className = "lane";
    lane.innerHTML = `
      <div class="lane-header">
        <div class="lane-title">r/${escapeHtml(sub)}</div>
        <div class="lane-controls">
          <button data-action="refresh" title="Refresh">↻</button>
          <button data-action="remove" title="Remove">✕</button>
        </div>
      </div>
      <div class="posts" data-sub="${escapeHtml(sub)}">
        <div class="loading">Loading posts…</div>
      </div>
    `;

    lanesEl.appendChild(lane);

    lane
      .querySelector('[data-action="remove"]')
      .addEventListener("click", () => {
        removeLane(sub);
      });
    lane
      .querySelector('[data-action="refresh"]')
      .addEventListener("click", () => {
        fetchSubreddit(sub, lane);
      });

    fetchSubreddit(sub, lane);
  });
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

async function fetchJsonWithFallback(url) {
  // Try direct fetch first
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (res.ok) {
      const json = await res.json();
      return { json, source: "direct", status: res.status };
    }
    // If forbidden or rate-limited, attempt via CORS proxy
    if (res.status === 403 || res.status === 429) {
      console.warn(`Direct fetch returned ${res.status}, retrying via proxy`);
      setMessage("Direct fetch blocked; using CORS proxy (temporary).", "");
      const via = await fetchViaAllOrigins(url);
      return { json: via.json, source: "proxy", status: via.status };
    }
    // other non-ok
    throw new Error(`Fetch failed (${res.status})`);
  } catch (err) {
    // Network/CORS errors often show up as thrown TypeError: failed to fetch
    console.warn("Direct fetch error, trying proxy", err);
    try {
      setMessage("Network blocked; retrying via CORS proxy (temporary).", "");
      const via = await fetchViaAllOrigins(url);
      return { json: via.json, source: "proxy", status: via.status };
    } catch (err2) {
      throw err2;
    }
  }
}

async function fetchViaAllOrigins(url) {
  const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
  const res = await fetch(proxy);
  if (!res.ok) {
    throw new Error("Proxy fetch failed");
  }
  const json = await res.json();
  return { json, status: res.status };
}

async function fetchSubreddit(sub, laneEl) {
  const postsEl = laneEl.querySelector(".posts");
  postsEl.innerHTML = '<div class="loading">Loading posts…</div>';
  setMessage("");
  try {
    const url = `https://www.reddit.com/r/${encodeURIComponent(sub)}.json?limit=12`;
    if (!canMakeNetworkRequests) {
      postsEl.innerHTML =
        '<div class="error">Cannot fetch while opened via file:// — serve the folder and reload.</div>';
      return;
    }

    const result = await fetchJsonWithFallback(url);
    const data = result && result.json ? result.json : result;
    const source = result && result.source ? result.source : "direct";
    const status = result && result.status ? result.status : undefined;
    if (!data || !data.data) {
      throw new Error("Invalid response");
    }

    const children = data.data.children || [];
    if (children.length === 0) {
      postsEl.innerHTML = '<div class="loading">No posts to show.</div>';
      return;
    }

    postsEl.innerHTML = "";
    children.forEach((c) => {
      const p = c.data;
      const post = document.createElement("article");
      post.className = "post";
      const title = document.createElement("a");
      title.href = "https://reddit.com" + p.permalink;
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.textContent = p.title;

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `by u/${p.author} • ${p.score} points`;

      post.appendChild(title);
      post.appendChild(meta);
      postsEl.appendChild(post);
    });
    // show debug info about fetch source/status
    const dbg = document.createElement("div");
    dbg.className = "meta";
    dbg.style.marginTop = "6px";
    dbg.textContent = `Fetched via: ${source}${status ? " • status: " + status : ""}`;
    postsEl.appendChild(dbg);
    // clear any transient messages (e.g., proxy notice)
    setMessage("");
  } catch (err) {
    postsEl.innerHTML = `<div class="error">${escapeHtml(err.message)}</div>`;
    console.error(err);
  }
}

function addLane(raw) {
  if (!raw) return setMessage("Enter a subreddit name", "error");
  let sub = raw.trim().replace(/^r\//i, "").toLowerCase();
  if (!/^[A-Za-z0-9_\-]+$/.test(sub))
    return setMessage("Invalid subreddit name", "error");
  if (lanes.includes(sub)) return setMessage("Lane already exists", "error");
  lanes.push(sub);
  saveLanes();
  render();
  setMessage(`Added r/${sub}`);
}

function removeLane(sub) {
  lanes = lanes.filter((s) => s !== sub);
  saveLanes();
  render();
  setMessage(`Removed r/${sub}`);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  addLane(input.value);
  input.value = "";
});

input.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    addLane(input.value);
    input.value = "";
  }
});

// initial render
render();

const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* footer year */
const yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

/* settings window (every page) */
const sDlg = $("#settings");
if (sDlg) {
    $("#openSettings").onclick = () => sDlg.showModal();
    $("#closeSettings").onclick = () => sDlg.close();
    sDlg.addEventListener("click", e => { if (e.target === sDlg) sDlg.close(); });
}

/* games page only */
const gridWeb = $("#gridWeb"), gridDl = $("#gridDl"), modal = $("#modal");
if (gridWeb && gridDl && modal && typeof GAMES !== "undefined") {
    const frame = $("#mFrame");

    function makeCard(g) {
        const isDl = g.type === "download";
        const ready = isDl ? g.url : g.embed;
        const asLink = isDl && g.url;
        const el = document.createElement(asLink ? "a" : "button");
        el.className = "game";
        if (asLink) { el.href = g.url; el.target = "_blank"; el.rel = "noopener"; }
        else el.onclick = () => { location.hash = g.id; };

        const thumb = g.image ? `<img src="${esc(g.image)}" alt="">` : `<b>${esc([...g.title][0])}</b>`;
        const tag = !ready ? '<span class="soon">Coming soon</span>' : isDl ? '<span class="tag">Download</span>' : '<span class="tag">Play</span>';
        el.innerHTML = `<div class="thumb" style="--c:${esc(g.color || "#eee")}">${thumb}</div>
      <div class="info"><h3>${esc(g.title)}</h3><p>${esc(g.desc || "")}</p>${tag}</div>`;
        return el;
    }

    function fill(grid, countEl, list, emptyText) {
        list.forEach(g => grid.appendChild(makeCard(g)));
        countEl.textContent = list.length ? `(${list.length})` : "";
        if (!list.length) grid.outerHTML = `<p class="empty">${emptyText}</p>`;
    }
    fill(gridWeb, $("#countWeb"), GAMES.filter(g => g.type !== "download"), "No browser games yet.");
    fill(gridDl, $("#countDl"), GAMES.filter(g => g.type === "download"), "No downloads yet.");

    function openGame(g) {
        $("#mTitle").textContent = g.title;
        $("#mDesc").textContent = g.desc || "";
        frame.style.setProperty("--ar", g.ratio || "16/10");
        frame.innerHTML = "";
        if (g.embed) {
            const f = document.createElement("iframe");
            f.src = g.embed; f.allowFullscreen = true; f.title = g.title;
            f.allow = "fullscreen; autoplay; gamepad";
            frame.appendChild(f);
        } else {
            frame.innerHTML = `<div><div style="font-size:3rem">${g.emoji || "🎮"}</div><p>This game isn’t ready yet. Check back soon.</p></div>`;
        }
        if (!modal.open) modal.showModal();
    }
    function closeGame() {
        frame.innerHTML = "";
        if (modal.open) modal.close();
        history.replaceState(null, "", location.pathname + location.search);
    }
    $("#mClose").onclick = closeGame;
    modal.addEventListener("click", e => { if (e.target === modal) closeGame(); });
    modal.addEventListener("cancel", e => { e.preventDefault(); closeGame(); });

    /* open a game from a link like games.html#space-hop */
    function route() {
        const id = decodeURIComponent(location.hash.slice(1));
        const g = GAMES.find(x => x.id === id);
        if (g) openGame(g);
        else if (modal.open) { frame.innerHTML = ""; modal.close(); }
    }
    window.addEventListener("hashchange", route);
    route();
}
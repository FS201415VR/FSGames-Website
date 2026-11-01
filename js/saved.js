(function () {
    var PK = "fs-played", LK = "fs-liked-posts";

    function load(key) {
        try {
            var v = JSON.parse(localStorage.getItem(key));
            if (!Array.isArray(v)) return [];
            return v.map(function (x) { return typeof x === "string" ? { id: x, title: x, url: "" } : x; })
                .filter(function (x) { return x && x.id; });
        } catch (e) { return []; }
    }
    function save(key, l) { try { localStorage.setItem(key, JSON.stringify(l)); } catch (e) { } }

    function makeStore(key, mkItem) {
        var listeners = [];
        return {
            list: function () { return load(key); },
            has: function (id) { return load(key).some(function (x) { return x.id === id; }); },
            toggle: function (item) {
                var l = load(key);
                var i = l.findIndex(function (x) { return x.id === item.id; });
                if (i > -1) l.splice(i, 1); else l.push(mkItem(item));
                save(key, l);
                render();
                listeners.forEach(function (f) { f(); });
            },
            onChange: function (f) { listeners.push(f); },
            fire: function () { listeners.forEach(function (f) { f(); }); }
        };
    }

    var played = makeStore(PK, function (g) {
        return { id: g.id, title: g.title || g.id, url: g.url || ("games.html#" + g.id) };
    });
    var liked = makeStore(LK, function (p) {
        return { id: p.id, title: p.title || p.id, url: "posts.html#post-" + p.id };
    });
    window.FSPlayed = played;
    window.FSLiked = liked;

    /* the Saved button in the top bar */
    var nav = document.querySelector(".nav");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "nb";
    btn.id = "openSaved";
    if (nav) nav.insertBefore(btn, document.getElementById("openSettings"));

    /* the Saved window */
    var dlg = document.createElement("dialog");
    dlg.id = "saved";
    dlg.className = "settings-dlg";
    dlg.setAttribute("aria-labelledby", "svTitle");
    dlg.innerHTML =
        '<div class="bar"><h3 id="svTitle">Saved</h3><button type="button" id="closeSaved">Close</button></div>' +
        '<div class="sbody">' +
        '<details class="sv" open><summary>Played games<span id="svPc"></span></summary><ul class="plist" id="svPlayed"></ul></details>' +
        '<details class="sv" open><summary>Liked posts<span id="svLc"></span></summary><ul class="plist" id="svLiked"></ul></details>' +
        '</div>';
    document.body.appendChild(dlg);

    btn.onclick = function () { dlg.showModal(); };
    dlg.querySelector("#closeSaved").onclick = function () { dlg.close(); };
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });

    function fillList(ul, countEl, items, store, emptyText) {
        ul.innerHTML = "";
        countEl.textContent = items.length ? "(" + items.length + ")" : "";
        if (!items.length) {
            var none = document.createElement("li");
            none.className = "none";
            none.textContent = emptyText;
            ul.appendChild(none);
            return;
        }
        items.forEach(function (it) {
            var li = document.createElement("li");
            var name;
            if (it.url) {
                name = document.createElement("a");
                name.href = it.url;
            } else {
                name = document.createElement("span");
            }
            name.textContent = it.title;
            var rm = document.createElement("button");
            rm.type = "button";
            rm.textContent = "Remove";
            rm.onclick = function () { store.toggle(it); };
            li.appendChild(name);
            li.appendChild(rm);
            ul.appendChild(li);
        });
    }

    function render() {
        var p = played.list(), l = liked.list();
        var total = p.length + l.length;
        btn.textContent = total ? "Saved (" + total + ")" : "Saved";
        fillList(dlg.querySelector("#svPlayed"), dlg.querySelector("#svPc"), p, played,
            "Nothing here yet. Use “Add to played games” on a game.");
        fillList(dlg.querySelector("#svLiked"), dlg.querySelector("#svLc"), l, liked,
            "Nothing here yet. Tap ♡ Like on a post.");
    }

    /* keep other open tabs in sync */
    window.addEventListener("storage", function (e) {
        if (e.key === PK || e.key === LK) { render(); played.fire(); liked.fire(); }
    });

    render();
})();
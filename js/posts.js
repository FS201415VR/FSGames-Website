(function () {
    if (typeof POSTS === "undefined") return;
    var el = document.getElementById("posts");
    if (!el) return;

    function fmt(d) {
        var x = new Date(d + "T00:00:00");
        return isNaN(x) ? d : x.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
    }

    var sorted = POSTS.slice().sort(function (a, b) {
        return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });

    if (!sorted.length) {
        el.innerHTML = '<p class="empty">No posts yet. Check back soon.</p>';
        return;
    }

    sorted.forEach(function (p) {
        var art = document.createElement("article");
        art.className = "post";
        art.id = "post-" + p.id;
        if (p.image) {
            var img = document.createElement("img");
            img.src = p.image; img.alt = "";
            art.appendChild(img);
        }
        var body = document.createElement("div");
        body.className = "pbody";
        var h = document.createElement("h3"); h.textContent = p.title;
        var meta = document.createElement("p"); meta.className = "pmeta";
        meta.textContent = "By " + p.author + " · " + fmt(p.date);
        var t = document.createElement("p"); t.className = "ptext"; t.textContent = p.text;

        var b = document.createElement("button");
        b.type = "button";
        b.className = "like";
        b.innerHTML = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
        function paint() {
            var on = window.FSLiked && window.FSLiked.has(p.id);
            b.setAttribute("aria-pressed", on ? "true" : "false");
            b.setAttribute("aria-label", on ? "Unlike this post" : "Like this post");
        }
        b.onclick = function () { if (window.FSLiked) window.FSLiked.toggle(p); };
        paint();
        if (window.FSLiked) window.FSLiked.onChange(paint);

        body.appendChild(h); body.appendChild(meta); body.appendChild(t); body.appendChild(b);
        art.appendChild(body);
        el.appendChild(art);
    });

    /* jump to a post when opened from the Saved window */
    if (location.hash) {
        var target = document.getElementById(location.hash.slice(1));
        if (target) target.scrollIntoView();
    }
})();

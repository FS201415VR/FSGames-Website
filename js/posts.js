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
        function paint() {
            var on = window.FSLiked && window.FSLiked.has(p.id);
            b.setAttribute("aria-pressed", on ? "true" : "false");
            b.textContent = on ? "♥ Liked" : "♡ Like";
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
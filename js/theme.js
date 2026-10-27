(function () {
    var themes = ["dark", "black", "purple"];
    var key = "fs-theme";
    var current = "black";

    try {
        var saved = localStorage.getItem(key);
        if (themes.indexOf(saved) > -1) current = saved;
    } catch (e) { }

    function apply(name) {
        current = name;
        document.documentElement.setAttribute("data-theme", name);
        try { localStorage.setItem(key, name); } catch (e) { }
        var btns = document.querySelectorAll("[data-theme-set]");
        for (var i = 0; i < btns.length; i++) {
            btns[i].setAttribute("aria-pressed", btns[i].getAttribute("data-theme-set") === name);
        }
    }

    /* set it straight away so the page doesn't flash the wrong color */
    document.documentElement.setAttribute("data-theme", current);

    document.addEventListener("DOMContentLoaded", function () {
        var btns = document.querySelectorAll("[data-theme-set]");
        for (var i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", function () {
                apply(this.getAttribute("data-theme-set"));
            });
        }
        apply(current);
    });
})();
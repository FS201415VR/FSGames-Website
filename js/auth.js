(function () {
    var SUPABASE_URL = "https://hochrpasrspuhklxppbw.supabase.co";
    var SUPABASE_KEY = "sb_publishable_3C7vwtIWg7Yr0MVDnIfyBw_N3vfuflC";

    if (!window.supabase) return;
    var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    window.sb = sb;

    var link = document.getElementById("authLink");
    function setLink(session) {
        if (!link) return;
        if (session) {
            link.textContent = "Log out";
            link.href = "#";
            link.onclick = async function (e) {
                e.preventDefault();
                await sb.auth.signOut();
                location.href = "index.html";
            };
        } else {
            link.textContent = "Log in";
            link.href = "login.html";
            link.onclick = null;
        }
    }

    sb.auth.getSession().then(function (r) { setLink(r.data.session); });
    sb.auth.onAuthStateChange(function (_event, session) { setLink(session); });
})();
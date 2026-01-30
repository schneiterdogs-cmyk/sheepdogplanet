const CONFIG = { URL_SHEETS: "https://script.google.com/macros/s/AKfycbwsaUDLAuzUe5Csz_a3ZFS6SEVoB9rFePpd3TDaLswd6Sc1lnP6_sCILNwAXHZxRPWJuw/exec" };
let userEmail = "";

function cambiaBox(id) {
    document.querySelectorAll('.box').forEach(b => b.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// 1. NEWSLETTER
document.getElementById('newsletterForm').onsubmit = async (e) => {
    e.preventDefault();
    userEmail = e.target.user_email.value.trim().toLowerCase();
    const res = await fetch(CONFIG.URL_SHEETS + "?action=subscribe&user_email=" + userEmail, { method: 'POST' });
    const txt = await res.text();
    const [cmd, status, token] = txt.split("|");
    if (token) document.getElementById('token_input').value = token;
    cambiaBox(cmd === "VAI_A_LOGIN" ? "login-section" : "reset-section");
};

// 2. LOGIN
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const pass = document.getElementById('pass').value;
    const res = await fetch(CONFIG.URL_SHEETS + `?action=login&user_email=${userEmail}&user_password=${pass}`, { method: 'POST' });
    const txt = await res.text();
    if (txt.includes("OK")) window.location.href = "dashboard.html";
    else alert(txt);
};

// 3. RESET
document.getElementById('resetForm').onsubmit = async (e) => {
    e.preventDefault();
    const p1 = document.getElementById('new_pass').value;
    const p2 = document.getElementById('conf_pass').value;
    const tk = document.getElementById('token_input').value;
    if (p1 !== p2) return alert("No match");
    const res = await fetch(CONFIG.URL_SHEETS + `?action=update_password&token=${tk}&new_password=${p1}`, { method: 'POST' });
    const txt = await res.text();
    if (txt.includes("PASSWORD_OK")) window.location.href = "dashboard.html";
    else alert(txt);
};

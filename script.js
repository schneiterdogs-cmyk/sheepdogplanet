// 1. FUNZIONE FLUIDA PER CAMBIO BOX
function cambiaBox(idDaMostrare) {
    const boxAttuale = document.querySelector('.newsletter-box:not(.hidden), .login-box:not(.hidden), .password-container:not(.hidden)');
    const nuovoBox = document.getElementById(idDaMostrare);
    if (boxAttuale && nuovoBox) { // Controllo che entrambi esistano
        boxAttuale.style.opacity = "0";
        boxAttuale.style.transform = "translateY(-10px)";
        setTimeout(() => {
            boxAttuale.classList.add('hidden');
            nuovoBox.classList.remove('hidden');
            nuovoBox.style.opacity = "0";
            nuovoBox.style.transform = "translateY(10px)";
            setTimeout(() => {
                nuovoBox.style.opacity = "1";
                nuovoBox.style.transform = "translateY(0)";
            }, 50);
        }, 400);
    }
}

// 2. PRIMO INVIO (Newsletter / Controllo Mail)
// Qui usiamo l'ID del form per sicurezza
const newsForm = document.getElementById('newsletterForm'); // Assicurati di avere questo ID nel HTML
if (newsForm) {
    newsForm.onsubmit = gestisciNewsletter;
}

function gestisciNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const dati = new FormData(form);
    dati.append('action', 'subscribe');

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        body: dati
    })
    .then(res => res.text())
    .then(risposta => {
        const parti = risposta.split("|"); 
        const comando = parti[0];
        const status = parti[1];
        const token = parti[2]; 
        localStorage.setItem('userStatus', status || 'free');
        if (comando === "VAI_A_LOGIN") {
            cambiaBox('login-section'); 
        } else if (comando === "VAI_A_RESET") {
    if (token) {
        // ASSICURATI CHE QUESTE RIGHE SIANO ESATTAMENTE COSÌ
        const tknInput = document.getElementById('token_input');
        if (tknInput) {
            tknInput.value = token; // Questo "incolla" il token segreto nel modulo
            console.log("Token caricato con successo:", token);
        }
    }
    cambiaBox('reset-section'); 
}
            cambiaBox('reset-section'); 
        }
    })
    .catch(err => console.error("Errore Newsletter:", err));
}

// 3. GESTIONE LOGIN (Esegue solo se il form esiste nella pagina)
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        const emailInput = document.querySelector('input[name="user_email"]');
        const passInput = document.getElementById('pass');

        if (!emailInput || !passInput) return;

        const emailDallaNewsletter = emailInput.value.trim();
        const passwordDalLogin = passInput.value.trim();

        const datiForm = new URLSearchParams();
        datiForm.append('action', 'login');
        datiForm.append('user_email', emailDallaNewsletter);
        datiForm.append('user_password', passwordDalLogin);

        fetch(CONFIG.URL_SHEETS, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            body: datiForm
        })
        .then(res => res.text())
        .then(risposta => {
            if (risposta.includes("OK")) {
                const status = risposta.split("|")[1] || 'free';
                localStorage.setItem('userStatus', status);
                localStorage.setItem('isLoggedIn', 'true');
                window.location.href = "dashboard.html";
            } else {
                alert("Attenzione: " + risposta);
            }
        })
        .catch(err => console.error("Errore connessione:", err));
    };
}

// 4. SALVATAGGIO NUOVA PASSWORD (Esegue solo se il form esiste)
const resetForm = document.getElementById('resetForm');
if (resetForm) {
    resetForm.onsubmit = function(e) {
        e.preventDefault();
        const pass = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;
        
        if (pass !== confirm) {
            alert("Le password non coincidono!");
            return;
        }

        const formData = new FormData(this);
        // Assicurati che l'action sia corretta per lo script GAS
        formData.append('action', 'update_password'); 

        fetch(CONFIG.URL_SHEETS, {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            body: formData
        })
        .then(res => res.text())
        .then(risposta => {
            if (risposta.includes("PASSWORD_OK")) {
                const status = risposta.split("|")[1] || 'free';
                localStorage.setItem('userStatus', status);
                alert("Password salvata! Accesso in corso...");
                window.location.href = "dashboard.html"; 
            } else {
                alert("Errore: " + risposta);
                cambiaBox('login-section');
            }
        })
        .catch(err => console.error("Errore Reset:", err));
    };
}

// 1. FUNZIONE FLUIDA PER CAMBIO BOX
function cambiaBox(idDaMostrare) {
    const boxAttuale = document.querySelector('.newsletter-box:not(.hidden), .login-box:not(.hidden), .password-container:not(.hidden)');
    const nuovoBox = document.getElementById(idDaMostrare);
    if (boxAttuale) {
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
function gestisciNewsletter(event) {
    event.preventDefault();
    const form = event.target;
    const dati = new FormData(form);
    dati.append('action', 'subscribe');

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        mode: 'cors',      // AGGIUNTO PER SICUREZZA
        redirect: 'follow', // AGGIUNTO PER SICUREZZA
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
                document.getElementById('token_input').value = token;
            }
            cambiaBox('reset-section'); 
        }
    })
    .catch(err => console.error("Errore Newsletter:", err));
}

// 3. GESTIONE LOGIN (Corretta per utenti già registrati)
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    console.log("Login in corso...");

    const formData = new FormData(this);
    formData.append('action', 'login');
    
    // IMPORTANTE: Recuperiamo la mail che l'utente ha inserito nel PRIMO box
    // Se l'input della newsletter si chiama 'user_email', lo prendiamo da lì
    const emailNewsletter = document.querySelector('input[name="user_email"]').value;
    formData.append('user_email', emailNewsletter);

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        body: formData
    })
    .then(res => res.text())
    .then(risposta => {
        console.log("Risposta Login:", risposta); // Controlla cosa dice Google in console
        
        if (risposta.includes("OK")) {
            const status = risposta.split("|")[1] || 'free';
            localStorage.setItem('userStatus', status);
            localStorage.setItem('isLoggedIn', 'true'); // Segniamo che è dentro
            
            window.location.href = "dashboard.html";
        } else {
            // Se la password è sbagliata o l'email non corrisponde
            alert("ERRORE: " + risposta.split("|")[1] || "Credenziali errate");
        }
    })
    .catch(err => console.error("Errore critico Login:", err));
};

// 4. SALVATAGGIO NUOVA PASSWORD
document.getElementById('resetForm').onsubmit = function(e) {
    e.preventDefault();
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;
    const token = document.getElementById('token_input').value;

    if (pass !== confirm) {
        alert("Le password non coincidono!");
        return;
    }

    const formData = new FormData(this);

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
    .catch(err => {
        console.error("Errore Reset:", err);
        alert("Errore di connessione durante il salvataggio.");
    });
};

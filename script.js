// 1. FUNZIONE FLUIDA PER CAMBIO BOX
function cambiaBox(idDaMostrare) {
    const boxAttuale = document.querySelector('.newsletter-box:not(.hidden), .login-box:not(.hidden), .password-container:not(.hidden)');
    const nuovoBox = document.getElementById(idDaMostrare);

    if (boxAttuale) {
        // Effetto uscita
        boxAttuale.style.opacity = "0";
        boxAttuale.style.transform = "translateY(-10px)";
        
        setTimeout(() => {
            boxAttuale.classList.add('hidden');
            
            // Prepara nuovo box
            nuovoBox.classList.remove('hidden');
            nuovoBox.style.opacity = "0";
            nuovoBox.style.transform = "translateY(10px)";
            
            // Effetto entrata
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
        body: dati
    })
    .then(res => res.text())
    .then(risposta => {
        const parti = risposta.split("|"); // Dividiamo comando e status
        const comando = parti[0];
        const status = parti[1];

        // Salviamo subito lo status nel browser
        localStorage.setItem('userStatus', status || 'free');

        if (comando === "VAI_A_LOGIN") {
            cambiaBox('login-section'); 
        } else {
            cambiaBox('reset-section'); 
        }
    })
    .catch(err => console.error("Errore:", err));
}

// 3. LOGIN (Tasto Entraaa)
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    formData.append('action', 'login');
    
    // Recupera la mail inserita nel primo box per il confronto su Sheets
    const emailSalvata = document.querySelector('input[name="user_email"]').value;
    formData.append('user_email', emailSalvata);

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(risposta => {
        if (risposta.includes("OK")) {
            const status = risposta.split("|")[1];
            localStorage.setItem('userStatus', status); // Aggiorna lo status finale
            window.location.href = "dashboard.html"; // Vai alla dashboard
        } else {
            alert("CREDENTIALS ERRATE");
        }
    })
    .catch(err => console.error("Errore Login:", err));
};

// 4. SALVATAGGIO NUOVA PASSWORD (Box Reset)
document.getElementById('resetForm').onsubmit = function(e) {
    e.preventDefault();
    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;

    if (pass !== confirm) {
        alert("Le password non coincidono!");
        return;
    }

    const formData = new FormData(this);
    formData.append('action', 'update_password');
    const emailSalvata = document.querySelector('input[name="user_email"]').value;
    formData.append('user_email', emailSalvata);

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        body: formData
    })
    .then(res => res.text())
    .then(() => {
        alert("Password salvata! Ora puoi entrare.");
        cambiaBox('login-section');
    })
    .catch(err => console.error("Errore Reset:", err));
};

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
    console.log("1. Tasto Newsletter premuto!");

    const form = event.target;
    const dati = new FormData(form);
    dati.append('action', 'subscribe');

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        body: dati
    })
    .then(res => res.text())
    .then(risposta => {
        console.log("2. Risposta Google:", risposta);
        const parti = risposta.split("|"); 
        const comando = parti[0];
        const status = parti[1];
        const token = parti[2]; 

        localStorage.setItem('userStatus', status || 'free');

        if (comando === "VAI_A_LOGIN") {
            cambiaBox('login-section'); 
        } else if (comando === "VAI_A_RESET") {
            // Inseriamo il token nel campo nascosto prima di mostrare il box
            if (token) {
                document.getElementById('token_input').value = token;
                console.log("3. Token inserito nel form:", token);
            }
            cambiaBox('reset-section'); 
        }
    })
    .catch(err => console.error("Errore Newsletter:", err));
}

// 3. GESTIONE LOGIN (Tasto Entraaa)
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    console.log("Login in corso...");

    const formData = new FormData(this);
    formData.append('action', 'login');
    
    // Recupera la mail dal primo input per sapere chi sta loggando
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
            localStorage.setItem('userStatus', status);
            window.location.href = "dashboard.html";
        } else {
            alert("CREDENTIALS ERRATE");
        }
    });
};

// 4. SALVATAGGIO NUOVA PASSWORD (Box Reset con Token)
document.getElementById('resetForm').onsubmit = function(e) {
    e.preventDefault();
    console.log("Salvataggio nuova password...");

    const pass = document.getElementById('password').value;
    const confirm = document.getElementById('confirm_password').value;
    const token = document.getElementById('token_input').value;

    if (pass !== confirm) {
        alert("Le password non coincidono!");
        return;
    }

    if (!token) {
        alert("Errore: Token mancante. Riprova dalla mail.");
        return;
    }

    const formData = new FormData(this);
    // 'action', 'token' e 'new_password' sono già nel form HTML come 'name'

    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        mode: 'cors', 
        redirect: 'follow',
        body: formData
    })
    .then(res => res.text())
    .then(risposta => {
        console.log("Risposta Google:", risposta);
        
        // Se la risposta contiene PASSWORD_OK (anche se c'è lo status tipo PASSWORD_OK|free)
        if (risposta.includes("PASSWORD_OK")) {
            const parti = risposta.split("|");
            const status = parti[1] || 'free';

            // Salviamo lo stato così la dashboard sa chi siamo
            localStorage.setItem('userStatus', status);
            
            alert("Password salvata! Accesso in corso...");
            
            // IL SALTO FINALE:
            window.location.href = "dashboard.html"; 
        } else {
            // Se qualcosa va storto (es. token scaduto), allora torna al login
            alert("Errore: " + risposta);
            cambiaBox('login-section');
        }
    })

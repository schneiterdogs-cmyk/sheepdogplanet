// Gestione invio silenzioso (Fetch)
function gestisciInvio(event) {
    event.preventDefault(); // Blocca l'errore e il ricaricamento della pagina

    const form = event.target;
    const formData = new FormData(form);

    // Invia i dati a Google Sheets
    fetch(CONFIG.URL_SHEETS, {
        method: 'POST',
        body: formData,
        mode: 'no-cors' 
    })
    .then(() => {
        alert("Dati inviati al database!");
        // Qui in futuro metteremo il comando per cambiare box
    })
    .catch(error => {
        console.error("Errore:", error);
    });
}

// Quando la pagina carica, attiva il controllo sui form
document.addEventListener("DOMContentLoaded", function() {
    const newsletterForm = document.querySelector('.newsletter-box form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', gestisciInvio);
    }
});

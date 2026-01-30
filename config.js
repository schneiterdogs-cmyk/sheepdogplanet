// --- CONFIGURAZIONE GLOBALE ---
const CONFIG = {
    // Cambia questo URL una sola volta per aggiornare tutto il sito
    URL_SHEETS: "https://script.google.com/macros/s/AKfycbz03DOQ2ldbMWzeSR_lib-WT-k24iZFEGnANUGrQSnEx7FGa9IWVn1-Z4RBJemvi3ucEQ/exec"
};

// Funzione per collegare l'URL ai form in automatico
document.addEventListener("DOMContentLoaded", function() {
    const mainForm = document.getElementById('resetForm') || document.getElementById('loginForm');
    if (mainForm) {
        mainForm.action = CONFIG.URL_SHEETS;
    }
});

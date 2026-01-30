<!DOCTYPE html>
<html>
<head>
    <title>DASHBOARD</title>
</head>
<body id="dash-body">

    <h1 id="messaggio">Caricamento...</h1>

    <script>
        // Recuperiamo lo stato (free o premium) salvato durante il login
        const status = localStorage.getItem('userStatus');
        const body = document.getElementById('dash-body');
        const titolo = document.getElementById('messaggio');

        if (status === 'premium') {
            body.style.backgroundColor = "#f1a25c"; // ARANCIONE
            titolo.innerText = "BENVENUTO NELL'AREA PREMIUM";
        } else {
            body.style.backgroundColor = "#2ecc71"; // VERDE
            titolo.innerText = "AREA FREE";
        }
    </script>

</body>
</html>

// ================
// Customowe alerty
// ================

function customAlert(msg, type) {
    const overlay = document.getElementById("overlay");
    const overlayMsg = document.getElementById("overlayMsg");
    const footer = document.getElementById("footer");

    if (type == "alert") {
        overlayMsg.innerHTML = "<p>⚠️</p>" + msg;
    }

    if (type == "error") {
        overlayMsg.innerHTML = "<p>❌</p>" + msg;
    }

    if (type == "changelog") {
        overlayMsg.innerHTML = "<p>📄</p>" + msg;
    }
    
    overlay.style.display = "flex";

    // odtwarzanie dźwięków
    const sounds = {
        alert: "media/sound/alert.wav",
        error: "media/sound/error.wav",
        success: "media/sound/sukces.wav",
        changelog: "media/sound/sukces.wav"
    };

    let sound = sounds[type] || null;

    const audio = new Audio(sound + "");
    audio.play().catch(e => console.log("Nie udało się odtworzyć dźwięku:", e));

    overlay.classList.add("show");

    //blokada scrolla
    document.body.classList.add("modal-open");

    // wstrząs strony
    if (type == "error") {
        const el = document.getElementById("oknoGeneratora");
        el.classList.add("shake");
        setTimeout(() => { el.classList.remove("shake"); }, 500);
    }

    const btn = document.getElementById("overlayButton");
    btn.onclick = () => {
        overlay.style.display = "none";
        //oddaj scroll
        document.body.classList.remove("modal-open");
        document.body.style.paddingRight = '';
        footer.style.transform = ``;
    };
}

// =========================
// Wyskakujące potwierdzenia
// =========================

function showToast(message, duration = 2000) {
    // jeśli toast już istnieje, usuń go
    let toast = document.getElementById("toast");
    if (toast) toast.remove();

    // tworzymy nowy toast
    toast = document.createElement("div");
    toast.id = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // pokaż z animacją
    setTimeout(() => toast.classList.add("show"), 10);

    // po czasie chowamy
    setTimeout(() => {
        toast.classList.remove("show"); // animacja zjazdu w dół
        setTimeout(() => toast.remove(), 400); // usunięcie po animacji
    }, duration);
}

// ====================
// Zmiana rozmiaru okna
// ====================

var czyUzytyRozwijacz = false;

function higherIframe() {
    let przycisk = document.getElementById("przyciskRozwijacza");

    if (czyUzytyRozwijacz == false) {
        // Zamiana przycisków
        czyUzytyRozwijacz = true;
        przycisk.innerHTML = "↕️ Zwiń okno generatora do rozmiaru okna przeglądarki ↔️";

        // Zmiana rozmiaru okna na maksymalne
        const oknoIframe = document.getElementById("iframeRozkaz");
        oknoIframe.style.cssText = "width: 1580px; height: 1920px;";
        document.body.style.minWidth = "1580px";
    }
    else {
        // Zamiana przycisków
        czyUzytyRozwijacz = false;
        przycisk.innerHTML = "↕️ Rozwiń okno generatora do pełnego rozmiaru ↔️";

        // Zmiana rozmiaru okna na oryginalne
        const oknoIframe = document.getElementById("iframeRozkaz");
        oknoIframe.style.cssText = "width: 90vw; height: 75vh;";
        document.body.style.minWidth = "";
    }
}


// =============================
// Kopiowanie rozkazu do schowka
// =============================

function copyToClipboard() {
    const textarea = document.getElementById("poleNaWynik");
    if (!textarea) return;

    navigator.clipboard.writeText(textarea.value)
        .then(() => {
            showToast("Twój rozkaz został skopiowany do schowka!", 2000);
        })
        .catch(err => {
            console.error("Nie udało się skopiować:", err);
        });
}


// ===============================
// Usuwanie formatowania z rozkazu
// ===============================

var czyUzytyFormat = false;

function removeFormatting() {
    const textbox = document.getElementById("poleNaWynik");
    let przycisk = document.getElementById("przyciskUsunieciaFormatowania");
    if (czyUzytyFormat == false) {
        // Zamiana przycisków
        czyUzytyFormat = true;
        przycisk.innerHTML = "✒️ Przywróć formatowanie";
        let sformatowanyRozkaz = gotowyRozkaz;
        sformatowanyRozkaz = sformatowanyRozkaz.replace(/<\/?(b|u)>/g, "");
        textbox.value = sformatowanyRozkaz;
        showToast("Formatowanie zostało ukryte.", 2000)
    }
    else {
        // Zamiana przycisków
        czyUzytyFormat = false;
        przycisk.innerHTML = "✒️ Usuń formatowanie";
        textbox.value = gotowyRozkaz;
        showToast("Formatowanie zostało przywrócone.", 2000)
    }
}

// ======================
// Zapis rozkazu jako PNG
// ======================

// Funkcja zapisująca zawartość iframe jako PNG
function savePNG() {
    const iframe = document.getElementById('iframeRozkaz');
    if (!iframe) {
        alert('Nie znaleziono iframe o id "iframeRozkaz"!');
        return;
    }

    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
    const iframeWindow = iframe.contentWindow;

    // zapamiętanie bieżącej pozycji scrolla
    const prevScrollX = iframeWindow.scrollX;
    const prevScrollY = iframeWindow.scrollY;

    // scroll do lewego górnego rogu
    iframeWindow.scrollTo(0, 0);

    html2canvas(iframeDocument.body, {
        scale: 2, // lepsza jakość
        onclone: (clonedDoc) => {
            clonedDoc.body.style.marginBottom = '122px';

            // Ukrycie przycisków
            clonedDoc.querySelectorAll('button').forEach(btn => btn.style.display = 'none');

            // Najpierw zapamiętujemy, które checkboxy są zaznaczone
            const checkedSet = new Set();
            clonedDoc.querySelectorAll('input[type="checkbox"]').forEach((cb, index) => {
                if (cb.checked) checkedSet.add(index); // zapisujemy indeks checkboxa
            });

            // Zamiana checkboxów na zwykłe divy
            clonedDoc.querySelectorAll('input[type="checkbox"]').forEach((cb, index) => {
                const box = clonedDoc.createElement('div');
                box.style.width = '14px';
                box.style.height = '14px';
                box.style.border = '2px solid #000';
                box.style.background = '#FFC907';
                box.style.position = 'relative';
                box.style.display = 'inline-block';
                box.style.marginLeft = '1em';

                if (checkedSet.has(index)) {  // <- sprawdzamy stan z zapamiętanej tablicy
                    const xMark = clonedDoc.createElement('div');
                    xMark.textContent = '✘';
                    xMark.style.color = '#0000ff';
                    xMark.style.fontWeight = 'bold';
                    xMark.style.fontSize = '24px';
                    xMark.style.position = 'absolute';
                    xMark.style.top = '-50%';
                    xMark.style.left = '-50%';
                    xMark.style.transform = 'translate(20%, -15%)';
                    xMark.style.pointerEvents = 'none';
                    box.appendChild(xMark);
                }

                cb.replaceWith(box);
            });

            // Zmiana wysokości linii w inputach
            clonedDoc.querySelectorAll('input[type="text"]').forEach(input => {
                input.style.height = '18px'; // ustawia normalną wysokość linii
            });

            clonedDoc.querySelectorAll('textarea').forEach(textarea => {
                textarea.style.height = '343px'; // ustawia normalną wysokość linii
            });       
        }
    }).then(canvas => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        const filename = `RP@${day}-${month}-${year}%${hours}.${minutes}.${seconds}.png`;

        const link = document.createElement('a');
        link.download = filename;          // ustawienie dynamicznej nazwy
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(err => {
        console.error('Błąd przy generowaniu PNG:', err);
    }).finally(() => {
        // przywrócenie poprzedniej pozycji scrolla
        iframeWindow.scrollTo(prevScrollX, prevScrollY);
    });

    showToast("Zapisano podgląd rozkazu jako plik PNG.", 5000)
}

// ===================
// Zmiana języka
// ===================

function languageChange(language) {
    if (language == "pl") {
        customAlert("Ustawiono język polski.", "alert");
    }
}

// ===================
// Generowanie rozkazu
// ===================
var gotowyRozkaz, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x95, x96, x97;

function makeItWork() {
    // Zmienna przechowująca rozkaz
    gotowyRozkaz = "<b>Rozkaz pisemny</b>\n\n";

    // Łączenie z generatorem
    const iframe = document.getElementById("iframeRozkaz");
    const generator = iframe.contentDocument || iframe.contentWindow.document;

    //
    // Nagłówek
    //

    // Zassanie nagłówka
    let rozkazHeader = {
        nrPoc: "",
        data: "",
        lokalizacja: "",
        stacja: ""
    }

    // Lista pól z nagłówka do pobrania
    let polaHeader = ["nrPoc", "data", "lokalizacja", "stacja"];

    // Pobranie wartości z formularza
    for (let pole of polaHeader) { // przeleć po kolei każdą wartość z poleHeader, zapisz ją w pole
        rozkazHeader[pole] = generator.getElementById(pole).value; // pobierz wartość po kolei
        // przejdź do kolejnego elementu listy, a jak się skończy - skończ pętlę
    }

    // Sprawdzanie, czy wszystkie pola nagłówka są uzupełnione
    let wszystkieWypelnione = polaHeader.every(pole => rozkazHeader[pole].trim() !== ""); // Usuń spacje i sprawdź, czy każde pole z listy rozkazHeader NIE jest puste i zwróć true/false

    if (!wszystkieWypelnione) { //jeśli false
        customAlert("Uzupełnij wszystkie pola nagłówka!", "error");
        return 0;
    }

    gotowyRozkaz += 
        "<b>A Nr pociągu | składu manewrowego:</b> " + rozkazHeader.nrPoc + "\n" +
        "<b>B Data:</b> " + rozkazHeader.data + "\n" +
        "<b>C Lokalizacja pociągu | składu manewrowego:</b> " + rozkazHeader.lokalizacja + "\n" +
        "<b>D Lokalizacja nadawcy:</b> " + rozkazHeader.stacja + "\n\n";

    //
    // Działki
    //

    // Spisanie zaznaczonych działek
    const checkboxy = generator.querySelectorAll('input[type="checkbox"]');
    const zaznaczoneCheckboxy = [];

    checkboxy.forEach(ch => {
        if (ch.checked) {
            zaznaczoneCheckboxy.push(ch.id);
        }
    });

    // Sprawdzenie, czy jakakolwiek działka jest zaznaczona
    if (zaznaczoneCheckboxy == "") {
        customAlert("Nie wypisuje się pustych rozkazów!" + "<br>" + "Zaznacz przynajmniej jedną działkę.", "error");
        return 0;
    }

    // 22.00
    if (zaznaczoneCheckboxy == "check2200") {
        customAlert("Musisz coś jeszcze dodać do tego rozkazu. Sama działka 22.00 nie wystarczy!", "alert");
        return 0;
    }

    if (zaznaczoneCheckboxy.includes("check2200")) {
        gotowyRozkaz += "<b>22.00</b>" +
                        "\n<b>Dotyczy jazdy torem lewym</b>\n\n";
    }

    // 99
    if (zaznaczoneCheckboxy.includes("check99")) {
        x1 = generator.getElementById("textbox99_x1").value.trim();
        if (x1 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 99!", "error");
            return 0;
        }
        gotowyRozkaz += "<b>99</b>\n<b>Odwołanie rozkazu pisemnego</b> " + x1 +"\n\n";
    }

    // 21.10
    if (zaznaczoneCheckboxy.includes("check2110")) {
        x1 = generator.getElementById("textbox2110_x1").value.trim();
        x2 = generator.getElementById("textbox2110_x2").value.trim();
        x3 = generator.getElementById("textbox2110_x3").value.trim();
        x4 = generator.getElementById("textbox2110_x4").value.trim();
        x5 = generator.getElementById("textbox2110_x5").value.trim();
        x6 = generator.getElementById("textbox2110_x6").value.trim();
        x7 = generator.getElementById("textbox2110_x7").value.trim();

        gotowyRozkaz += "<b>21.10</b>" +
                        "\n<b>Zezwalam na wyjazd</b> z toru nr <b>" + x1 +
                        "</b> z <b>" + x2 +
                        "</b>\nna tor nr <b>" + x3 +
                        "</b> w kierunku <b>" + x4;

        var pomijaneSygnaly = [];
        if (x5 !== "") pomijaneSygnaly.push(x5);
        if (x6 !== "") pomijaneSygnaly.push(x6);
        if (x7 !== "") pomijaneSygnaly.push(x7);

        if (pomijaneSygnaly.length > 0) {
            gotowyRozkaz += "</b>\nPominięcie sygnałów stój <b>" + pomijaneSygnaly.join("</b> i <b>");
        }

        gotowyRozkaz += "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.10!", "error");
            return 0;
        }
    }

    // 21.15
    if (zaznaczoneCheckboxy.includes("check2115")) {
        x1 = generator.getElementById("textbox2115_x1").value.trim();
        x2 = generator.getElementById("textbox2115_x2").value.trim();
        x3 = generator.getElementById("textbox2115_x3").value.trim();
        x4 = generator.getElementById("textbox2115_x4").value.trim();
        x5 = generator.getElementById("textbox2115_x5").value.trim();
        x6 = generator.getElementById("textbox2115_x6").value.trim();

        gotowyRozkaz += "<b>21.15</b>" +
                        "\n<b>Zezwalam na wjazd</b> z toru nr <b>" + x1 +
                        "</b> do <b>" + x2 +
                        "</b> na tor nr <b>" + x3;

        var pomijaneSygnaly = [];
        if (x4 !== "") pomijaneSygnaly.push(x4);
        if (x5 !== "") pomijaneSygnaly.push(x5);
        if (x6 !== "") pomijaneSygnaly.push(x6);

        if (pomijaneSygnaly.length > 0) {
            gotowyRozkaz += "</b>\nPominięcie sygnałów stój <b>" + pomijaneSygnaly.join("</b> i <b>");
        }

        gotowyRozkaz += "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.15!", "error");
            return 0;
        }
    }

    // 21.20
    if (zaznaczoneCheckboxy.includes("check2120")) {
        x1 = generator.getElementById("textbox2120_x1").value.trim();
        x2 = generator.getElementById("textbox2120_x2").value.trim();
        x3 = generator.getElementById("textbox2120_x3").value.trim();

        gotowyRozkaz += "<b>21.20</b>" +
                        "\nOd <b>" + x1 +
                        "</b> do <b>" + x2 +
                        "</b> po torze <b>" + x3 +
                        "</b>\n<u><b>wskazania semaforów SBL są nieważne.</b></u>" +
                        "\n<u>Zachować ostrożnośc od semafora ze wskaźnikiem <b>W18</b>.</u>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.20!", "error");
            return 0;
        }
    }

    // 21.25
    if (zaznaczoneCheckboxy.includes("check2125")) {
        x1 = generator.getElementById("textbox2125_x1").value.trim();
        x2 = generator.getElementById("textbox2125_x2").value.trim();
        x3 = generator.getElementById("textbox2125_x3").value.trim();
        x4 = generator.getElementById("textbox2125_x4").value.trim();

        gotowyRozkaz += "<b>21.25</b>" +
                        "\nZezwalam przejechać za (wskaźnik W5/ostatni rozjazd) w kierunku <b>" + x1 +
                        "</b>\ntorem <b>" + x2 + "</b> do km <b>" + x3 + "</b> do godz. <b>" + x4 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.25!", "error");
            return 0;
        }
    }

    // 21.35
    if (zaznaczoneCheckboxy.includes("check2135")) {
        x1 = generator.getElementById("textbox2135_x1").value.trim();
        x2 = generator.getElementById("textbox2135_x2").value.trim();

        gotowyRozkaz += "<b>21.35</b>" +
                        "\nZezwalam na kontynuacje jazdy po torze nr <b>" + x1 +
                        "</b> w kierunku <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.35!", "error");
            return 0;
        }
    }

    // 21.40
    if (zaznaczoneCheckboxy.includes("check2140")) {
        x1 = generator.getElementById("textbox2140_x1").value.trim();
        x2 = generator.getElementById("textbox2140_x2").value.trim();
        x3 = generator.getElementById("textbox2140_x3").value.trim();
        x96 = generator.getElementById("textbox2140_x96").value.trim();

        // Sprawdź, czy użytkownik podał szlak czy sam posterunek
        if (x1 !== "" && x2 !== "") {
            x1 += " | "
        }

        gotowyRozkaz += "<b>21.40</b>" +
                        "\n<b>Zatrzymanie pociągu</b> na posterunku/szlaku <b>" + x1 + x2 +
                        "</b>\nw km <b>" + x3 + "</b> celem <b>" + x96 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "" || x96 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.40!", "error");
            return 0;
        }
    }

    // 21.45
    if (zaznaczoneCheckboxy.includes("check2145")) {
        x1 = generator.getElementById("textbox2145_x1").value.trim();
        x2 = generator.getElementById("textbox2145_x2").value.trim();

        gotowyRozkaz += "<b>21.45</b>" +
                        "\nNa <b>" + x1 + "</b> na sygnalizatorze <b>" + x2 +
                        "</b>\n<b>sygnał zezwalający jest nieważny, zatrzymać pociąg przed tym sygnalizatorem.</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.45!", "error");
            return 0;
        }
    }

    // 21.50
    if (zaznaczoneCheckboxy.includes("check2150")) {
        x1 = generator.getElementById("textbox2150_x1").value.trim();
        x2 = generator.getElementById("textbox2150_x2").value.trim();
        x3 = generator.getElementById("textbox2150_x3").value.trim();

        // Sprawdź, czy użytkownik podał szlak czy sam posterunek
        if (x1 !== "" && x2 !== "") {
            x1 += " / "
        }

        gotowyRozkaz += "<b>21.50</b>" +
                        "\n<b>Wskazania tarcz ostrzegawczych</b> przejazdowych na posterunku/szlaku" +
                        "\n<b>" + x1 + x2 + "</b> odnoszących się do przejazdu w km <b>" + x3 +
                        "</b>\n<b>są nieważne. Jazda z prędkością rozkładową.</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.50!", "error");
            return 0;
        }
    }

    // 21.55
    if (zaznaczoneCheckboxy.includes("check2155")) {
        x1 = generator.getElementById("textbox2155_x1").value.trim();
        x2 = generator.getElementById("textbox2155_x2").value.trim();
        x3 = generator.getElementById("textbox2155_x3").value.trim();

        // Sprawdź, czy użytkownik podał szlak czy sam posterunek
        if (x1 !== "" && x2 !== "") {
            x1 += " / "
        }

        gotowyRozkaz += "<b>21.55</b>" +
                        "\n<b>Uszkodzone urządzenia SHP</b> na posterunku/szlaku" +
                        "\n<b>" + x1 + x2 + "</b> odnoszące się do sygnalizatora <b>" + x3 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.55!", "error");
            return 0;
        }
    }

    // 21.60
    if (zaznaczoneCheckboxy.includes("check2160")) {
        x1 = generator.getElementById("textbox2160_x1").value.trim();
        x2 = generator.getElementById("textbox2160_x2").value.trim();
        x3 = generator.getElementById("textbox2160_x3").value.trim();
        x4 = generator.getElementById("textbox2160_x4").value.trim();
        x5 = generator.getElementById("textbox2160_x5").value.trim();

        gotowyRozkaz += "<b>21.60</b>" +
                        "\n<b>Zmiana trasy</b> na odcinku od <b>" + x1 + "</b> do <b>" + x2 + "</b>" + 
                        "\njazda przez <b>" + x3 + "</b> linią <b>" + x4 + "</b> z prędkością <b>" + x5 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "" || x5 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.60!", "error");
            return 0;
        }
    }

    // 21.65
    if (zaznaczoneCheckboxy.includes("check2165")) {
        x1 = generator.getElementById("textbox2165_x1").value.trim();
        x2 = generator.getElementById("textbox2165_x2").value.trim();

        gotowyRozkaz += "<b>21.65</b>" +
                        "\n<b>Jazda z opuszczonymi pantografami</b> na odcinku od km <b>" + x1 + "</b> do km <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.65!", "error");
            return 0;
        }
    }

    // 21.70
    if (zaznaczoneCheckboxy.includes("check2170")) {
        x1 = generator.getElementById("textbox2170_x1").value.trim();
        x2 = generator.getElementById("textbox2170_x2").value.trim();
        x3 = generator.getElementById("textbox2170_x3").value.trim();

        gotowyRozkaz += "<b>21.70</b>" +
                        "\n<b>Na odcinku</b> od <b>" + x1 + "</b> do <b>" + x2 + "</b> linii nr <b>" + x3 + "</b>" +
                        "\n<b>jazda pociągu z łącznością analogową.</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.70!", "error");
            return 0;
        }
    }

    // 21.80
    if (zaznaczoneCheckboxy.includes("check2180")) {
        x1 = generator.getElementById("textbox2180_x1").value.trim();
        x2 = generator.getElementById("textbox2180_x2").value.trim();
        x3 = generator.getElementById("textbox2180_x3").value.trim();
        x4 = generator.getElementById("textbox2180_x4").value.trim();
        x5 = generator.getElementById("textbox2180_x5").value.trim();

        gotowyRozkaz += "<b>21.80</b>" +
                        "\n<b>Polecam jazdę po torze zamkniętym</b> nr <b>" + x1 + "</b> w kierunku <b>" + x2 + "</b>" + 
                        "\ndo km <b>" + x3 + "</b> zjazd do <b>" + x4 + "</b> do godz. <b>" + x5 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.80!", "error");
            return 0;
        }
    }

    // 21.81
    if (zaznaczoneCheckboxy.includes("check2181")) {
        gotowyRozkaz += "<b>21.81</b>" +
                        "\n<b>Tor zamknięty wolny od taboru.</b>\n\n";
    }

    // 21.82
    if (zaznaczoneCheckboxy.includes("check2182")) {
        x1 = generator.getElementById("textbox2182_x1").value.trim();
        x2 = generator.getElementById("textbox2182_x2").value.trim();

        gotowyRozkaz += "<b>21.82</b>" +
                        "\n<b>Na torze pracuje pociąg</b> <b>" + x1 + "</b> w km <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.82!", "error");
            return 0;
        }
    }

    // 21.83
    if (zaznaczoneCheckboxy.includes("check2183")) {
        x1 = generator.getElementById("textbox2183_x1").value.trim();
        x2 = generator.getElementById("textbox2183_x2").value.trim();

        gotowyRozkaz += "<b>21.83</b>" +
                        "\n<b>Na tor zostanie wyprawiony pociąg</b> <b>" + x1 + "</b> do km <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.83!", "error");
            return 0;
        }
    }

    // 21.85
    if (zaznaczoneCheckboxy.includes("check2185")) {
        x1 = generator.getElementById("textbox2185_x1").value.trim();
        x2 = generator.getElementById("textbox2185_x2").value.trim();
        x3 = generator.getElementById("textbox2185_x3").value.trim();
        x4 = generator.getElementById("textbox2185_x4").value.trim();

        gotowyRozkaz += "<b>21.85</b>" +
                        "\n<b>Zezwalam na wstawienie PSD</b> na tor nr <b>" + x1 + "</b> w km <b>" + x2 + "</b>" + 
                        "\nna szlaku <b>" + x3 + "</b> | <b>" + x4 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert("Podaj wszystkie wymagane informacje w działce 21.85!", "error");
            return 0;
        }
    }

    // 23.10

    let secondWarningStarted = false;

    if (zaznaczoneCheckboxy.includes("check2310")) {
        for (let i = 1; i <= 18; i++) {
            const el = generator.getElementById(`textbox2310_x${i}`);
            if (el) {
                eval(`x${i} = el.value.trim()`);
            }
        }
        x95 = generator.getElementById("textbox2310_x95").value.trim();
        x96 = generator.getElementById("textbox2310_x96").value.trim();
        x97 = generator.getElementById("textbox2310_x97").value.trim();

        // Sprawdź, czy druga lub trzecia działka nie została wypełniona przy pustej pierwszej
        let othersFilled = false;
        for (let i = 7; i <= 18; i++) {
            if (eval(`x${i} !== ""`)) {
                othersFilled = true;
                break;
            }
        }

        if ((x1 === "" && x2 === "" && x3 === "" && x4 === "" && x5 === "" && x6 === "" && x95 === "") 
            && (othersFilled || x96 !== "" || x97 !== "")) {
            customAlert("Uzupełnij najpierw pierwsze ostrzeżenie!", "error");
            return 0;
        }

        // Sprawdź, czy wszystkie części 1. punktu są uzupełnione
        if (x1 == "" && x2 == "" || x3 == "" || x4 == "" || x5 == "" || x6 == "" || x95 == "") {
            customAlert("Uzupełnij w pełni pierwsze ostrzeżenie w działce 23.10!", "error");
            return 0;
        }

        // Sprawdź, czy użytkownik w ostrzeżeniu podał szlak czy sam posterunek
        if (x1 !== "" && x2 !== "") {
            x1 += " / "
        }

        gotowyRozkaz += "<b>23.10</b>" +
                        "\n<b>Nie przekraczać prędkości i zachować ostrożność:</b>" +
                        "\n\n<b>1. Na posterunku/szlaku " + x1 + x2 + ", tor nr " + x3 + "</b>" +
                        "\nV <b>" + x4 + "</b> od <b>" + x5 + "</b> do <b>" + x6 + "</b> " + x95 + "\n\n";
        
        // Sprawdź, czy któraś część 2. punktu jest uzupełniona
        if (x7 !== "" || x8 !== "" || x9 !== "" || x10 !== "" || x11 !== "" || x12 !== "" || x96 !== "") {
            secondWarningStarted = true;
            // Sprawdź, czy któreś pole jest puste
            if (x7 == "" && x8 == "" || x9 == "" || x10 == "" || x11 == "" || x12 == "" || x96 == "") {
                customAlert("Uzupełnij w pełni drugie ostrzeżenie w działce 23.10!", "error");
                return 0;
            }

            // Sprawdź, czy użytkownik w ostrzeżeniu podał szlak czy sam posterunek
            if (x7 !== "" && x8 !== "") {
                x7 += " / "
            }
            gotowyRozkaz += "<b>2. Na posterunku/szlaku " + x7 + x8 + ", tor nr " + x9 + "</b>" +
                            "\nV <b>" + x10 + "</b> od <b>" + x11 + "</b> do <b>" + x12 + "</b> " + x96 + "\n\n";
        }

        // Sprawdź, czy któraś część 3. punktu jest uzupełniona
        if (x13 !== "" || x14 !== "" || x15 !== "" || x16 !== "" || x17 !== "" || x18 !== "" || x97 !== "") {
            // Sprawdź, czy druga działka została ruszona
            if (secondWarningStarted == false) {
                customAlert("Uzupełnij najpierw drugie ostrzeżenie!", "error");
                return 0;
            }

            // Sprawdź, czy któreś pole jest puste
            if (x13 === "" && x14 === "" || x15 === "" || x16 === "" || x17 === "" || x18 === "" || x97 === "") {
                customAlert("Uzupełnij w pełni trzecie ostrzeżenie w działce 23.10!", "error");
                return 0;
            }

            // Sprawdź, czy użytkownik w ostrzeżeniu podał szlak czy sam posterunek
            if (x13 !== "" && x14 !== "") {
                x13 += " / "
            }
            gotowyRozkaz += "<b>3. Na posterunku/szlaku " + x13 + x14 + ", tor nr " + x15 + "</b>" +
                            "\nV <b>" + x16 + "</b> od <b>" + x17 + "</b> do <b>" + x18 + "</b> " + x97 + "\n\n";
        }
    }

    // 23.11
    if (zaznaczoneCheckboxy.includes("check2311")) {
        if (!zaznaczoneCheckboxy.includes("check2310")) {
            customAlert("Wydaj pierw ostrzeżenia w działce 23.10!", "alert");
            return 0; 
        }


        gotowyRozkaz += "<b>23.11</b>" +
                        "\n<b>Podawać sygnał „Baczność”.</b>\n\n"; 
    }

    // 23.20
    if (zaznaczoneCheckboxy.includes("check2320")) {
        x96 = generator.getElementById("textbox2320_x96").value.trim();

        gotowyRozkaz += "<b>23.20</b>" +
                        "\n" + x96 + "\n\n";

        // Sprawdzenie, czy działka nie jest pusta
        if (x96 == "") {
            customAlert("Nie wpisałeś nic w działkę 23.20!", "alert");
            return 0;
        }
    }

    //
    // Stopka
    //

    // Zassanie stopki
    let rozkazFooter = {
        idMaszynisty: "",
        idDyzurnego: "",
        godzina: "",
        idRozkazu: ""
    }

    // Lista pól z nagłówka do pobrania
    let polaFooter = ["idMaszynisty", "idDyzurnego", "godzina", "idRozkazu"];

    // Pobranie wartości z formularza
    for (let pole of polaFooter) { // przeleć po kolei każdą wartość z polaFooter, zapisz ją w pole
        rozkazFooter[pole] = generator.getElementById(pole).value; // pobierz wartość po kolei
        // przejdź do kolejnego elementu listy, a jak się skończy - skończ pętlę
    }

    // Sprawdzanie, czy wszystkie pola stopki są uzupełnione
    wszystkieWypelnione = polaFooter.every(pole => rozkazFooter[pole].trim() !== ""); // Usuń spacje i sprawdź, czy każde pole z listy rozkazFooter NIE jest puste i zwróć true/false

    if (!wszystkieWypelnione) { //jeśli false
        customAlert("Uzupełnij wszystkie pola stopki!", "error");
        return 0;
    }

    gotowyRozkaz += 
        "<b>V Identyfikator maszynisty:</b> " + rozkazFooter.idMaszynisty + "\n" +
        "<b>W Identyfikator nadawcy:</b> " + rozkazFooter.idDyzurnego + "\n" +
        "<b>Y Godzina:</b> " + rozkazFooter.godzina + "\n" +
        "<b>Z Identyfikator rozkazu pisemnego:</b> " + rozkazFooter.idRozkazu;

    // Dodawanie elementów do strony
    const divWynikowy = `
    <hr>
    <div class="opis">
        <h2>✅ Poniżej znajdziesz swój wygenerowany rozkaz! 📄</h2>
    </div>

    <div class="rezultat">
        <textarea disabled id="poleNaWynik"></textarea>
    </div>

    <div id="przyciski">
        <button type="button" id="przyciskKopiowania" onclick="copyToClipboard()">📝 Kopiuj treść rozkazu do schowka</button>
        <button type="button" id="przyciskUsunieciaFormatowania" onclick="removeFormatting()">✒️ Usuń formatowanie</button>
        <button type="button" id="przyciskZapisuPNG" onclick="savePNG()">🖼️ Zapisz rozkaz jako PNG</button>
    </div>
    `;
    document.getElementById("divWynikowy").innerHTML = divWynikowy;

    // Wysyłanie zmiennej z rozkazem do textboxa
    const textbox = document.getElementById("poleNaWynik");
    textbox.value = "";
    textbox.value = gotowyRozkaz;

    // Dźwięk sukcesu!
    const audio = new Audio("media/sound/sukces.wav");
    audio.play().catch(e => console.log("Nie udało się odtworzyć dźwięku:", e));

    // Scroll do wyniku
    const cel = document.getElementById("divWynikowy");
    cel.scrollIntoView({ 
        behavior: "smooth", // płynne przewijanie
        block: "start"      // element na górze widoku
    });

    return 0;
}

// ======================
// Wczytywanie changeloga
// ======================

function openChangelog() {
    fetch("changelog.txt", { cache: "no-store" })
        .then(response => {
            if (!response.ok) throw new Error("Nie udało się wczytać changeloga");
            return response.text();
        })
        .then(text => {
            customAlert(text, "changelog");
        })
        .catch(err => {
            alert("Błąd podczas wczytywania changeloga: " + err.message);
        });
}
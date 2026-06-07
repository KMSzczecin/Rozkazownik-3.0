// =====================
// Przyciski na rozkazie
// =====================

function getCurrentDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const data = `${day}.${month}.${year}` + "r";

    // Wszczepienie daty w generator
    const poleDaty = document.getElementById("data");
    poleDaty.value = data;
    return 0;
}

function getCurrentTime() {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const time = `${hours}:${minutes}`;

    // Wszczepienie godziny w generator
    const poleGodziny = document.getElementById("godzina");
    poleGodziny.value = time;
    return 0;
}

function generateRozkazID() {
    let IDRozkazu = "RD-";

    // Dodaj numer rozkazu
    let wynikLosowy = Math.floor(Math.random() * 1000);
    const numerRozkazu = String(wynikLosowy).padStart(3, "0"); //dodaj brakujące zera z przodu
    IDRozkazu += numerRozkazu + "-";

    // Dodaj kod ewidencyjny posterunku wg POS
    wynikLosowy = Math.floor(Math.random() * 100000);
    const kodEwidencyjny = String(wynikLosowy).padStart(6, "0"); //dodaj brakujące zera z przodu
    IDRozkazu += kodEwidencyjny + "-";

    // Dodaj dwie ostatnie cyfry roku
    const today = new Date();
    const year = today.getFullYear();
    const rok = String(year).slice(-2); // "25"
    IDRozkazu += rok;

    const poleIDRozkazu = document.getElementById("idRozkazu");
    poleIDRozkazu.value = IDRozkazu;
    return 0;
}

// =======================================================
// Blokowanie pól tekstowych do czasu kliknięcia checkboxa
// =======================================================

document.addEventListener("DOMContentLoaded", () => {
    // lista wyjątków — pól, które mają pozostać edytowalne
    const alwaysEditable = [
        "nrPoc",
        "data",
        "lokalizacja",
        "stacja",
        "idMaszynisty",
        "idDyzurnego",
        "godzina",
        "idRozkazu"
    ];

    // Pobieramy wszystkie inputy tekstowe i textarea
    const allInputs = document.querySelectorAll('input[type="text"], textarea');

    allInputs.forEach(input => {
        input.autocomplete = "off";
        // jeśli pole jest na liście wyjątków, pomijamy blokowanie
        if (alwaysEditable.includes(input.id)) return;

        // ustawiamy readonly
        input.readOnly = true;

        // alert przy próbie kliknięcia w readonly
        input.addEventListener('click', () => {
            if (input.readOnly) {
                parent.customAlert(tpage("noCheckedCheckboxError"), "alert");
            }
        });
    });

    // Pobieramy wszystkie checkboxy
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');

    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const row = checkbox.closest('tr');
            if (!row) return;

            const inputsInRow = row.querySelectorAll('input[type="text"], textarea');

            const lock2185 = document.getElementById("check2185")?.checked;

            inputsInRow.forEach(input => {
                if (alwaysEditable.includes(input.id)) return;
                
                if (input.id === "textbox2180_x4" && lock2185) {
                    return; // 21.85 ma priorytet
                }

                input.readOnly = !checkbox.checked;
            });
        });
    });
});

// ==================================================
// Zaznaczenie instrukcji 21.85 odblokowuje x.4 21.80
// ==================================================

document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("check2185");
    const input = document.getElementById("textbox2180_x4");

    if (!checkbox || !input) return;

    function updateState() {
        input.readOnly = !checkbox.checked;
    }

    // stan początkowy
    updateState();

    // reakcja na zmianę
    checkbox.addEventListener("change", updateState);
});

// ====================
// Tłumaczenie, odbiór!
// ====================

let currentDict = {};

window.addEventListener("DOMContentLoaded", async () => {
    let lang = localStorage.getItem("outputLang");

    if (!lang) {
        lang = "pl";
        localStorage.setItem("lang", lang);
    }

    const res = await fetch(`./lang/${lang}.json`);
    const dict = await res.json();

    currentDict = flattenTranslations(dict);

    applyLang(currentDict);
});

window.addEventListener("message", (e) => {
    if (e.data?.type !== "lang") return;

    currentDict = e.data.dict; // 🔥 TO JEST KLUCZ

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (currentDict[key]) el.innerHTML = currentDict[key];
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.dataset.i18nTitle;
        if (currentDict[key]) el.title = currentDict[key];
    });
});

function tpage(key, fallback = "") {
    return currentDict[key] ?? fallback ?? key;
}
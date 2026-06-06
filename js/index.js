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

// ============
// Zapis do PDF
// ============

function exportPDF() {
    const iframe = document.getElementById("iframeRozkaz");

    showToast("Za chwilę zostanie otwarte systemowe okno drukowania. Wybierz drukarkę lub opcję \"Zapisz jako PDF\" by zapisać plik.", 6000);

    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }, 6000);
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
            console.log("Błąd podczas wczytywania changeloga: " + err.message);
            customAlert("Nie udało się wczytać changeloga. Spróbuj ponownie później.", "error");
        });
}

// ======================
// Giga tajny bojuuuuuuuś
// ======================

const secret = "bojek";
let typed = "";

// funkcja pokazująca obrazek
function showBojek() {
    customAlert("<img src='media/img/bojek.png' style='max-height: 75vh; max-width: 360px';>", "changelog");
}

// sprawdzenie wpisanych znaków
function checkTyped(key) {
    typed += key.toLowerCase();
    if (typed.length > secret.length) typed = typed.slice(-secret.length);
    if (typed === secret) {
        showBojek();
        typed = "";
    }
}

// --- wpisywanie w rodzicu ---
document.addEventListener("keydown", e => checkTyped(e.key));
document.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", e => {
        const value = el.value;
        const lastChars = value.slice(-secret.length);
        checkTyped(lastChars);
    });
});

// --- komunikaty z iframe ---
window.addEventListener("message", e => {
    if (e.data && e.data.type === "showBojek") {
        showBojek();
    }
});

// --- nasłuchiwanie iframe ---
const iframe = document.getElementById("iframeRozkaz");
iframe.addEventListener("load", () => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    if (!iframeDoc) return;

    // keydown w iframe
    iframeDoc.addEventListener("keydown", e => {
        checkTyped(e.key);
    });

    // input/textarea w iframe
    iframeDoc.querySelectorAll("input, textarea").forEach(el => {
        el.addEventListener("input", e => {
            const value = el.value;
            const lastChars = value.slice(-secret.length);
            checkTyped(lastChars);
        });
    });
});

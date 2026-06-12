// ==================
// Padding dla stopki
// ==================

function updateBodyPadding() {
    const footer = document.getElementById('footer');
    if (!footer) return;
    const footerHeight = footer.offsetHeight;
    document.body.style.paddingBottom = footerHeight + 'px';
}

// Aktualizacja po załadowaniu strony i przy każdej zmianie rozmiaru okna
window.addEventListener('load', updateBodyPadding);
window.addEventListener('resize', updateBodyPadding);

// ==========
// Odświeżacz
// ==========

document.getElementById("refreshButton").addEventListener("click", () => {
    const iframe = document.getElementById("iframeRozkaz");

    // ustaw handler na jedno ładowanie
    iframe.addEventListener("load", function onLoad() {
        iframe.removeEventListener("load", onLoad);

        syncIframeLang();
    });

    iframe.contentWindow.location.reload();
});

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
    let toast = document.getElementById("toast");

    // jeśli toast już istnieje, usuń go
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
    const okno = document.getElementById("oknoGeneratora");
    const przycisk = document.getElementById("przyciskRozwijacza");

    okno.classList.toggle("big");

    czyUzytyRozwijacz = okno.classList.contains("big");

    if (czyUzytyRozwijacz) {
        przycisk.dataset.i18n = "shrinkButton";
    } else {
        przycisk.dataset.i18n = "expandButton";
    }

    applyUI();
}


// =============================
// Kopiowanie rozkazu do schowka
// =============================

function copyToClipboard() {
    const textarea = document.getElementById("poleNaWynik");
    if (!textarea) return;

    navigator.clipboard.writeText(textarea.value)
        .then(() => {
            showToast(tpage("orderCopied"), 2000);
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
        przycisk.dataset.i18n = "restoreFormattingButton";
        let sformatowanyRozkaz = gotowyRozkaz;
        sformatowanyRozkaz = sformatowanyRozkaz.replace(/<\/?(b|u)>/g, "");
        textbox.value = sformatowanyRozkaz;
        showToast(tpage("formattingRemoved"), 2000);
    }
    else {
        // Zamiana przycisków
        czyUzytyFormat = false;
        przycisk.dataset.i18n = "removeFormattingButton";
        textbox.value = gotowyRozkaz;
        showToast(tpage("formattingRestored"), 2000);
    }

    applyUI();
}

// ============
// Zapis do PDF
// ============

function exportPDF() {
    const iframe = document.getElementById("iframeRozkaz");

    showToast(tpage("savedAsPDF"), 6000);

    setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }, 6000);
}

// ======================
// Wczytywanie changeloga
// ======================

async function openChangelog() {
    const lang = localStorage.getItem("lang") || "pl";

    const primary = `changelog_${lang}.txt`;
    const fallback = "changelog_en.txt";

    let res = await fetch(primary, { cache: "no-store" });

    if (!res.ok) {
        res = await fetch(fallback, { cache: "no-store" });
    }

    if (!res.ok) {
        console.log("Brak changeloga");
        customAlert(tpage("failedChangelogLoad"), "error");
        return;
    }

    const text = await res.text();
    customAlert(text, "changelog");
}

// ======================
// Giga tajny bojuuuuuuuś
// ======================

const secret = "bojek";
let typed = "";

// funkcja pokazująca obrazek
function showBojek() {
    customAlert("<img src='media/img/bojek.png' style='max-height: 60vh; max-width: 360px';>", "changelog");
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

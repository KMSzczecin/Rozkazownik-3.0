// ========
// Słowniki
// ========

let uiDict = {};
let orderDict = {};

// =================
// Płaszczenie jsona
// =================

function flattenTranslations(obj) {
    const out = {};
    (function walk(o) {
        for (const k in o) {
            if (typeof o[k] === "object") walk(o[k]);
            else out[k] = o[k];
        }
    })(obj);
    return out;
}

// =====================
// Wczytywanie słowników
// =====================

async function loadUI(lang) {
    const res = await fetch(`lang/${lang}.json`);
    uiDict = flattenTranslations(await res.json());
    document.getElementById("languageChangeBtn").querySelector("img").src = `media/flags/${lang}.png`;
    applyUI();
}

async function loadOrder(lang) {
    const res = await fetch(`lang/${lang}.json`);
    orderDict = flattenTranslations(await res.json());
    document.getElementById("outputLanguageChangeBtn").querySelector("img").src = `media/flags/${lang}.png`;
}

function applyUI() {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (uiDict[key]) el.innerHTML = uiDict[key];
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.dataset.i18nTitle;
        if (uiDict[key]) el.title = uiDict[key];
    });
}

// ======================
// Funkcje przetwarzatora
// ======================

function t(key, fallback = "") {
    return orderDict[key] ?? fallback ?? key;
}

function tpage(key, fallback = "") {
    return uiDict[key] ?? fallback ?? key;
}

// =======
// Starter
// =======
(async function init() {
    await loadUI(localStorage.getItem("lang") || "pl");
    await loadOrder(localStorage.getItem("outputLang") || "pl");
    syncIframeLang();
})();

// ===================
// Zmiana języków w UI
// ===================

async function setLang(lang) {
    localStorage.setItem("lang", lang);
    await loadUI(lang);
    syncIframeLang();
}

async function setOrderLang(lang) {
    localStorage.setItem("outputLang", lang);
    await loadOrder(lang);
    showToast(tpage("outputLangChanged"), 3000)
}

// ===========
// iframe sync
// ===========

async function syncIframeLang() {
    const lang = localStorage.getItem("lang") || "pl";

    const res = await fetch(`lang/${lang}.json`);
    const dict = await res.json();

    iframe?.contentWindow?.postMessage({
        type: "lang",
        dict: flattenTranslations(dict)
    }, "*");
}
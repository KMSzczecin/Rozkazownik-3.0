let currentDict = {};
let orderDict = {};

async function loadLang(lang) {
    const res = await fetch(`./lang/${lang}.json`);
    let dict = await res.json();

    dict = flattenTranslations(dict);

    currentDict = dict;

    localStorage.setItem("lang", lang);

    applyLang(dict);

    document.getElementById("languageChangeBtn").querySelector("img").src = `media/flags/${lang}.png`;

    const iframe = document.getElementById("iframeRozkaz");
    iframe?.contentWindow?.postMessage({ type: "lang", dict }, "*");
}

async function loadOrderLang() {
    const orderOutputLang = localStorage.getItem("outputLang") || "pl";

    const res = await fetch(`./lang/${orderOutputLang}.json`);
    orderDict = await res.json();

    orderDict = flattenTranslations(orderDict);
    console.log(orderDict);
}

function t(key, fallback = "") {
    return orderDict[key] ?? fallback ?? key;
}

function tpage(key, fallback = "") {
    return currentDict[key] ?? fallback ?? key;
}

function applyLang(dict) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (dict[key]) el.innerHTML = dict[key];
    });

    document.querySelectorAll("[data-i18n-title]").forEach(el => {
        const key = el.dataset.i18nTitle;
        if (dict[key]) el.title = dict[key];
    });
}

function flattenTranslations(obj) {
    const out = {};

    function walk(o) {
        for (const k in o) {
            if (typeof o[k] === "object") walk(o[k]);
            else out[k] = o[k];
        }
    }

    walk(obj);
    return out;
}

window.addEventListener("DOMContentLoaded", () => {
    loadLang(localStorage.getItem("lang") || "pl");
});
// ===================
// Generowanie rozkazu
// ===================
var gotowyRozkaz, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x95, x96, x97, x42180;

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
        customAlert("Nie wypisuje się pustych rozkazów!" + "<br>" + "Zaznacz przynajmniej jedną instrukcję.", "error");
        return 0;
    }

    // 22.00
    if (zaznaczoneCheckboxy == "check2200") {
        customAlert("Musisz coś jeszcze dodać do tego rozkazu. Sama instrukcja 22.00 nie wystarczy!", "alert");
        return 0;
    }

    // Sprawdzenie, czy przy wybranej instrukcji 22 zaznaczona jest jednocześnie przynajmniej jedna z instrukcji: 21.10, 21.15, 21.35
    if (zaznaczoneCheckboxy.includes("check2200")) {
        if (!zaznaczoneCheckboxy.includes("check2110") && !zaznaczoneCheckboxy.includes("check2115") && !zaznaczoneCheckboxy.includes("check2135")) {
            customAlert("Instrukcja 22 może być wydana jedynie, gdy rozkaz zawiera również instrukcję 21.10, 21.15 lub 21.35!", "error");
            return 0;
        }
    }

    if (zaznaczoneCheckboxy.includes("check2200")) {
        gotowyRozkaz += "<b>22.00</b>" +
                        "\n<b>Dotyczy jazdy torem lewym</b>\n\n";
    }

    // 99
    if (zaznaczoneCheckboxy.includes("check99")) {
        x1 = generator.getElementById("textbox99_x1").value.trim();
        if (x1 == "") {
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 99!", "error");
            return 0;
        }
        gotowyRozkaz += "<b>99</b>\n<b>Odwołanie rozkazu pisemnego</b> " + x1 +"\n\n";
    }

    // Sprawdzenie, czy użytkownik nie próbuje jednocześnie wypisać 21.10 i 21.15
    if (zaznaczoneCheckboxy.includes("check2110") && zaznaczoneCheckboxy.includes("check2115") ) {
        customAlert("Nie możesz wydać rozkazu jednocześnie na wjazd i wyjazd pociągu!" + "<br>" + "Wystaw dwa osobne rozkazy.", "error");
        return 0;
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.10!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.15!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.20!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.25!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.35!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.40!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.45!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.50!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.55!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.60!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.65!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.70!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.80!", "error");
            return 0;
        }
    }

    // Sprawdzenie, czy użytkownik nie próbuje jednocześnie wypisać 21.81 i 21.82
    if (zaznaczoneCheckboxy.includes("check2181") && zaznaczoneCheckboxy.includes("check2182") ) {
        customAlert("Tor jest wolny od taboru, ale na torze pracuje pociąg? Wybierz jedną z instrukcji - 21.81 lub 21.82!", "error");
        return 0;
    }

    // Sprawdź, czy do 21.81 lub 21.82 wydana jest instrukcja 21.80
    if ((zaznaczoneCheckboxy.includes("check2181") || zaznaczoneCheckboxy.includes("check2182")) && !zaznaczoneCheckboxy.includes("check2180")) {
        customAlert("Instrukcje 21.81 i 21.82 mogą być wydane jedynie, gdy rozkaz zawiera również instrukcję 21.80!", "error");
        return 0;
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.82!", "error");
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
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.83!", "error");
            return 0;
        }
    }

    // 21.85
    if (zaznaczoneCheckboxy.includes("check2185")) {
        x1 = generator.getElementById("textbox2185_x1").value.trim();
        x2 = generator.getElementById("textbox2185_x2").value.trim();
        x3 = generator.getElementById("textbox2185_x3").value.trim();
        x4 = generator.getElementById("textbox2185_x4").value.trim();

        // Jeśli w 21.80 x.4 wpisana jest treść, dodaj 21.80 do rozkazu
        x42180 = generator.getElementById("textbox2180_x4").value.trim();
        if (x42180 !== "") {
            gotowyRozkaz += "<b>21.80</b>" +
                            "\n<b>Polecam jazdę po torze zamkniętym</b> nr .......... w kierunku ........................." + 
                            "\ndo km .......... zjazd do <b>" + x42180 + "</b> do godz. ..........\n\n";
        }

        gotowyRozkaz += "<b>21.85</b>" +
                        "\n<b>Zezwalam na wstawienie PSD</b> na tor nr <b>" + x1 + "</b> w km <b>" + x2 + "</b>" + 
                        "\nna szlaku <b>" + x3 + "</b> | <b>" + x4 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert("Podaj wszystkie wymagane informacje w instrukcji 21.85!", "error");
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
            customAlert("Uzupełnij w pełni pierwsze ostrzeżenie w instrukcji 23.10!", "error");
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
                customAlert("Uzupełnij w pełni drugie ostrzeżenie w instrukcji 23.10!", "error");
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
                customAlert("Uzupełnij w pełni trzecie ostrzeżenie w instrukcji 23.10!", "error");
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
            customAlert("Wydaj pierw ostrzeżenia w instrukcji 23.10!", "alert");
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
            customAlert("Nie wpisałeś nic w instrukcję 23.20!", "alert");
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
        <button type="button" id="przyciskZapisuPDF" onclick="exportPDF()">🖼️ Zapisz rozkaz jako PDF / Drukuj</button>
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
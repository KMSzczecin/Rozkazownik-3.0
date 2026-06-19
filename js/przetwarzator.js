// ===================
// Generowanie rozkazu
// ===================
var gotowyRozkaz, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15, x16, x17, x18, x91, x92, x93, x96, x42180;

function makeItWork() {
    // Zastosowanie języka i sprzątanie po poprzednim rozkazie
    czyUzytyFormat = false;

    // Zmienna przechowująca rozkaz
    gotowyRozkaz = "<b>" + t("orderName") + "</b>\n\n";

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
        customAlert(tpage("headerError"), "error");
        return 0;
    }

    gotowyRozkaz += 
        "<b>" + t("orderHeader_A") + ":</b> " + rozkazHeader.nrPoc + "\n" +
        "<b>" + t("orderHeader_B") + ":</b> " + rozkazHeader.data + "\n" +
        "<b>" + t("orderHeader_C") + ":</b> " + rozkazHeader.lokalizacja + "\n" +
        "<b>" + t("orderHeader_D") + ":</b> " + rozkazHeader.stacja + "\n\n";

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
        customAlert(tpage("emptyOrderError_1") + "<br>" + tpage("emptyOrderError_2"), "error");
        return 0;
    }

    // Sprawdzenie, czy przy wybranej instrukcji 22 zaznaczona jest jednocześnie przynajmniej jedna z instrukcji: 21.10, 21.15, 21.35
    if (zaznaczoneCheckboxy.includes("check2200")) {
        if (!zaznaczoneCheckboxy.includes("check2110") && !zaznaczoneCheckboxy.includes("check2115") && !zaznaczoneCheckboxy.includes("check2135")) {
            customAlert(tpage("order22Error"), "error");
            return 0;
        }
    }

    if (zaznaczoneCheckboxy.includes("check2200")) {
        gotowyRozkaz += "<b>22.00</b>" +
                        "\n<b>" + t("order22_text1") + "</b>\n\n";
    }

    // 99
    if (zaznaczoneCheckboxy.includes("check99")) {
        if (zaznaczoneCheckboxy.includes("check99") && zaznaczoneCheckboxy.length > 1) {
            customAlert(tpage("order99Error"), "error");
            return 0;
        }

        x1 = generator.getElementById("textbox99_x1").value.trim();
        if (x1 == "") {
            customAlert(tpage("fillAllFieldsError") + "99!", "error");
            return 0;
        }
        gotowyRozkaz += "<b>99</b>\n<b>" + t("order99_text1") + "</b> " + x1 +"\n\n";
    }

    // Sprawdzenie, czy użytkownik nie próbuje jednocześnie wypisać 21.10 i 21.15
    if (zaznaczoneCheckboxy.includes("check2110") && zaznaczoneCheckboxy.includes("check2115") ) {
        customAlert(tpage("orders2110_2115Error_1") + "<br>" + tpage("orders2110_2115Error_2"), "error");
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
                        "\n<b>" + t("order2110_text1") + "</b> " + t("order2110_text2") + " <b>" + x1 +
                        "</b> " + t("order2110_text3") + " <b>" + x2 +
                        "</b>\n" + t("order2110_text4") + " <b>" + x3 +
                        "</b> " + t("order2110_text5") + " <b>" + x4;

        var pomijaneSygnaly = [];
        if (x5 !== "") pomijaneSygnaly.push(x5);
        if (x6 !== "") pomijaneSygnaly.push(x6);
        if (x7 !== "") pomijaneSygnaly.push(x7);

        if (pomijaneSygnaly.length > 0) {
            gotowyRozkaz += "</b>\n" + t("order2110_text6") + " <b>" + pomijaneSygnaly.join("</b> " + t("order2110_text7") + " <b>");
        }

        gotowyRozkaz += "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.10!", "error");
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
                        "\n<b>" + t("order2115_text1") + "</b> " + t("order2115_text2") + " <b>" + x1 +
                        "</b> " + t("order2115_text3") + " <b>" + x2 +
                        "</b> " + t("order2115_text4") + " <b>" + x3;

        var pomijaneSygnaly = [];
        if (x4 !== "") pomijaneSygnaly.push(x4);
        if (x5 !== "") pomijaneSygnaly.push(x5);
        if (x6 !== "") pomijaneSygnaly.push(x6);

        if (pomijaneSygnaly.length > 0) {
            gotowyRozkaz += "</b>\n" + t("order2115_text5") + " <b>" + pomijaneSygnaly.join("</b> " + t("order2115_text6") + " <b>");
        }

        gotowyRozkaz += "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.15!", "error");
            return 0;
        }
    }

    // 21.20
    if (zaznaczoneCheckboxy.includes("check2120")) {
        x1 = generator.getElementById("textbox2120_x1").value.trim();
        x2 = generator.getElementById("textbox2120_x2").value.trim();
        x3 = generator.getElementById("textbox2120_x3").value.trim();

        gotowyRozkaz += "<b>21.20</b>" +
                        "\n" + t("order2120_text1") + " <b>" + x1 +
                        "</b> " + t("order2120_text2") + " <b>" + x2 +
                        "</b> " + t("order2120_text3") + " <b>" + x3 +
                        "</b>\n<u><b>" + t("order2120_text4") + "</b></u>" +
                        "\n<u>" + t("order2120_text5") + " <b>" + t("order2120_text6") + "</b></u>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.20!", "error");
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
                        "\n" + t("order2125_text1") + " <b>" + x1 +
                        "</b>\n" + t("order2125_text2") + " <b>" + x2 + "</b> " + t("order2125_text3") + " <b>" + x3 + "</b> " + t("order2125_text4") + " <b>" + x4 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.25!", "error");
            return 0;
        }
    }

    // 21.35
    if (zaznaczoneCheckboxy.includes("check2135")) {
        x1 = generator.getElementById("textbox2135_x1").value.trim();
        x2 = generator.getElementById("textbox2135_x2").value.trim();

        gotowyRozkaz += "<b>21.35</b>" +
                        "\n" + t("order2135_text1") + " " + t("order2135_text2") + " <b>" + x1 +
                        "</b> " + t("order2135_text3") + " <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.35!", "error");
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
                        "\n<b>" + t("order2140_text1") + "</b> " + t("order2140_text2") + " <b>" + x1 + x2 +
                        "</b>\n" + t("order2140_text4") + " <b>" + x3 + "</b> " + t("order2140_text5") + " <b>" + x96 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "" || x96 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.40!", "error");
            return 0;
        }
    }

    // 21.45
    if (zaznaczoneCheckboxy.includes("check2145")) {
        x1 = generator.getElementById("textbox2145_x1").value.trim();
        x2 = generator.getElementById("textbox2145_x2").value.trim();

        gotowyRozkaz += "<b>21.45</b>" +
                        "\n" + t("order2145_text1") + " <b>" + x1 + "</b> " + t("order2145_text2") + " <b>" + x2 +
                        "</b>\n<b>" + t("order2145_text3") + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.45!", "error");
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
                        "\n<b>" + t("order2150_text1") + "</b> " + t("order2150_text2") +
                        "\n<b>" + x1 + x2 + "</b> " + t("order2150_text4") + " <b>" + x3 +
                        "</b>\n<b>" + t("order2150_text5") + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.50!", "error");
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
                        "\n<b>" + t("order2155_text1") + "</b> " + t("order2155_text2") +
                        "\n<b>" + x1 + x2 + "</b> " + t("order2155_text4") + " <b>" + x3 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.55!", "error");
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

        if (x5 == "") {
            x5 = "............";
        }

        gotowyRozkaz += "<b>21.60</b>" +
                        "\n<b>" + t("order2160_text1") + "</b> " + t("order2160_text2") + " <b>" + x1 + "</b> " + t("order2160_text3") + " <b>" + x2 + "</b>" + 
                        "\n" + t("order2160_text4") + " <b>" + x3 + "</b> " + t("order2160_text5") + " <b>" + x4 + "</b> " + t("order2160_text6") + " <b>" + x5 + " km/h</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.60!", "error");
            return 0;
        }
    }

    // 21.65
    if (zaznaczoneCheckboxy.includes("check2165")) {
        x1 = generator.getElementById("textbox2165_x1").value.trim();
        x2 = generator.getElementById("textbox2165_x2").value.trim();

        gotowyRozkaz += "<b>21.65</b>" +
                        "\n<b>" + t("order2165_text1") + "</b> " + t("order2165_text2") + " km <b>" + x1 + "</b> " + t("order2165_text3") + " km <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.65!", "error");
            return 0;
        }
    }

    // 21.70
    if (zaznaczoneCheckboxy.includes("check2170")) {
        x1 = generator.getElementById("textbox2170_x1").value.trim();
        x2 = generator.getElementById("textbox2170_x2").value.trim();
        x3 = generator.getElementById("textbox2170_x3").value.trim();

        gotowyRozkaz += "<b>21.70</b>" +
                        "\n<b>" + t("order2170_text1") + "</b> " + t("order2170_text2") + " <b>" + x1 + "</b> " + t("order2170_text3") + " <b>" + x2 + "</b> " + t("order2170_text4") + " <b>" + x3 + "</b>" +
                        "\n<b>" + t("order2170_text5") + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.70!", "error");
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
                        "\n<b>" + t("order2180_text1") + "</b> " + t("order2180_text2") + " <b>" + x1 + "</b> " + t("order2180_text3") + " <b>" + x2 + "</b>" + 
                        "\n" + t("order2180_text4") + " <b>" + x3 + "</b> " + t("order2180_text5") + " <b>" + x4 + "</b> " + t("order2180_text6") + " <b>" + x5 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" && x3 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.80!", "error");
            return 0;
        }
    }

    // Sprawdzenie, czy użytkownik nie próbuje jednocześnie wypisać 21.81 i 21.82
    if (zaznaczoneCheckboxy.includes("check2181") && zaznaczoneCheckboxy.includes("check2182") ) {
        customAlert(tpage("orders2181_2182Error"), "error");
        return 0;
    }

    // Sprawdź, czy do 21.81 lub 21.82 wydana jest instrukcja 21.80
    if ((zaznaczoneCheckboxy.includes("check2181") || zaznaczoneCheckboxy.includes("check2182")) && !zaznaczoneCheckboxy.includes("check2180")) {
        customAlert(tpage("needs2180Error"), "error");
        return 0;
    }

    // 21.81
    if (zaznaczoneCheckboxy.includes("check2181")) {
        gotowyRozkaz += "<b>21.81</b>" +
                        "\n<b>" + t("order2181_text1") + "</b>\n\n";
    }

    // 21.82
    if (zaznaczoneCheckboxy.includes("check2182")) {
        x1 = generator.getElementById("textbox2182_x1").value.trim();
        x2 = generator.getElementById("textbox2182_x2").value.trim();

        gotowyRozkaz += "<b>21.82</b>" +
                        "\n<b>" + t("order2182_text1") + "</b> <b>" + x1 + "</b> " + t("order2182_text2") + " <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.82!", "error");
            return 0;
        }
    }

    // 21.83
    if (zaznaczoneCheckboxy.includes("check2183")) {
        x1 = generator.getElementById("textbox2183_x1").value.trim();
        x2 = generator.getElementById("textbox2183_x2").value.trim();

        gotowyRozkaz += "<b>21.83</b>" +
                        "\n<b>" + t("order2183_text1") + "</b> <b>" + x1 + "</b> " + t("order2183_text2") + " <b>" + x2 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.83!", "error");
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

        if (x42180 !== "" && !zaznaczoneCheckboxy.includes("check2180")) {
            gotowyRozkaz += "<b>21.80</b>" +
                            "\n<b>" + t("order2180_text1") + "</b> " + t("order2180_text2") + " .......... " + t("order2180_text3") + " ........................." + 
                            "\n" + t("order2180_text4") + " .......... " + t("order2180_text5") + " <b>" + x42180 + "</b> " + t("order2180_text6") + " ..........\n\n";
        }

        gotowyRozkaz += "<b>21.85</b>" +
                        "\n<b>" + t("order2185_text1") + "</b> " + t("order2185_text2") + " <b>" + x1 + "</b> " + t("order2185_text3") + " <b>" + x2 + "</b>" + 
                        "\n" + t("order2185_text4") + " <b>" + x3 + "</b> | <b>" + x4 + "</b>\n\n";

        // Sprawdzenie, czy nie ma pustych pól
        if (x1 == "" || x2 == "" || x3 == "" || x4 == "") {
            customAlert(tpage("fillAllFieldsError") + "21.85!", "error");
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
        x91 = generator.getElementById("textbox2310_x91").value.trim();
        x92 = generator.getElementById("textbox2310_x92").value.trim();
        x93 = generator.getElementById("textbox2310_x93").value.trim();

        // Sprawdź, czy druga lub trzecia działka nie została wypełniona przy pustej pierwszej
        let othersFilled = false;
        for (let i = 7; i <= 18; i++) {
            if (eval(`x${i} !== ""`)) {
                othersFilled = true;
                break;
            }
        }

        if ((x1 === "" && x2 === "" && x3 === "" && x4 === "" && x5 === "" && x6 === "" && x91 === "") && (othersFilled || x92 !== "" || x93 !== "")) {
            customAlert(tpage("fill1stWarningError"), "error");
            return 0;
        }

        // Sprawdź, czy wszystkie części 1. punktu są uzupełnione
        if (x1 == "" && x2 == "" || x3 == "" || x4 == "" || x5 == "" || x6 == "" || x91 == "") {
            customAlert(tpage("fillWhole1stWarningError"), "error");
            return 0;
        }

        // Sprawdź, czy użytkownik w ostrzeżeniu podał szlak czy sam posterunek
        if (x1 !== "" && x2 !== "") {
            x1 += " / "
        }

        gotowyRozkaz += "<b>23.10</b>" +
                        "\n<b>" + t("order2310_text1") + "</b>" +
                        "\n\n<b>" + t("order2310_part1_title") + " " + x1 + x2 + ", " + t("order2310_tor") + " " + x3 + "</b>" +
                        "\nV <b>" + x4 + " km/h</b> " + t("order2310_od") + " km <b>" + x5 + "</b> " + t("order2310_do") + " km <b>" + x6 + "</b> - " + x91 + "\n\n";
        
        // Sprawdź, czy któraś część 2. punktu jest uzupełniona
        if (x7 !== "" || x8 !== "" || x9 !== "" || x10 !== "" || x11 !== "" || x12 !== "" || x92 !== "") {
            secondWarningStarted = true;
            // Sprawdź, czy któreś pole jest puste
            if (x7 == "" && x8 == "" || x9 == "" || x10 == "" || x11 == "" || x12 == "" || x92 == "") {
                customAlert(tpage("fillWhole2ndWarningError"), "error");
                return 0;
            }

            // Sprawdź, czy użytkownik w ostrzeżeniu podał szlak czy sam posterunek
            if (x7 !== "" && x8 !== "") {
                x7 += " / "
            }
            gotowyRozkaz += "<b>" + t("order2310_part2_title") + " " + x7 + x8 + ", " + t("order2310_tor") + " " + x9 + "</b>" +
                        "\nV <b>" + x10 + " km/h</b> " + t("order2310_od") + " km <b>" + x11 + "</b> " + t("order2310_do") + " km <b>" + x12 + "</b> - " + x92 + "\n\n";
        }

        // Sprawdź, czy któraś część 3. punktu jest uzupełniona
        if (x13 !== "" || x14 !== "" || x15 !== "" || x16 !== "" || x17 !== "" || x18 !== "" || x93 !== "") {
            // Sprawdź, czy druga działka została ruszona
            if (secondWarningStarted == false) {
                customAlert(tpage("fill2ndWarningError"), "error");
                return 0;
            }

            // Sprawdź, czy któreś pole jest puste
            if (x13 === "" && x14 === "" || x15 === "" || x16 === "" || x17 === "" || x18 === "" || x93 === "") {
                customAlert(tpage("fillWhole3rdWarningError"), "error");
                return 0;
            }

            // Sprawdź, czy użytkownik w ostrzeżeniu podał szlak czy sam posterunek
            if (x13 !== "" && x14 !== "") {
                x13 += " / "
            }
            gotowyRozkaz += "<b>" + t("order2310_part3_title") + " " + x13 + x14 + ", " + t("order2310_tor") + " " + x15 + "</b>" +
                            "\nV <b>" + x16 + " km/h</b> " + t("order2310_od") + " km <b>" + x17 + "</b> " + t("order2310_do") + " km <b>" + x18 + "</b> - " + x93 + "\n\n";
        }
    }

    // 23.11
    if (zaznaczoneCheckboxy.includes("check2311")) {
        if (!zaznaczoneCheckboxy.includes("check2310")) {
            customAlert(tpage("fill2310First"), "alert");
            return 0; 
        }


        gotowyRozkaz += "<b>23.11</b>" +
                        "\n<b>" + t("order2311_text1") + "</b>\n\n"; 
    }

    // 23.20
    if (zaznaczoneCheckboxy.includes("check2320")) {
        x96 = generator.getElementById("textbox2320_x96").value.trim();

        gotowyRozkaz += "<b>23.20</b>" +
                        "\n" + x96 + "\n\n";

        // Sprawdzenie, czy działka nie jest pusta
        if (x96 == "") {
            customAlert(tpage("order2320Error"), "alert");
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
        customAlert(tpage("footerError"), "error");
        return 0;
    }

    gotowyRozkaz += 
        "<b>V " + t("orderFooter_V") + ":</b> " + rozkazFooter.idMaszynisty + "\n" +
        "<b>W " + t("orderFooter_W") + ":</b> " + rozkazFooter.idDyzurnego + "\n" +
        "<b>Y " + t("orderFooter_Y") + ":</b> " + rozkazFooter.godzina + "\n" +
        "<b>Z " + t("orderFooter_Z") + ":</b> " + rozkazFooter.idRozkazu;

    // Dodawanie elementów do strony
    const divWynikowy = `
    <hr>
    <div class="opis">
        <h2><span data-i18n="resultTitle"></span></h2>
    </div>

    <div class="rezultat">
        <textarea disabled id="poleNaWynik"></textarea>
    </div>

    <div id="przyciski" class="teSzerokie">
        <button type="button" id="przyciskKopiowania" onclick="copyToClipboard()"><span data-i18n="copyButton"></span></button>
        <button type="button" id="przyciskUsunieciaFormatowania" onclick="removeFormatting()"><span data-i18n="removeFormattingButton"></span></button>
        <button type="button" id="przyciskZapisuPDF" onclick="exportPDF()"><span data-i18n="saveButton"></span></button>
    </div>
    `;
    document.getElementById("divWynikowy").innerHTML = divWynikowy;
    applyUI();

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
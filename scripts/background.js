chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.action === "execute") {
        console.log("Ejecutando acción 'execute'...");
        const tabs = await chrome.tabs.query({});

        let wikipediaTab, facebookTab;

        tabs.forEach((tab) => {
            if (tab.url && tab.url.includes("wikipedia.org")) {
                wikipediaTab = tab;
            }
            if (tab.url && tab.url.includes("https://www.facebook.com/r.php")) {
                facebookTab = tab;
            }
        });

        if (wikipediaTab && facebookTab) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: wikipediaTab.id },
                    files: ["scripts/content-wikipedia.js"],
                },
                (results) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error ejecutando script en Wikipedia:", chrome.runtime.lastError.message);
                        return;
                    }

                    console.log("Resultados del script de Wikipedia:", results);
                    const data = results[0]?.result;

                    if (!data) {
                        console.error("No se obtuvieron datos de Wikipedia.");
                        return;
                    }

                    console.log("Ejecutando script en Facebook con datos:", data);
                    chrome.scripting.executeScript({
                        target: { tabId: facebookTab.id },
                        func: fillFacebookForm,
                        args: [data],
                    });
                }
            );
        } else {
            console.error("No se encontraron ambas pestañas necesarias.");
            sendResponse({ status: "error", message: "Asegúrate de tener abiertas las páginas de Wikipedia y Facebook." });
        }
    }
});

function fillFacebookForm(data) {

    const nameField = document.querySelector('input[name="firstname"]');
    const surnameField = document.querySelector('input[name="lastname"]');
    const birthDayField = document.querySelector('select[name="birthday_day"]');
    const birthMonthField = document.querySelector('select[name="birthday_month"]');
    const birthYearField = document.querySelector('select[name="birthday_year"]');
    const genderMaleField = document.querySelector('input[value="2"]');
    const genderFemaleField = document.querySelector('input[value="1"]');

    function parseBirthDate(birthDate) {
        const months = {
            enero: "1",
            febrero: "2",
            marzo: "3",
            abril: "4",
            mayo: "5",
            junio: "6",
            julio: "7",
            agosto: "8",
            septiembre: "9",
            octubre: "10",
            noviembre: "11",
            diciembre: "12",
        };

        const match = birthDate.match(/(\d{1,2}) de (\w+) de (\d{4})/);
        if (match) {
            const day = match[1];
            const month = months[match[2].toLowerCase()];
            const year = match[3];
            return [day, month, year];
        }
        return ["", "", ""];
    }

    if (nameField) {
        nameField.value = data.name.split(" ")[0];
    }
    if (surnameField) {
        surnameField.value = data.name.split(" ").slice(1).join(" ");
    }
    if (birthDayField && birthMonthField && birthYearField) {
        const [day, month, year] = parseBirthDate(data.birthDate);
        birthDayField.value = day;
        birthMonthField.value = month;
        birthYearField.value = year;
    }
    if (genderMaleField && genderFemaleField) {
        if (data.gender === "Hombre") {
            genderMaleField.checked = true;
        } else if (data.gender === "Mujer") {
            genderFemaleField.checked = true;
        }
    }
}
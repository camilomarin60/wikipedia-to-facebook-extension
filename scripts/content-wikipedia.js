(() => {
    const name = document.querySelector("#firstHeading")?.innerText || "Nombre no encontrado";

    const infoBox = document.querySelector(".infobox");
    let birthDate = "Fecha no encontrada";
    let nationality = "Nacionalidad no encontrada";
    let gender = "No especificado";

    if (infoBox) {
        const birthRow = Array.from(infoBox.querySelectorAll("tr")).find((row) =>
            row.innerText.includes("Nacimiento")
        );
        const nationalityRow = Array.from(infoBox.querySelectorAll("tr")).find((row) =>
            row.innerText.includes("Nacionalidad")
        );

        if (birthRow) {
            const birthText = birthRow.querySelector("td")?.innerText || "";
            const dateMatch = birthText.match(/\d{1,2} de \w+ de \d{4}/);
            if (dateMatch) {
                birthDate = dateMatch[0];
                console.log("Fecha de nacimiento extraída:", birthDate);
            }
        }

        if (nationalityRow) {
            nationality = nationalityRow.querySelector("td")?.innerText || nationality;
            console.log("Nacionalidad extraída:", nationality);
        }

        if (name.toLowerCase().includes("cristiano")) {
            gender = "Hombre";
        } else if (name.toLowerCase().includes("cristiana")) {
            gender = "Mujer";
        }
    }

    return { name, birthDate, nationality, gender };
})();
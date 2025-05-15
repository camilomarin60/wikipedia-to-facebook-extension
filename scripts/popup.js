document.addEventListener("DOMContentLoaded", () => {
    const executeButton = document.getElementById("executeButton");

    executeButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "execute" });
    });
});
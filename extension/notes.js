document.getElementById("notes").addEventListener("change", () => {
    browser.storage.local.set({
        general_notes: document.getElementById("notes").value
    });
});
document.addEventListener("DOMContentLoaded", () => {
    browser.storage.local.get().then((res) => {
        document.getElementById("notes").value = res.general_notes || "";
    });
});

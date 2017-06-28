function saveNotes() {
    browser.storage.local.set({
        general_notes: document.getElementById("notes").value
    });
}
function loadNotes(e) {
    browser.storage.local.get().then((res) => {
        document.getElementById("notes").value = res.general_notes || "";
    });
    e.preventDefault();
}
document.getElementById("notes").addEventListener("input", saveNotes);
document.addEventListener("DOMContentLoaded", loadNotes);

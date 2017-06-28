function saveNotes() {
    browser.storage.local.set({
        general_notes: document.getElementById("notes").value
    });
}
function loadNotes(e) {
    // Needed to autofocus textbox
    // https://stackoverflow.com/a/11400653
    if (location.search !== "?focusHack") {
        location.search = "?focusHack";
    }
    browser.storage.local.get().then((res) => {
        document.getElementById("notes").value = res.general_notes || "";
    });
    e.preventDefault();
}
document.getElementById("notes").addEventListener("input", saveNotes);
document.addEventListener("DOMContentLoaded", loadNotes);

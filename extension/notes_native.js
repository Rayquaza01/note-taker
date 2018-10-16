/* globals generateElementsVariable */
const DOM = generateElementsVariable(["request", "port", "import", "export", "res"]);

function print(text) {
    console.log(text);
    DOM.res.innerText = text;
}

async function exportNotes() {
    let res = await browser.storage.local.get(["general_notes", "site_notes"]);
    res["path"] = "C:\\Users\\joeja\\notes";
    res["push"] = true;
    browser.runtime.sendNativeMessage("notetaker.r01", res).then(print);
}

async function importNotes() {
    let res = {
        path: "C:\\Users\\joeja\\notes",
        pull: true
    };
    browser.runtime.sendNativeMessage("notetaker.r01", res).then(print);
}

DOM.export.addEventListener("click", exportNotes);
DOM.import.addEventListener("click", importNotes);

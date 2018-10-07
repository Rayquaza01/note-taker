const DOM = generateElementsVariable([
    "request",
    "port",
    "import",
    "export"
]);

function requestPermissions() {
    browser.permissions.request({
        origins: ["http://localhost/*"]
    });
}

async function exportNotes() {
    let res = await browser.storage.local.get(["general_notes", "site_notes"])
    fetch("http://localhost:" + DOM.port.value + "/push", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;"
        },
        body: JSON.stringify(res)
    });
}

async function importNotes() {
    fetch("http://localhost:" + DOM.port.value + "/pull");
}

DOM.request.addEventListener("click", requestPermissions);
DOM.export.addEventListener("click", exportNotes);
DOM.import.addEventListener("click", importNotes);

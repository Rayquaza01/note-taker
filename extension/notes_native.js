const DOM = generateElementsVariable([
    "request",
    "port",
    "import",
    "export",
    "res"
]);

function requestPermissions() {
    browser.permissions.request({
        origins: ["http://localhost/*"]
    });
}

async function exportNotes() {
    let res = await browser.storage.local.get(["general_notes", "site_notes"])
    let response = await fetch("http://localhost:" + DOM.port.value + "/push", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;"
        },
        body: JSON.stringify(res)
    });
    DOM.res.innerText = await response.text();
}

async function importNotes() {
    let response = await fetch("http://localhost:" + DOM.port.value + "/pull");
    await browser.storage.local.remove(["general_notes", "site_notes"]);
    let json = await response.json();
    browser.storage.local.set(json);
    DOM.res.innerText = JSON.stringify(json);
}

DOM.request.addEventListener("click", requestPermissions);
DOM.export.addEventListener("click", exportNotes);
DOM.import.addEventListener("click", importNotes);

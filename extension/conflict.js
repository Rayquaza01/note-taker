async function replace(e) {
    let local = await browser.storage.local.get(["general_notes", "site_notes"]);
    let sync = await browser.storage.sync.get(["general_notes", "site_notes"]);
    let res = await browser.storage.local.get("backup");
    switch (e.target.dataset.mode) {
        case "local":
            await browser.storage.local.remove("backup");
            await browser.storage.sync.remove(["general_notes", "site_notes"]);
            await browser.storage.sync.set(local);
            await browser.storage.local.set({ backup: local });
            break;
        case "sync":
            await browser.storage.local.remove("backup");
            await browser.storage.local.remove(["general_notes", "site_notes"]);
            await browser.storage.local.set(sync);
            await browser.storage.local.set({ backup: sync });
            break;
        case "backup":
            await browser.storage.local.remove(["general_notes", "site_notes"]);
            await browser.storage.sync.remove(["general_notes", "site_notes"]);
            await browser.storage.local.set(res.backup);
            await browser.storage.sync.set(res.backup);
            break;
    }
    location.reload();
}

async function main() {
    let local = await browser.storage.local.get(["general_notes", "site_notes"]);
    let sync = await browser.storage.sync.get(["general_notes", "site_notes"]);
    let res = await browser.storage.local.get("backup");
    let storage = document.getElementsByClassName("storage");
    storage[0].innerText = JSON.stringify(local, null, "    ");
    storage[1].innerText = JSON.stringify(sync, null, "    ");
    storage[2].innerText = JSON.stringify(res.backup, null, "    ");
}

Array.from(document.getElementsByTagName("button")).forEach(ele =>
    ele.addEventListener("click", replace)
);
document.addEventListener("DOMContentLoaded", main);

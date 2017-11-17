const textarea = document.getElementsByTagName("textarea")[0];
const back = document.getElementsByClassName("mdi-keyboard-backspace")[0];
const toggle = document.getElementById("toggle");
const theme = document.getElementById("theme");
const overlay = document.getElementById("overlay");
const overlayClose = document.getElementsByClassName("mdi-close")[0];
const settings = document.getElementsByClassName("mdi-settings")[0];
const noteList =  document.getElementById("note-list");
const confirmDelete = document.getElementById("confirmDelete");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const siteName = document.getElementById("siteName");
const openInTab = document.getElementsByClassName("mdi-open-in-new")[0];
const search = document.getElementById("search");

function getContext() {
    return browser.extension.getViews({type: "popup"}).indexOf(window) > -1 ? "popup" :
        browser.extension.getViews({type: "sidebar"}).indexOf(window) > -1 ? "sidebar" :
        browser.extension.getViews({type: "tab"}).indexOf(window) > -1 ? "tab" : undefined;
}

function searchResults() {
    var names = document.getElementsByClassName("name");
    for (var name of names) {
        name.parentNode.style.display = name.innerText.toUpperCase().indexOf(search.value.toUpperCase()) > -1 ? "block" : "none";
    }
}

function openList() {
    search.focus()
    overlay.style.width = "100%";
    back.style.display = "none";
    overlayClose.style.display = "block";
}

function closeList() {
    overlay.style.width = "0";
    back.style.display = "block";
    overlayClose.style.display = "none";
    textarea.focus();
}

function saveGeneralNotes() {
    browser.storage.local.set({
        general_notes: textarea.value || ""
    });
}

async function saveSiteNotes() {
    var res = await browser.storage.local.get("site_notes");
    res.site_notes[back.innerText] = textarea.value || "";
    browser.storage.local.set({site_notes: res.site_notes});
}

async function loadGeneralNotes() {
    textarea.focus();
    toggle.value = "general_notes";
    // toggle.className = "mdi mdi-web";
    // toggle.title = "Switch to site notes"
    textarea.removeEventListener("input", saveSiteNotes);
    var res = await browser.storage.local.get("general_notes");
    textarea.value = res.general_notes[0] || "";
    back.innerText = "General Notes";
    textarea.addEventListener("input", saveGeneralNotes);
}

async function siteNoteSetup(site, mode = "") {
    textarea.focus();
    textarea.removeEventListener("input", saveGeneralNotes);
    var res = await browser.storage.local.get("site_notes");
    textarea.value = res.site_notes.hasOwnProperty(site) ? res.site_notes[site][0] : "";
    back.innerText = site;
    textarea.addEventListener("input", saveSiteNotes);
}

function removeNoteFromList(name) {
    var deleteButton = noteList.querySelector("span[data-delete-site='" + name + "']");
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
}

async function deleteNote() {
    var res = await browser.storage.local.get("site_notes");
    delete res.site_notes[siteName.innerText];
    browser.storage.local.set({site_notes: res.site_notes});
    removeNoteFromList(siteName.innerText);
    confirmDelete.style.width = "0";
}

async function loadCustomNote() {
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (this.innerText !== back.innerText && this.className !== "mdi mdi-delete") {
        back.dataset[tabs[0].id] = this.innerText;
    } else {
        delete back.dataset[tabs[0].id]
        loadSiteNotes();
    }
    if (this.innerText === "General Notes") {
        loadGeneralNotes();
    } else if (this.className === "mdi mdi-delete") {
        confirmDelete.style.width = "100%";
        siteName.innerText = this.dataset.deleteSite;
        return;
    } else if (this.className === "name") {
        siteNoteSetup(this.innerText);
    } else {
        return;
    }
    closeList();
}

function closeConfirm() {
    confirmDelete.style.width = "0";
}

async function loadSiteNotes(manualClick = false, mode = "") {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (!tabs[0].incognito || manualClick || (res.options.private_browsing && tabs[0].incognito)) {
        var url = tabs[0].url;
        var site = await siteParser(url, mode);
        if (site === "general_notes") {
            loadGeneralNotes();
        } else {
            siteNoteSetup(site, mode);
        }
    } else {
        loadGeneralNotes();
    }
}

function changeNoteMode() {
    switch (this.value) {
        case "url":
            loadSiteNotes(true, "url");
            break;
        case "domain":
            loadSiteNotes(true, "domain");
            break;
        case "general_notes":
            loadGeneralNotes();
            break;
    }
    // switch (this.className) {
    //     case "mdi mdi-web":
    //         loadSiteNotes(true, "url");
    //         break;
    //     case "mdi mdi-domain":
    //         loadSiteNotes(true);
    //         break;
    //     case "mdi mdi-note":
    //         loadGeneralNotes();
    //         break;
    // }
}

async function setTheme(mode) {
    var res = await browser.storage.local.get("options");
    switch (mode) {
        case "light":
            var theme = "";
            break;
        case "dark":
            var theme = "_dark";
            break;
    }
    document.body.style.backgroundColor = "#" + res.options["background_color" + theme];
    document.body.style.color = "#" + res.options["font_color" + theme];
    search.style.color = "#" + res.options["font_color" + theme];
    search.style.backgroundColor = "#" + res.options["background_color" + theme];
}

async function changeTheme() {
    var res = await browser.storage.local.get("options");
    switch (this.title) {
        case "Switch to light theme":
            this.title = "Switch to dark theme";
            res.options.theme = "light";
            browser.storage.local.set({options: res.options});
            setTheme("light");
            break;
        case "Switch to dark theme":
            this.title = "Switch to light theme";
            res.options.theme = "dark";
            browser.storage.local.set({options: res.options});
            setTheme("dark");
            break;
    }
}

function addNoteToList(site) {
    var cont = document.createElement("div");
    cont.className = "container";
    var name = document.createElement("span");
    name.innerText = site;
    name.className = "name";
    var del = document.createElement("span");
    del.dataset.deleteSite = site;
    del.className = "mdi mdi-delete";
    cont.append(name);
    cont.append(del);
    noteList.append(cont);
}

async function loadNoteList() {
    var res = await browser.storage.local.get("site_notes");
    for (var site in res.site_notes) {
        if (res.site_notes.hasOwnProperty(site)) {
            addNoteToList(site);
        }
    }
}

function resizePage() {
    textarea.style.height = window.innerHeight - 25 + "px";
    textarea.style.width = window.innerWidth - 2 + "px";
    overlay.style.height = window.innerHeight - 25 + "px";
}

async function pageSetup() {
    var res = await browser.storage.local.get("options");
    switch (res.options.theme) {
        case "light":
            theme.title = "Switch to dark theme";
            break;
        case "dark":
            theme.title = "Switch to light theme";
            break;
    }
    setTheme(res.options.theme);
    if (res.options.font_family === "custom") {
        textarea.style.fontFamily = res.options.font_css;
    } else if (res.options.font_family !== "default") {
        textarea.style.fontFamily = res.options.font_family;
    }
    textarea.style.fontSize = res.options.font_size + "px";
    var context = getContext();
    switch (context) {
        case "tab":
            openInTab.style.display = "none";
            toggle.style.display = "none";
            break;
        case "sidebar":
            browser.tabs.onActivated.addListener(perTabSidebar);
            browser.tabs.onUpdated.addListener(perTabSidebar);
            break;
        case "popup":
            document.body.style.width = res.options.width + "px";
            textarea.style.width = res.options.width + "px";
            textarea.style.height = res.options.height + "px";
            overlay.style.height = res.options.height + "px";
            break;
    }
    if (context !== "popup") {
        window.addEventListener("resize", resizePage);
        resizePage();
    }
    if (res.options.default_display === "general_notes") {
        loadGeneralNotes();
    } else if (res.options.default_display === "url" || res.options.default_display === "domain") {
        loadSiteNotes(false, res.options.default_display);
    }
    toggle.value = res.options.default_display;
    loadNoteList();
}

function options() {
    browser.runtime.openOptionsPage();
}

function openTab() {
    browser.tabs.create({
        active: true,
        url: "notes.html"
    });
}

async function perTabSidebar() {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (!back.dataset.hasOwnProperty(tabs[0].id)) {
        switch (res.options.default_display) {
            case "site_notes":
                loadSiteNotes();
                break;
            case "general_notes":
                loadGeneralNotes();
                break;
        }
    } else {
        siteNoteSetup(back.dataset[tabs[0].id]);
    }
}

function listUpdate(changes) {
    if (changes.hasOwnProperty("site_notes")) {
        var oldValues = Object.keys(changes.site_notes.oldValue);
        var newValues = Object.keys(changes.site_notes.newValue);
        for (var item of oldValues) {
            if (newValues.indexOf(item) === -1) {
                removeNoteFromList(item);
            }
        };
        for (var item of newValues) {
            if (oldValues.indexOf(item) === -1) {
                addNoteToList(item);
            }
        }
    }
}

document.addEventListener("focus", () => {
    textarea.focus();
});

settings.addEventListener("click", options);
// toggle.addEventListener("click", changeNoteMode);
toggle.addEventListener("change", changeNoteMode);
theme.addEventListener("click", changeTheme);
back.addEventListener("click", openList);
overlayClose.addEventListener("click", closeList);
noteList.addEventListener("click", loadCustomNote);
no.addEventListener("click", closeConfirm);
yes.addEventListener("click", deleteNote);
openInTab.addEventListener("click", openTab);
search.addEventListener("input", searchResults);
document.addEventListener("DOMContentLoaded", pageSetup);
browser.storage.onChanged.addListener(listUpdate);

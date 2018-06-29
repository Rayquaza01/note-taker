const textarea = document.getElementsByTagName("textarea")[0];
const back = document.getElementById("back");
const toggle = document.getElementById("toggle");
const theme = document.getElementById("theme");
const overlay = document.getElementById("overlay");
const overlayClose = document.getElementById("close");
const settings = document.getElementsByClassName("mdi-settings")[0];
const noteList =  document.getElementById("note-list");
const confirmDelete = document.getElementById("confirmDelete");
const yes = document.getElementById("yes");
const no = document.getElementById("no");
const siteName = document.getElementById("siteName");
const openInTab = document.getElementsByClassName("mdi-open-in-new")[0];
const search = document.getElementById("search");
const tabstrip = document.getElementById("tabstrip");
const buttons = document.getElementById("buttons");

function getContext() {
    return browser.extension.getViews({type: "popup"}).indexOf(window) > -1 ? "popup" :
        browser.extension.getViews({type: "sidebar"}).indexOf(window) > -1 ? "sidebar" :
            browser.extension.getViews({type: "tab"}).indexOf(window) > -1 ? "tab" : undefined;
}

function searchResults() {
    var names = document.getElementsByClassName("name");
    for (var name of names) {
        name.parentNode.style.display = name.innerText.toUpperCase().indexOf(search.value.toUpperCase()) > -1 ? "flex" : "none";
    }
}

function openList() {
    search.focus();
    overlay.style.width = "100%";
    back.style.display = "none";
    buttons.style.zIndex = "1";
    overlayClose.style.display = "block";
}

function closeList() {
    overlay.style.width = "0";
    back.style.display = "block";
    overlayClose.style.display = "none";
    buttons.style.zIndex = "0";
    textarea.focus();
}

async function saveGeneralNotes() {
    var gen = await browser.storage.local.get("general_notes");
    gen.general_notes[tabstrip.dataset.activeTab] = textarea.value || "";
    browser.storage.local.set(gen);
}

async function saveSiteNotes() {
    var res = await browser.storage.local.get("site_notes");
    if (!res.site_notes.hasOwnProperty(back.innerText)) {
        res.site_notes[back.innerText] = []
    }
    res.site_notes[back.innerText][tabstrip.dataset.activeTab] = textarea.value || "";
    browser.storage.local.set({site_notes: res.site_notes});
}

async function loadGeneralNotes() {
    textarea.focus();
    toggle.value = "general_notes";
    // toggle.className = "mdi mdi-web";
    // toggle.title = "Switch to site notes"
    textarea.removeEventListener("input", saveSiteNotes);
    var res = await browser.storage.local.get("general_notes");
    textarea.value = res.general_notes[tabstrip.dataset.activeTab] || "";
    back.innerText = "General Notes";
    back.title = "General Notes";
    textarea.addEventListener("input", saveGeneralNotes);
}

async function siteNoteSetup(site) {
    textarea.focus();
    textarea.removeEventListener("input", saveGeneralNotes);
    var res = await browser.storage.local.get("site_notes");
    if (res.site_notes.hasOwnProperty(site)) {
        if (res.site_notes[site][tabstrip.dataset.activeTab] !== undefined) {
            var text = res.site_notes[site][tabstrip.dataset.activeTab];
        } else {
            var text = "";
        }
    } else {
        var text = "";
    }
    textarea.value = text;
    back.innerText = site;
    back.title = site;
    textarea.addEventListener("input", saveSiteNotes);
}

function removeNoteFromList(name) {
    var deleteButton = noteList.querySelector(`span[data-delete-site=${name}]`);
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
}

async function deleteNote() {
    var res = await browser.storage.local.get("site_notes");
    delete res.site_notes[siteName.innerText];
    browser.storage.local.set({site_notes: res.site_notes});
    removeNoteFromList(siteName.innerText);
    confirmDelete.style.width = "0";
}

async function loadCustomNote(e) {
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    console.log(e.target.innerText)
    if (e.target.innerText !== back.innerText && e.target.className !== "mdi mdi-delete") {
        back.dataset[tabs[0].id] = e.target.innerText;
    } else {
        delete back.dataset[tabs[0].id];
        loadSiteNotes();
    }
    if (e.target.innerText === "General Notes") {
        loadGeneralNotes();
    } else if (e.target.className === "mdi mdi-delete") {
        confirmDelete.style.width = "100%";
        siteName.innerText = e.target.dataset.deleteSite;
        return;
    } else if (e.target.className === "name") {
        siteNoteSetup(e.target.innerText);
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
        var site = await siteParser(url, mode || res.options.default_display);
        if (site === "general_notes") {
            loadGeneralNotes();
        } else {
            siteNoteSetup(site);
            toggle.value = mode || res.options.default_display;
        }
    } else {
        loadGeneralNotes();
    }
}

async function changeNoteMode() {
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    switch (this.value) {
    case "url":
    case "domain":
        // back.dataset[tabs[0].id] = await siteParser(tabs[0].url, this.value);
        loadSiteNotes(true, this.value);
        break;
    case "general_notes":
        // back.dataset[tabs[0].id] = "General Notes";
        loadGeneralNotes();
        break;
    }
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
    bg_color = "#" + res.options["background_color" + theme];
    font_color = "#" + res.options["font_color" + theme];
    toggle.style.backgroundColor = bg_color;
    document.body.style.backgroundColor = bg_color;
    search.style.backgroundColor = bg_color;
    overlay.style.backgroundColor = bg_color;
    confirmDelete.style.backgroundColor = bg_color;
    document.body.style.color = font_color;
    search.style.color = font_color;
    toggle.style.color = font_color;
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
    name.title = site;
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
    textarea.style.padding = res.options.padding + "px";
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
        document.body.style.height = res.options.height + 40 + "px";
        textarea.style.width = res.options.width + "px";
        textarea.style.height = res.options.height + "px";
        overlay.style.height = res.options.height + "px";
        break;
    }
    if (res.options.default_display === "general_notes") {
        loadGeneralNotes();
    } else if (res.options.default_display === "url" || res.options.default_display === "domain") {
        loadSiteNotes(false, res.options.default_display);
    }
    if (res.options.tabnos < 2) {
        tabstrip.style.display = "none";
    } else if (res.options.tabnos > 1) {
        for (var tab = 1; tab < res.options.tabnos; tab++) {
            var newTab = document.createElement("span");
            newTab.className = "tab";
            newTab.innerText = "Tab " + parseInt(tab + 1);
            tabstrip.append(newTab);
        }
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
        case "domain":
        case "url":
            loadSiteNotes(false, res.options.default_display);
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
        for (let item of oldValues) {
            if (newValues.indexOf(item) === -1) {
                removeNoteFromList(item);
            }
        }
        for (let item of newValues) {
            if (oldValues.indexOf(item) === -1) {
                addNoteToList(item);
            }
        }
    }
}

document.addEventListener("focus", () => {
    textarea.focus();
});

async function tabSwitch(e) {
    Array.from(tabstrip.children)[tabstrip.dataset.activeTab].className = "tab"
    e.target.className = "tab active";
    tabstrip.dataset.activeTab = Array.from(tabstrip.children).indexOf(e.target);
    var res = await browser.storage.local.get("options");
    loadSiteNotes(true, res.options.default_display);
}

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
tabstrip.addEventListener("click", tabSwitch);
browser.storage.onChanged.addListener(listUpdate);
document.addEventListener("DOMContentLoaded", pageSetup);

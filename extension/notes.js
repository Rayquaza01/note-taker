const DOM = generateElementsVariable([
    "textarea",
    "back",
    "toggle",
    "theme",
    "overlay",
    "close",
    "settings",
    "note_list",
    "confirmDelete",
    "yes",
    "no",
    "siteName",
    "open_in_new",
    "search",
    "tabstrip",
    "buttons"
]);

function getContext() {
    return browser.extension.getViews({type: "popup"}).indexOf(window) > -1 ? "popup" :
        browser.extension.getViews({type: "sidebar"}).indexOf(window) > -1 ? "sidebar" :
            browser.extension.getViews({type: "tab"}).indexOf(window) > -1 ? "tab" : undefined;
}

function searchResults() {
    var names = document.getElementsByClassName("name");
    for (var name of names) {
        name.parentNode.style.display = name.innerText.toUpperCase().indexOf(DOM.search.value.toUpperCase()) > -1 ? "flex" : "none";
    }
}

function openList() {
    DOM.search.focus();
    DOM.overlay.style.width = "100%";
    DOM.back.style.display = "none";
    DOM.buttons.style.zIndex = "1";
    DOM.close.style.display = "block";
}

function closeList() {
    DOM.overlay.style.width = "0";
    DOM.back.style.display = "block";
    DOM.close.style.display = "none";
    DOM.buttons.style.zIndex = "0";
    DOM.textarea.focus();
}

async function saveGeneralNotes() {
    var gen = await browser.storage.local.get("general_notes");
    gen.general_notes[DOM.tabstrip.dataset.activeTab] = DOM.textarea.value || "";
    browser.storage.local.set(gen);
}

async function saveSiteNotes() {
    var res = await browser.storage.local.get("site_notes");
    if (!res.site_notes.hasOwnProperty(DOM.back.innerText)) {
        res.site_notes[DOM.back.innerText] = []
    }
    res.site_notes[DOM.back.innerText][DOM.tabstrip.dataset.activeTab] = DOM.textarea.value || "";
    browser.storage.local.set({site_notes: res.site_notes});
}

async function loadGeneralNotes() {
    DOM.textarea.focus();
    DOM.toggle.value = "general_notes";
    // DOM.toggle.className = "mdi mdi-web";
    // DOM.toggle.title = "Switch to site notes"
    DOM.textarea.removeEventListener("input", saveSiteNotes);
    var res = await browser.storage.local.get("general_notes");
    DOM.textarea.value = res.general_notes[DOM.tabstrip.dataset.activeTab] || "";
    DOM.back.innerText = "General Notes";
    DOM.back.title = "General Notes";
    DOM.textarea.addEventListener("input", saveGeneralNotes);
}

async function siteNoteSetup(site) {
    DOM.textarea.focus();
    DOM.textarea.removeEventListener("input", saveGeneralNotes);
    var res = await browser.storage.local.get("site_notes");
    if (res.site_notes.hasOwnProperty(site)) {
        if (res.site_notes[site][DOM.tabstrip.dataset.activeTab] !== undefined) {
            var text = res.site_notes[site][DOM.tabstrip.dataset.activeTab];
        } else {
            var text = "";
        }
    } else {
        var text = "";
    }
    DOM.textarea.value = text;
    DOM.back.innerText = site;
    DOM.back.title = site;
    DOM.textarea.addEventListener("input", saveSiteNotes);
}

function removeNoteFromList(name) {
    var deleteButton = document.querySelector(`span[data-delete-site="${name}"]`);
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
}

async function deleteNote() {
    var res = await browser.storage.local.get("site_notes");
    delete res.site_notes[DOM.siteName.innerText];
    browser.storage.local.set({site_notes: res.site_notes});
    removeNoteFromList(DOM.siteName.innerText);
    DOM.confirmDelete.style.width = "0";
}

async function loadCustomNote(e) {
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (e.target.className === "name") {
        if (e.target.innerText !== DOM.back.innerText) {
            DOM.back.dataset[tabs[0].id] = e.target.innerText;
        } else if (e.target.innerText === DOM.back.innerText) {
            delete DOM.back.dataset[tabs[0].id];
            loadSiteNotes();
        }
    }
    if (e.target.innerText === "General Notes") {
        loadGeneralNotes();
        closeList();
        return;
    }
    switch (e.target.className) {
    case "mdi mdi-delete":
        DOM.confirmDelete.style.width = "100%";
        DOM.siteName.innerText = e.target.dataset.deleteSite;
        return;
    case "mdi mdi-open-in-new":
        browser.tabs.create({
            active: true,
            url: "https://" + e.target.dataset.open
        });
        break;
    case "name":
        siteNoteSetup(DOM.back.dataset[tabs[0].id]);
        break;
    default:
        return;
    }
    closeList();
}

function closeConfirm() {
    DOM.confirmDelete.style.width = "0";
}

async function loadSiteNotes(manualClick = false, mode = "") {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (!tabs[0].incognito || manualClick || (res.options.private_browsing && tabs[0].incognito)) {
        var url = tabs[0].url;
        var site = await siteParser(url, mode || DOM.toggle.value);
        if (site === "general_notes") {
            loadGeneralNotes();
        } else {
            siteNoteSetup(site);
            DOM.toggle.value = mode || DOM.toggle.value;
        }
    } else {
        loadGeneralNotes();
    }
}

async function changeNoteMode() {
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    switch (DOM.toggle.value) {
    case "url":
    case "domain":
        // DOM.back.dataset[tabs[0].id] = await siteParser(tabs[0].url, DOM.toggle.value);
        loadSiteNotes(true, DOM.toggle.value);
        break;
    case "general_notes":
        // DOM.back.dataset[tabs[0].id] = "General Notes";
        loadGeneralNotes();
        break;
    }
}

async function setTheme(mode) {
    var res = await browser.storage.local.get("options");
    switch (mode) {
        case "light": {
            var theme = "";
            break;
        }
        case "dark": {
            var theme = "_dark";
            break;
        }
    }
    bg_color = "#" + res.options["background_color" + theme];
    font_color = "#" + res.options["font_color" + theme];
    DOM.toggle.style.backgroundColor = bg_color;
    document.body.style.backgroundColor = bg_color;
    DOM.search.style.backgroundColor = bg_color;
    DOM.overlay.style.backgroundColor = bg_color;
    DOM.confirmDelete.style.backgroundColor = bg_color;
    document.body.style.color = font_color;
    DOM.search.style.color = font_color;
    DOM.toggle.style.color = font_color;
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
    cont.append(name);
    if (site.indexOf("about:") === -1) {
        var open = document.createElement("span");
        open.dataset.open = site;
        open.className = "mdi mdi-open-in-new";
        cont.append(open);
    }
    var del = document.createElement("span");
    del.dataset.deleteSite = site;
    del.className = "mdi mdi-delete";
    cont.append(del);
    DOM.note_list.append(cont);
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
        DOM.theme.title = "Switch to dark theme";
        break;
    case "dark":
        DOM.theme.title = "Switch to light theme";
        break;
    }
    setTheme(res.options.theme);
    if (res.options.font_family === "custom") {
        DOM.textarea.style.fontFamily = res.options.font_css;
    } else if (res.options.font_family !== "default") {
        DOM.textarea.style.fontFamily = res.options.font_family;
    }
    DOM.textarea.style.fontSize = res.options.font_size + "px";
    DOM.textarea.style.padding = res.options.padding + "px";
    DOM.textarea.style.direction = res.options.text_direction;
    var context = getContext();
    switch (context) {
    case "tab":
        DOM.open_in_new.style.display = "none";
        DOM.toggle.style.display = "none";
        break;
    case "sidebar":
        browser.tabs.onActivated.addListener(perTabSidebar);
        browser.tabs.onUpdated.addListener(perTabSidebar);
        break;
    case "popup":
        document.body.style.width = res.options.width + "px";
        document.body.style.height = res.options.height + 40 + "px";
        DOM.textarea.style.width = res.options.width + "px";
        DOM.textarea.style.height = res.options.height + "px";
        DOM.overlay.style.height = res.options.height + "px";
        break;
    }
    if (res.options.default_display === "general_notes") {
        loadGeneralNotes();
    } else if (/url|domain/.test(res.options.default_display)) {
        loadSiteNotes(false, res.options.default_display);
    }
    if (res.options.tabnos < 2) {
        DOM.tabstrip.style.display = "none";
    } else if (res.options.tabnos > 1) {
        for (var tab = 1; tab < res.options.tabnos; tab++) {
            var newTab = document.createElement("span");
            newTab.className = "tab";
            newTab.innerText = "Tab " + parseInt(tab + 1);
            DOM.tabstrip.append(newTab);
        }
    }
    DOM.toggle.value = res.options.default_display;
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
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (!DOM.back.dataset.hasOwnProperty(tabs[0].id)) {
        switch (DOM.toggle.value) {
        case "domain":
        case "url":
            loadSiteNotes(false, DOM.toggle.value);
            break;
        case "general_notes":
            loadGeneralNotes();
            break;
        }
    } else {
        siteNoteSetup(DOM.back.dataset[tabs[0].id]);
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
    DOM.textarea.focus();
});

async function tabSwitch(e) {
    Array.from(DOM.tabstrip.children)[DOM.tabstrip.dataset.activeTab].className = "tab"
    e.target.className = "tab active";
    DOM.tabstrip.dataset.activeTab = Array.from(DOM.tabstrip.children).indexOf(e.target);
    switch (DOM.toggle.value) {
    case "domain":
    case "url":
        loadSiteNotes(true, DOM.toggle.value);
        break;
    case "general_notes":
        loadGeneralNotes();
        break;
    }
}

DOM.settings.addEventListener("click", options);
// DOM.toggle.addEventListener("click", changeNoteMode);
DOM.toggle.addEventListener("change", changeNoteMode);
DOM.theme.addEventListener("click", changeTheme);
DOM.back.addEventListener("click", openList);
DOM.close.addEventListener("click", closeList);
DOM.note_list.addEventListener("click", loadCustomNote);
DOM.no.addEventListener("click", closeConfirm);
DOM.yes.addEventListener("click", deleteNote);
DOM.open_in_new.addEventListener("click", openTab);
DOM.search.addEventListener("input", searchResults);
DOM.tabstrip.addEventListener("click", tabSwitch);
browser.storage.onChanged.addListener(listUpdate);
document.addEventListener("DOMContentLoaded", pageSetup);

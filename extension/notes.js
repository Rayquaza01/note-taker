/* eslint-env webextensions */
/* globals generateElementsVariable siteParser */
const DOM = generateElementsVariable([
    "textarea",
    "back",
    "back_text",
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
    "buttons",
    "ok",
    "cancel",
    "confirm",
    "newNoteName",
    "newNote"
]);

async function loadSVG(url) {
    let svg = await fetch(url);
    return new DOMParser().parseFromString(await svg.text(), "image/svg+xml")
        .documentElement;
}

function getContext() {
    for (let context of ["popup", "sidebar", "tab"]) {
        if (browser.extension.getViews({ type: context }).indexOf(window) > -1) {
            return context;
        }
    }
    return undefined;
}

function searchResults() {
    var names = document.getElementsByClassName("name");
    for (var name of names) {
        name.parentNode.style.display =
            name.innerText.toUpperCase().indexOf(DOM.search.value.toUpperCase()) > -1
                ? "flex"
                : "none";
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
    if (!res.site_notes.hasOwnProperty(DOM.back.dataset.currentSite)) {
        res.site_notes[DOM.back.dataset.currentSite] = [];
    }
    res.site_notes[DOM.back.dataset.currentSite][DOM.tabstrip.dataset.activeTab] =
        DOM.textarea.value || "";
    browser.storage.local.set({ site_notes: res.site_notes });
}

function bold(tab_ele, tab) {
    if (tab !== "" && tab !== null) {
        tab_ele.style.fontWeight = "bold";
    } else {
        tab_ele.style.fontWeight = "normal";
    }
}

async function emboldenNotes(note) {
    let res = await browser.storage.local.get();
    let tabstrip = Array.from(DOM.tabstrip.children);
    let parent;
    if (note === "general_notes") {
        parent = res;
    } else {
        parent = res.site_notes;
    }
    if (parent.hasOwnProperty(note)) {
        for (let index = 0; index < tabstrip.length; index++) {
            if (parent[note].hasOwnProperty(index)) {
                bold(tabstrip[index], parent[note][index]);
            } else {
                bold(tabstrip[index], null);
            }
        }
    } else {
        for (let tab of tabstrip) {
            tab.style.fontWeight = "normal";
        }
    }
}

async function loadGeneralNotes() {
    DOM.textarea.focus();
    DOM.toggle.value = "general_notes";
    // DOM.toggle.className = "mdi mdi-web";
    // DOM.toggle.title = "Switch to site notes"
    DOM.textarea.removeEventListener("input", saveSiteNotes);
    var res = await browser.storage.local.get("general_notes");
    DOM.textarea.value = res.general_notes[DOM.tabstrip.dataset.activeTab] || "";
    DOM.back_text.innerText = "General Notes";
    DOM.back.title = "General Notes";
    DOM.back.dataset.currentSite = "general_notes";
    emboldenNotes("general_notes");
    DOM.textarea.addEventListener("input", saveGeneralNotes);
}

async function siteNoteSetup(site) {
    DOM.textarea.focus();
    DOM.textarea.removeEventListener("input", saveGeneralNotes);
    if (site === "general_notes" || site === "General Notes") {
        loadGeneralNotes();
        return;
    }
    var res = await browser.storage.local.get("site_notes");
    let text;
    if (res.site_notes.hasOwnProperty(site)) {
        if (res.site_notes[site][DOM.tabstrip.dataset.activeTab] !== undefined) {
            text = res.site_notes[site][DOM.tabstrip.dataset.activeTab];
        } else {
            text = "";
        }
    } else {
        text = "";
    }
    DOM.textarea.value = text;
    DOM.back_text.innerText = site;
    DOM.back.title = site;
    DOM.back.dataset.currentSite = site;
    emboldenNotes(site);
    DOM.textarea.addEventListener("input", saveSiteNotes);
}

function removeNoteFromList(name) {
    var deleteButton = document.querySelector(`span[data-delete-site="${name}"]`);
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
}

async function deleteNote() {
    var res = await browser.storage.local.get("site_notes");
    delete res.site_notes[DOM.siteName.innerText];
    browser.storage.local.set({ site_notes: res.site_notes });
    removeNoteFromList(DOM.siteName.innerText);
    DOM.confirmDelete.style.width = "0";
}

async function loadCustomNote(e) {
    var tabs = await browser.tabs.query({ active: true, currentWindow: true });
    // return parent element if svg
    let target = e.target.tagName === "svg" ? e.target.parentNode : e.target;
    if (target.className === "name") {
        if (target.innerText !== DOM.back_text.innerText) {
            DOM.back.dataset[tabs[0].id] = target.innerText;
        } else if (target.innerText === DOM.back_text.innerText) {
            delete DOM.back.dataset[tabs[0].id];
            loadSiteNotes();
        }
    }
    if (target.innerText === "General Notes") {
        loadGeneralNotes();
        closeList();
        return;
    }
    let tab;
    switch (target.className) {
        case "mdi mdi-delete":
            DOM.confirmDelete.style.width = "100%";
            DOM.siteName.innerText = target.dataset.deleteSite;
            return;
        case "mdi mdi-open-in-new":
            tab = await browser.tabs.create({
                active: true,
                url: "https://" + target.dataset.open
            });
            // open to note in sidebar
            DOM.back.dataset[tab.id] = target.dataset.open;
            // open to note in popup
            siteNoteSetup(target.dataset.open);
            closeList();
            break;
        case "name":
            siteNoteSetup(DOM.back.dataset[tabs[0].id]);
            closeList();
            break;
        case "mdi mdi-plus":
            openNewNote();
            break;
        default:
            return;
    }
}

function closeConfirm() {
    DOM.confirmDelete.style.width = "0";
}

async function loadSiteNotes(manualClick = false, mode = "") {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({ active: true, currentWindow: true });
    if (
        !tabs[0].incognito ||
        manualClick ||
        (res.options.private_browsing && tabs[0].incognito)
    ) {
        var url = tabs[0].url;
        var site = await siteParser(url, res, mode || DOM.toggle.value);
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
    let theme;
    switch (mode) {
        case "light":
            theme = "";
            break;
        case "dark":
            theme = "_dark";
            break;
    }
    let bg_color = "#" + res.options["background_color" + theme];
    let font_color = "#" + res.options["font_color" + theme];
    DOM.toggle.style.backgroundColor = bg_color;
    document.body.style.backgroundColor = bg_color;
    DOM.search.style.backgroundColor = bg_color;
    DOM.overlay.style.backgroundColor = bg_color;
    DOM.confirmDelete.style.backgroundColor = bg_color;
    DOM.newNote.style.backgroundColor = bg_color;
    DOM.newNoteName.style.backgroundColor = bg_color;
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
            browser.storage.local.set({ options: res.options });
            setTheme("light");
            break;
        case "Switch to dark theme":
            this.title = "Switch to light theme";
            res.options.theme = "dark";
            browser.storage.local.set({ options: res.options });
            setTheme("dark");
            break;
    }
}

async function addNoteToList(site) {
    var cont = document.createElement("div");
    cont.className = "container";
    var name = document.createElement("span");
    name.innerText = site;
    name.title = site;
    name.className = "name";
    cont.appendChild(name);
    if (site.indexOf("about:") === -1) {
        var open = document.createElement("span");
        open.dataset.open = site;
        open.className = "mdi mdi-open-in-new";
        open.appendChild(
            await loadSVG(browser.extension.getURL("icons/mdi/mdi-open-in-new.svg"))
        );
        cont.appendChild(open);
    }
    var del = document.createElement("span");
    del.dataset.deleteSite = site;
    del.className = "mdi mdi-delete";
    del.appendChild(await loadSVG(browser.extension.getURL("icons/mdi/mdi-delete.svg")));
    cont.appendChild(del);
    DOM.note_list.appendChild(cont);
}

async function loadNoteList() {
    var res = await browser.storage.local.get("site_notes");
    for (var site in res.site_notes) {
        if (res.site_notes.hasOwnProperty(site)) {
            addNoteToList(site);
        }
    }
}

async function main() {
    var res = await browser.storage.local.get("options");
    for (let icon of document.getElementsByClassName("mdi")) {
        icon.appendChild(
            await loadSVG(
                browser.extension.getURL("icons/mdi/" + icon.dataset.icon + ".svg")
            )
        );
    }
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
            window.focus;
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
            DOM.tabstrip.appendChild(newTab);
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

async function displayNotes(site = "general_notes", note = "", tab = 0) {
    DOM.textarea.value = note;
    DOM.textarea.dataset.currentNote = site;
    DOM.textarea.dataset.currentTab = tab;
}

async function saveNotes() {
    let res = await browser.storage.local.get();
    let parent =
        DOM.textarea.dataset.currentNote === "general_notes" ? res : res.site_notes;
    parent[DOM.textarea.dataset.currentNote][DOM.textarea.dataset.currentTab] =
        DOM.textarea.value;
    await browser.storage.local.set(res);
}

async function loadNotes(note = "general_notes", tab = 0, manualClick = false) {
    let tabs = (await browser.tabs.query({
        active: true,
        currentWindow: true
    }))[0];
    let res = await browser.storage.local.get();
    if (note === "general_notes") {
        displayNotes("general_notes", res.general_notes[tab]);
    }
    if (
        !tabs.incognito ||
        manualClick ||
        (res.options.private_browsing && tabs.incognito)
    ) {
        let site = await siteParser(tabs.url, res, DOM.toggle.value);
        let parent = site === "general_notes" ? res.general_notes : res.site_notes[site];
        displayNotes(site, parent[tab]);
    } else {
        displayNotes("general_notes", res.general_notes[tab]);
    }
}

async function perTabSidebar() {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true
    });
    const res = await browser.storage.local.get("options");
    DOM.toggle.value = res.options.default_display;
    if (!DOM.back.dataset.hasOwnProperty(tabs[0].id)) {
        switch (res.options.default_display) {
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
    emboldenNotes(DOM.back.dataset.currentSite);
}

async function tabSwitch(e) {
    let tabstrip = Array.from(DOM.tabstrip.children);
    tabstrip[DOM.tabstrip.dataset.activeTab].className = "tab";
    e.target.className = "tab active";
    DOM.tabstrip.dataset.activeTab = tabstrip.indexOf(e.target);
    siteNoteSetup(DOM.back.dataset.currentSite);
    // switch (DOM.toggle.value) {
    //     case "domain":
    //     case "url":
    //         siteNoteSetup(DOM.back.dataset.currentSite);
    //         break;
    //     case "general_notes":
    //         loadGeneralNotes();
    //         break;
    // }
}

function closeNewNote() {
    DOM.newNote.style.width = 0;
    DOM.textarea.focus();
}

function openNewNote() {
    DOM.newNote.style.width = "100%";
    DOM.newNoteName.value = "";
    DOM.newNoteName.focus();
}

async function newNote() {
    let res = await browser.storage.local.get("site_notes");
    res.site_notes[DOM.newNoteName.value] = [];
    browser.storage.local.set(res);
    closeNewNote();
}

document.addEventListener("focus", () => DOM.textarea.focus());
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
DOM.ok.addEventListener("click", newNote);
DOM.cancel.addEventListener("click", closeNewNote);
browser.storage.onChanged.addListener(listUpdate);
document.addEventListener("DOMContentLoaded", main);

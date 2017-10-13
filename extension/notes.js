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
const search = document.getElementById("search")
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
function saveSiteNotes() {
    browser.storage.local.get("site_notes").then((res) => {
        res.site_notes[back.innerText] = textarea.value || "";
        browser.storage.local.set({site_notes: res.site_notes});
    });
}
async function loadGeneralNotes() {
    textarea.focus();
    toggle.className = "mdi mdi-web";
    toggle.title = "Switch to site notes"
    textarea.removeEventListener("input", saveSiteNotes);
    var res = await browser.storage.local.get("general_notes");
    textarea.value = res.general_notes || "";
    back.innerText = "General Notes";
    textarea.addEventListener("input", saveGeneralNotes);
}
async function siteNoteSetup(site) {
    textarea.focus();
    textarea.removeEventListener("input", saveGeneralNotes);
    toggle.className = "mdi mdi-note";
    toggle.title = "Switch to general notes"
    var res = await browser.storage.local.get("site_notes");
    textarea.value = res.site_notes.hasOwnProperty(site) ? res.site_notes[site] : "";
    back.innerText = site;
    textarea.addEventListener("input", saveSiteNotes);
}
function removeNoteFromList(name) {
    var deleteButton = noteList.querySelector("span[data-delete-site='" + name + "']");
    deleteButton.parentNode.parentNode.removeChild(deleteButton.parentNode);
}
function deleteNote() {
    browser.storage.local.get("site_notes").then((res) => {
        delete res.site_notes[siteName.innerText];
        browser.storage.local.set({site_notes: res.site_notes});
    });
    removeNoteFromList(siteName.innerText);
    confirmDelete.style.width = "0";
}
async function loadCustomNote(ele) {
    if (ele.target.innerText !== back.innerText) {
        var tabs = await browser.tabs.query({active: true, currentWindow: true})
        back.dataset[tabs[0].id] = ele.target.innerText;
    }
    if (ele.target.innerText === "General Notes") {
        loadGeneralNotes();
    } else if (ele.target.className === "mdi mdi-delete") {
        confirmDelete.style.width = "100%";
        siteName.innerText = ele.target.dataset.deleteSite;
        return;
    } else if (ele.target.className === "name") {
        siteNoteSetup(ele.target.innerText);
    } else {
        return;
    }
    closeList();
}
function closeConfirm() {
    confirmDelete.style.width = "0";
}
async function siteParser(rawUrl) {
    var res = await browser.storage.local.get("options");
    var url = new URL(rawUrl);
    if (url.protocol === "about:") {
        return url.protocol + url.pathname;
    } else if (url.protocol.match(/https?:/g)) {
        var site = psl.parse(url.hostname);
        if (res.options.per_site === "url") {
            return url.hostname + url.pathname;
        } else if (res.options.subdomains_mode === "blacklist") {
            if (res.options.subdomains.indexOf(site.domain) > -1 || res.options.subdomains.length === 0) {
                return site.domain;
            } else {
                return url.hostname;
            }
        } else if (res.options.subdomains_mode === "whitelist") {
            if (res.options.subdomains.indexOf(site.domain) > -1 || res.options.subdomains.length === 0) {
                return url.hostname;
            } else {
                return site.domain;
            }
        }
    } else {
        return "general_notes";
    }
}
async function loadSiteNotes() {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({active: true, currentWindow: true})
    if (!tabs[0].incognito || (res.options.private_browsing && tabs[0].incognito)) {
        var url = tabs[0].url;
        var site = await siteParser(url);
        if (site === "general_notes") {
            loadGeneralNotes();
        } else {
            siteNoteSetup(site);
        }
    } else {
        loadGeneralNotes();
    }
}
function changeNoteMode(ele) {
    if (ele.target.className === "mdi mdi-web") {
        loadSiteNotes();
    } else if (ele.target.className === "mdi mdi-note") {
        loadGeneralNotes();
    }
}
function setLightTheme() {
    browser.storage.local.get("options").then((res) => {
        document.body.style.backgroundColor = "#" + res.options.background_color;
        document.body.style.color = "#" + res.options.font_color;
        search.style.color = "#" + res.options.font_color;
        search.style.backgroundColor = "#" + res.options.background_color;
    });
}
function setDarkTheme() {
    browser.storage.local.get("options").then((res) => {
        document.body.style.backgroundColor = "#" + res.options.background_color_dark;
        document.body.style.color = "#" + res.options.font_color_dark;
        search.style.color = "#" + res.options.font_color_dark;
        search.style.backgroundColor = "#" + res.options.background_color_dark;
    });
}
function changeTheme(ele) {
    browser.storage.local.get().then((res) => {
        if (ele.target.title === "Switch to light theme") {
            ele.target.title = "Switch to dark theme";
            res.options.theme = "light";
            browser.storage.local.set({options: res.options});
            setLightTheme();
        } else if (ele.target.title === "Switch to dark theme") {
            ele.target.title = "Switch to light theme";
            res.options.theme = "dark";
            browser.storage.local.set({options: res.options});
            setDarkTheme();
        }
    });
}
function addNoteToList(site) {
    var cont = document.createElement("span");
    cont.className = "container";
    var name = document.createElement("div");
    name.innerText = site;
    name.className = "name";
    var del = document.createElement("span");
    del.dataset.deleteSite = site;
    del.className = "mdi mdi-delete";
    cont.append(name);
    cont.append(del);
    noteList.append(cont);
}
function loadNoteList() {
    browser.storage.local.get("site_notes").then((res) => {
        for (var site in res.site_notes) {
            if (res.site_notes.hasOwnProperty(site)) {
                addNoteToList(site);
            }
        }
    });
}
function resizePage() {
    textarea.style.height = window.innerHeight - 30 + "px";
    textarea.style.width = window.innerWidth - 2 + "px";
    overlay.style.height = window.innerHeight - 30 + "px";
}
function pageSetup() {
    browser.storage.local.get("options").then((res) => {
        if (res.options.theme === "light") {
            theme.title = "Switch to dark theme";
            setLightTheme();
        } else if (res.options.theme === "dark") {
            theme.title = "Switch to light theme";
            setDarkTheme();
        }
        if (res.options.font_family === "custom") {
            textarea.style.fontFamily = res.options.font_css;
        } else if (res.options.font_family !== "default") {
            textarea.style.fontFamily = res.options.font_family;
        }
        textarea.style.fontSize = res.options.font_size + "px";
        var context = getContext()
        if (context === "tab") {
            openInTab.style.display = "none";
            toggle.style.display = "none";
        }
        if (context !== "popup") {
            window.addEventListener("resize", resizePage);
            resizePage();
        } else {
            document.body.style.width = res.options.width + "px";
            textarea.style.width = res.options.width + "px";
            textarea.style.height = res.options.height + "px";
            overlay.style.height = res.options.height + "px";
        }
        if (res.options.default_display === "general_notes") {
            loadGeneralNotes();
        } else if (res.options.default_display === "site_notes") {
            loadSiteNotes();
        }
        loadNoteList();
    });
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
async function perTabSidebar(activeInfo) {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (!back.dataset.hasOwnProperty(tabs[0].id)) {
        if (res.options.default_display === "site_notes") {
            loadSiteNotes();
        } else {
            loadGeneralNotes();
        }
    } else {
        siteNoteSetup(back.dataset[tabs[0].id])
    }
}
function listUpdate(changes) {
    var oldValues = Object.keys(changes.site_notes.oldValue);
    var newValues = Object.keys(changes.site_notes.newValue);
    for (var item of oldValues) {
        if (newValues.indexOf(item) === -1) {
            removeNoteFromList(item);
        }
    };
    for (var item of newValues) {
        if (oldValues.indexOf(item) === -1) {
            addNoteToList(item)
        }
    };
}
document.addEventListener("focus", () => {
    textarea.focus();
});
settings.addEventListener("click", options);
toggle.addEventListener("click", changeNoteMode);
theme.addEventListener("click", changeTheme);
back.addEventListener("click", openList);
overlayClose.addEventListener("click", closeList);
noteList.addEventListener("click", loadCustomNote);
no.addEventListener("click", closeConfirm);
yes.addEventListener("click", deleteNote);
openInTab.addEventListener("click", openTab);
search.addEventListener("input", searchResults);
document.addEventListener("DOMContentLoaded", pageSetup);
browser.storage.onChanged.addListener(listUpdate)
if (getContext() === "sidebar") {
    browser.tabs.onActivated.addListener(perTabSidebar)
    browser.tabs.onUpdated.addListener(perTabSidebar)
}

const textarea = document.getElementsByTagName("textarea")[0];
const back = document.getElementsByClassName("mdi-keyboard-backspace")[0];
const toggle = document.getElementById("toggle");
const theme = document.getElementById("theme");
function saveGeneralNotes() {
    browser.storage.local.set({
        general_notes: textarea.value || ""
    });
}
function saveSiteNotes() {
    var site = back.innerText;
    var saveObj = {site_notes: {}};
    saveObj.site_notes[site] = textarea.value || "";
    console.log(saveObj);
    browser.storage.local.set(saveObj);
}
function loadGeneralNotes() {
    toggle.className = "mdi mdi-web";
    toggle.title = "Switch to site notes"
    textarea.removeEventListener("input", saveSiteNotes);
    browser.storage.local.get("general_notes").then((res) => {
        textarea.value = res.general_notes || "";
        back.innerText = "General Notes";
        textarea.addEventListener("input", saveGeneralNotes);
    });
}
function loadSiteNotes() {
    toggle.className = "mdi mdi-note";
    toggle.title = "Switch to general notes"
    textarea.removeEventListener("input", saveGeneralNotes);
    browser.storage.local.get().then((res) => {
        browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
            var url = new URL(tabs[0].url);
            if (url.protocol === "about:") {
                var path = url.protocol + url.pathname;
                console.log(path);
                if (res.site_notes[path] === undefined) {
                    res.site_notes[path] = "";
                }
                textarea.value = res.site_notes[path];
                back.innerText = path;
                textarea.addEventListener("input", saveSiteNotes);
            } else if (url.protocol.match(/https?:\/\//g)) {
                var site = psl.parse(site.hostname);
                if (res.options.subdomains_mode === "blacklist") {
                    if (res.options.subdomains.indexOf(site.domain) > -1 || res.options.subdomains[0] === "all_urls") {
                        if (res.site_notes[site.domain] === undefined) {
                            res.site_notes[site.domain] = "";
                        }
                        textarea.value = res.site_notes[site.domain];
                        back.innerText = site.domain;
                        textarea.addEventListener("input", saveSiteNotes);
                    } else {
                        if (res.site_notes[url.hostname] === undefined) {
                            res.site_notes[url.hostname] = "";
                        }
                        textarea.value = res.site_notes[url.hostname];
                        back.innerText = url.hostname;
                        textarea.addEventListener("input", saveSiteNotes);
                    }
                } else if (res.options.subdomains_mode === "whitelist") {
                    if (res.options.subdomains.indexOf(site.domain) > -1 || res.options.subdomains[0] === "all_urls") {
                        if (res.site_notes[url.hostname] === undefined) {
                            res.site_notes[url.hostname] = "";
                        }
                        textarea.value = res.site_notes[url.hostname];
                        back.innerText = url.hostname;
                        textarea.addEventListener("input", saveSiteNotes);
                    } else {
                        if (res.site_notes[site.domain] === undefined) {
                            res.site_notes[site.domain] = "";
                        }
                        textarea.value = res.site_notes[site.domain];
                        back.innerText = site.domain;
                        textarea.addEventListener("input", saveSiteNotes);
                    }
                }
            } else {
                loadGeneralNotes();
            }
        });
    });
}
function changeNoteMode(ele) {
    if (ele.target.className === "mdi mdi-web") {
        loadSiteNotes();
    } else if (ele.target.className === "mdi mdi-note") {
        loadGeneralNotes();
    }
}
function changeTheme(ele) {
    browser.storage.local.get().then((res) => {
        if (ele.target.title === "Switch to light theme") {
            ele.target.title = "Switch to dark theme";
            res.options.theme = "light";
            browser.storage.local.set({options: res.options});
            document.body.style.backgroundColor = "#" + res.options.background_color;
            document.body.style.color = "#" + res.options.font_color;
            textarea.style.backgroundColor = "#" + res.options.background_color;
            textarea.style.color = "#" + res.options.font_color;
        } else if (ele.target.title === "Switch to dark theme") {
            ele.target.title = "Switch to light theme";
            res.options.theme = "dark";
            browser.storage.local.set({options: res.options});
            document.body.style.backgroundColor = "#" + res.options.background_color_dark;
            document.body.style.color = "#" + res.options.font_color_dark;
            textarea.style.backgroundColor = "#" + res.options.background_color_dark;
            textarea.style.color = "#" + res.options.font_color_dark;
        }
    });
}
function pageSetup(e) {
    // Needed to autofocus textbox
    // https://stackoverflow.com/a/11400653
    if (location.search !== "?focusHack") {
        location.search = "?focusHack";
    }
    browser.storage.local.get("options").then((res) => {
        if (res.options.theme === "light") {
            theme.title = "Switch to dark theme";
            document.body.style.backgroundColor = "#" + res.options.background_color;
            document.body.style.color = "#" + res.options.font_color;
            textarea.style.backgroundColor = "#" + res.options.background_color;
            textarea.style.color = "#" + res.options.font_color;
        } else if (res.options.theme === "dark") {
            theme.title = "Switch to light theme";
            document.body.style.backgroundColor = "#" + res.options.background_color_dark;
            document.body.style.color = "#" + res.options.font_color_dark;
            textarea.style.backgroundColor = "#" + res.options.background_color_dark;
            textarea.style.color = "#" + res.options.font_color_dark;
        }
        if (res.options.font_family === "custom") {
            textarea.style.fontFamily = res.options.font_css;
        } else if (res.options.font_family !== "default") {
            textarea.style.fontFamily = res.options.font_family;
        }
        textarea.style.fontSize = res.options.font_size + "px";
        textarea.style.width = res.options.width + "px";
        textarea.style.height = res.options.height + "px";
        if (res.options.default_display === "general_notes") {
            loadGeneralNotes();
        } else if (res.options.default_display === "site_notes") {
            loadSiteNotes();
        }
    });
    e.preventDefault();
}
function options() {
    browser.runtime.openOptionsPage();
}
document.getElementsByClassName("mdi-settings")[0].addEventListener("click", options);
toggle.addEventListener("click", changeNoteMode);
theme.addEventListener("click", changeTheme);
document.addEventListener("DOMContentLoaded", pageSetup);

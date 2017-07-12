const textarea = document.getElementsByTagName("textarea")[0];
const back = document.getElementsByClassName("mdi-keyboard-backspace")[0];
const toggle = document.getElementById("toggle");
const theme = document.getElementById("theme");
function loadGeneralNotes() {
    browser.storage.local.get("general_notes").then((res) => {
        textarea.value = res.general_notes || "";
        back.innerText = "General Notes";
    });
}
function loadSiteNotes() {
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
            } else if (url.protocol.match(/https?:\/\//g)) {
                var site = psl.parse(site.hostname);
                if (res.options.ignoreSubdomain.indexOf(site.domain) > -1 || res.options.ignoreSubdomain[0] === "all_urls") {
                    if (res.site_notes[site.domain] === undefined) {
                        res.site_notes[site.domain] = "";
                    }
                    textarea.value = res.site_notes[site.domain];
                    back.innerText = site.domain;
                } else {
                    if (res.site_notes[url.hostname] === undefined) {
                        res.site_notes[url.hostname] = "";
                    }
                    textarea.value = res.site_notes[url.hostname];
                    back.innerText = url.hostname;
                }
            } else {
                console.log("do we get here?")
                loadGeneralNotes();
            }
        });
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
            document.body.style.backgroundColor = "#" + res.options.background_color;
            document.body.style.color = "#" + res.options.font_color;
            document.getElementsByTagName("textarea")[0].style.backgroundColor = "#" + res.options.background_color;
            document.getElementsByTagName("textarea")[0].style.color = "#" + res.options.font_color;
        } else if (res.options.theme === "dark") {
            document.body.style.backgroundColor = "#" + res.options.background_color_dark;
            document.body.style.color = "#" + res.options.font_color_dark;
            document.getElementsByTagName("textarea")[0].style.backgroundColor = "#" + res.options.background_color_dark;
            document.getElementsByTagName("textarea")[0].style.color = "#" + res.options.font_color_dark;
        }
        if (res.options.font_family === "custom") {
            document.getElementsByTagName("textarea")[0].style.fontFamily = res.options.font_css;
        } else if (res.options.font_family !== "default") {
            document.getElementsByTagName("textarea")[0].style.fontFamily = res.options.font_family;
        }
        document.getElementsByTagName("textarea")[0].style.fontSize = res.options.font_size + "px";
        document.getElementsByTagName("textarea")[0].style.width = res.options.width + "px";
        document.getElementsByTagName("textarea")[0].style.height = res.options.height + "px";
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
document.addEventListener("DOMContentLoaded", pageSetup);
document.getElementsByClassName("mdi-settings")[0].addEventListener("click", options);

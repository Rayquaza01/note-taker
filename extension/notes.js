const textarea = document.getElementsByTagName("textarea")[0];
function getHost(href) {
    var link = document.createElement("a");
    link.href = href;
    return link.hostname;
}
function loadGeneralNotes() {
    browser.storage.local.get("general_notes").then((res) => {
        document.getElementsByTagName("textarea")[0].value = res.general_notes || "";
        document.getElementsByClassName("mdi-keyboard-backspace")[0].innerText = "General Notes";
    });
}
function loadSiteNotes() {
    browser.storage.local.get("site_notes").then((res) => {
        browser.tabs.query({active: true}).then((tabs) => {
            var site = getHost(tabs[0].url);
            if (!res.site_notes[site]) {
                res.site_notes[site] = "";
            }
            textarea.value = res.site_notes[site];
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

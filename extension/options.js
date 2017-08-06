// Element Variables
const table = document.getElementsByTagName("table")[0];
const theme = document.getElementById("theme");
const background_color = document.getElementById("background-color");
const font_color = document.getElementById("font-color");
const background_color_dark = document.getElementById("background-color-dark");
const font_color_dark = document.getElementById("font-color-dark");
const background_color_picker = document.getElementById("background-color-picker");
const font_color_picker = document.getElementById("font-color-picker");
const background_color_picker_dark = document.getElementById("background-color-picker-dark");
const font_color_picker_dark = document.getElementById("font-color-picker-dark");
const width = document.getElementById("width");
const height = document.getElementById("height");
const font_family = document.getElementById("font-family");
const font_css = document.getElementById("font-css");
const font_size = document.getElementById("font-size");
const default_display = document.getElementById("default-display");
const per_site = document.getElementById("per-site");
const private_browsing = document.getElementById("private-browsing");
const domain_mode = document.getElementById("domain-mode");
const subdomains_mode = document.getElementById("subdomains-mode");
const subdomains = document.getElementById("subdomains");
// End element variables
function saveOptions() {
    var options = {
        theme: theme.value || "light",
        background_color: background_color.value || "ffffff",
        font_color: font_color.value || "000000",
        background_color_dark: background_color_dark.value || "000000",
        font_color_dark: font_color_dark.value || "ffffff",
        width: parseInt(width.value) || 400,
        height: parseInt(height.value) || 300,
        font_family: font_family.value || "default",
        font_css: font_css.value || "",
        font_size: parseInt(font_size.value) || 16,
        default_display: default_display.value || "general_notes",
        per_site: per_site.value || "domain",
        private_browsing: JSON.parse(private_browsing.value) || false,
        subdomains_mode: subdomains_mode.value || "blacklist",
        subdomains: subdomains.value.split(" ") || []
    };
    browser.storage.local.set({
        options: options
    });
}
function fontSync(ele) {
    if (ele.target.value === "custom") {
        font_css.disabled = false;
    } else {
        font_css.disabled = true;
    }
}
function colorSync(ele) {
    // Ugly function, try to fix later...
    switch (ele.target.id) {
        case "background-color":
            background_color_picker.value = "#" + ele.target.value;
            break;
        case "background-color-picker":
            background_color.value = ele.target.value.substring(1);
            break;
        case "font-color":
            font_color_picker.value = "#" + ele.target.value;
            break;
        case "font-color-picker":
            font_color.value = ele.target.value.substring(1);
            break;
        case "background-color-dark":
            background_color_picker_dark.value = "#" + ele.target.value;
            break;
        case "background-color-picker-dark":
            background_color_dark.value = ele.target.value.substring(1);
            break;
        case "font-color-dark":
            font_color_picker_dark.value = "#" + ele.target.value;
            break;
        case "font-color-picker-dark":
            font_color_dark.value = ele.target.value.substring(1);
            break;
    }
}
function domainModeSync(ele) {
    domain_mode.innerText = ele.target.value === "blacklist" ? "Ignore" : "Enforce";
}
function restoreOptions() {
    browser.storage.local.get().then((res) => {
        theme.value = res.options.theme;
        background_color.value = res.options.background_color;
        background_color_picker.value = "#" + res.options.background_color;
        background_color_dark.value = res.options.background_color_dark;
        background_color_picker_dark.value = "#" + res.options.background_color_dark;
        font_color.value = res.options.font_color;
        font_color_picker.value = "#" + res.options.font_color;
        font_color_dark.value = res.options.font_color_dark;
        font_color_picker_dark.value = "#" + res.options.font_color_dark;
        document.getElementById("width").value = res.options.width;
        width.value = res.options.width;
        document.getElementById("height").value = res.options.height;
        height.value = res.options.height;
        font_family.value = res.options.font_family;
        if (res.options.font_family === "custom") {
            font_css.disabled = false;
        }
        font_css.value = res.options.font_css;
        font_size.value = res.options.font_size;
        default_display.value = res.options.default_display;
        per_site.value = res.options.per_site;
        private_browsing.value = res.options.private_browsing;
        subdomains_mode.value = res.options.subdomains_mode;
        subdomains.value = res.options.subdomains.join(" ");
        if (res.options.subdomains_mode === "whitelist") {
            domain_mode.innerText = "Enforce";
        }
    });
}
// color sync
background_color.addEventListener("input", colorSync);
font_color.addEventListener("input", colorSync);
background_color_picker.addEventListener("input", colorSync);
font_color_picker.addEventListener("input", colorSync);
background_color_dark.addEventListener("input", colorSync);
font_color_dark.addEventListener("input", colorSync);
background_color_picker_dark.addEventListener("input", colorSync);
font_color_picker_dark.addEventListener("input", colorSync);
// font sync
font_family.addEventListener("change", fontSync)
// Subdomain Sync
subdomains_mode.addEventListener("input", domainModeSync);
// save options
table.addEventListener("change", saveOptions); // Event delegation is a lot simpler than what I was trying
// onload
document.addEventListener("DOMContentLoaded", restoreOptions);
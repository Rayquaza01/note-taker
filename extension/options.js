const table = document.getElementsByTagName("table")[0];
function saveOptions(e) {
    var options = {
        theme: document.getElementById("theme").value || "light",
        background_color: document.getElementById("background-color").value || "ffffff",
        font_color: document.getElementById("font-color").value || "000000",
        background_color_dark: document.getElementById("background-color-dark").value || "000000",
        font_color_dark: document.getElementById("font-color-dark").value || "ffffff",
        width: parseInt(document.getElementById("width").value) || 400,
        height: parseInt(document.getElementById("height").value) || 300,
        font_family: document.getElementById("font-family").value || "default",
        font_css: document.getElementById("font-css").value || "",
        font_size: parseInt(document.getElementById("font-size").value) || 16,
        default_display: document.getElementById("default-display").value || "general_notes",
        ignore_subdomains: document.getElementById("ignore-subdomains").value.split(" ") || []
    };
    browser.storage.local.set({
        options: options
    });
    e.preventDefault();
}
function fontSync(ele) {
    if (ele.target.value === "custom") {
        document.getElementById("font-css").disabled = false;
    } else {
        document.getElementById("font-css").disabled = true;
    }
}
function colorSync(ele) {
    switch (ele.target.id) {
        case "background-color":
            document.getElementById("background-color-picker").value = "#" + ele.target.value;
            break;
        case "background-color-picker":
            document.getElementById("background-color").value = ele.target.value.substring(1);
            break;
        case "font-color":
            document.getElementById("font-color-picker").value = "#" + ele.target.value;
            break;
        case "font-color-picker":
            document.getElementById("font-color").value = ele.target.value.substring(1);
            break;
        case "background-color-dark":
            document.getElementById("background-color-picker-dark").value = "#" + ele.target.value;
            break;
        case "background-color-picker-dark":
            document.getElementById("background-color-dark").value = ele.target.value.substring(1);
            break;
        case "font-color-dark":
            document.getElementById("font-color-picker-dark").value = "#" + ele.target.value;
            break;
        case "font-color-picker-dark":
            document.getElementById("font-color-dark").value = ele.target.value.substring(1);
            break;
    }
}
function restoreOptions() {
    browser.storage.local.get().then((res) => {
        // if (!res.options) {
        //     saveOptions("e");
        // }
        document.getElementById("background-color").value = res.options.background_color;
        document.getElementById("background-color-picker").value = "#" + res.options.background_color;
        document.getElementById("background-color-dark").value = res.options.background_color_dark;
        document.getElementById("background-color-picker-dark").value = "#" + res.options.background_color_dark;
        document.getElementById("font-color").value = res.options.font_color;
        document.getElementById("font-color-picker").value = "#" + res.options.font_color;
        document.getElementById("font-color-dark").value = res.options.font_color_dark;
        document.getElementById("font-color-picker-dark").value = "#" + res.options.font_color_dark;
        document.getElementById("width").value = res.options.width;
        document.getElementById("height").value = res.options.height;
        document.getElementById("font-family").value = res.options.font_family;
        if (res.options.font_family === "custom") {
            document.getElementById("font-css").disabled = false;
        }
        document.getElementById("font-css").value = res.options.font_css;
        document.getElementById("font-size").value = res.options.font_size;
        document.getElementById("default-display").value = res.options.default_display;
    });
}
// color sync
document.getElementById("background-color").addEventListener("input", colorSync);
document.getElementById("font-color").addEventListener("input", colorSync);
document.getElementById("background-color-picker").addEventListener("input", colorSync);
document.getElementById("font-color-picker").addEventListener("input", colorSync);
document.getElementById("background-color-dark").addEventListener("input", colorSync);
document.getElementById("font-color-dark").addEventListener("input", colorSync);
document.getElementById("background-color-picker-dark").addEventListener("input", colorSync);
document.getElementById("font-color-picker-dark").addEventListener("input", colorSync);
// font sync
document.getElementById("font-family").addEventListener("change", fontSync)
// save options
table.addEventListener("change", saveOptions); // Event delegation is a lot simpler than what I was trying
// onload
document.addEventListener("DOMContentLoaded", restoreOptions);

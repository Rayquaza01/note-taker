function saveOptions(e) {
    var options = {
        background_color: document.getElementById("background-color").value || "ffffff",
        font_color: document.getElementById("font-color").value || "000000",
        width: parseInt(document.getElementById("width").value) || 400,
        height: parseInt(document.getElementById("height").value) || 300,
        font_family: document.getElementById("font-family").value || "default",
        font_css: document.getElementById("font-css").value || "",
        font_size: parseInt(document.getElementById("font-size").value) || 16,
        default_display: document.getElementById("default-display").value || "general_notes"
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
        document.getElementById("font-css-row").disabled = true;
    }
}
function colorSync(ele) {
    if (ele.target.id === "background-color") {
        document.getElementById("background-color-picker").value = "#" + ele.target.value;
    } else if (ele.target.id === "background-color-picker") {
        document.getElementById("background-color").value = ele.target.value.substring(1);
    } else if (ele.target.id === "font-color") {
        document.getElementById("font-color-picker").value = "#" + ele.target.value;
    } else if (ele.target.id === "font-color-picker") {
        document.getElementById("font-color").value = ele.target.value.substring(1);
    }
}
function restoreOptions() {
    browser.storage.local.get().then((res) => {
        if (!res.options) {
            saveOptions("e")
        }
        document.getElementById("background-color").value = res.options.background_color;
        document.getElementById("background-color-picker").value = "#" + res.options.background_color;
        document.getElementById("font-color").value = res.options.font_color;
        document.getElementById("font-color-picker").value = "#" + res.options.font_color;
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
// font sync
document.getElementById("font-family").addEventListener("change", fontSync)
// save options
document.getElementById("background-color").addEventListener("change", saveOptions);
document.getElementById("font-color").addEventListener("change", saveOptions);
document.getElementById("background-color-picker").addEventListener("change", saveOptions);
document.getElementById("font-color-picker").addEventListener("change", saveOptions);
document.getElementById("width").addEventListener("change", saveOptions);
document.getElementById("height").addEventListener("change", saveOptions);
document.getElementById("font-family").addEventListener("change", saveOptions);
document.getElementById("font-css").addEventListener("change", saveOptions);
document.getElementById("font-size").addEventListener("change", saveOptions);
document.getElementById("default-display").addEventListener("change", saveOptions);
// onload
document.addEventListener("DOMContentLoaded", restoreOptions);

function saveOptions(e) {
    e.preventDefault();
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
    browser.storage.local.get({
        options: {
            background_color: "ffffff",
            font_color: "000000",
            width: 400,
            height: 300,
            font_family: "default",
            font_size: 16
        }
    }).then((res) => {
        document.getElementById("background-color").value = res.options.background_color;
        document.getElementById("background-color-picker").value = "#" + res.options.background_color;
        document.getElementById("font-color").value = res.options.font_color;
        document.getElementById("font-color-picker").value = "#" + res.options.font_color;
        document.getElementById("width").value = res.options.width;
        document.getElementById("height").value = res.options.height;
        document.getElementById("font-family").value = res.options.font_family;
        document.getElementById("font-size").value = res.options.font_size;
    });
}
document.getElementById("background-color").addEventListener("input", colorSync);
document.getElementById("font-color").addEventListener("input", colorSync);
document.getElementById("background-color-picker").addEventListener("input", colorSync);
document.getElementById("font-color-picker").addEventListener("input", colorSync);
document.addEventListener("DOMContentLoaded", restoreOptions);

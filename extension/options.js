/* globals generateElementsVariable */
// Element Variables
const DOM = generateElementsVariable([
    "upload",
    "download",
    "padding",
    "table",
    "theme",
    "background_color",
    "font_color",
    "background_color_dark",
    "font_color_dark",
    "background_color_picker",
    "font_color_picker",
    "background_color_picker_dark",
    "font_color_picker_dark",
    "width",
    "height",
    "font_family",
    "font_css",
    "font_size",
    "default_display",
    "private_browsing",
    "domain_mode",
    "subdomains_mode",
    "subdomains",
    "notification_badge",
    "notification_badge_color",
    "notification_badge_color_picker",
    "bullet_types",
    "get_params",
    "export",
    "import",
    "exportTextarea",
    "tabnos",
    "text_direction",
    "browser_action_shortcut",
    "sidebar_action_shortcut"
]);

function filterBlanks(item) {
    if (!item.match(/^$/)) {
        return item;
    }
}

function saveOptions() {
    const options = {
        theme: DOM.theme.value || "light",
        background_color: DOM.background_color.value || "ffffff",
        font_color: DOM.font_color.value || "000000",
        background_color_dark: DOM.background_color_dark.value || "000000",
        font_color_dark: DOM.font_color_dark.value || "ffffff",
        width: parseInt(DOM.width.value) || 400,
        height: parseInt(DOM.height.value) || 300,
        font_family: DOM.font_family.value || "default",
        font_css: DOM.font_css.value || "",
        font_size: parseInt(DOM.font_size.value) || 16,
        default_display: DOM.default_display.value || "general_notes",
        private_browsing: JSON.parse(DOM.private_browsing.value) || false,
        subdomains_mode: DOM.subdomains_mode.value || "blacklist",
        subdomains: DOM.subdomains.value.split(" ").filter(filterBlanks) || [],
        notification_badge: DOM.notification_badge.value || "disabled",
        notification_badge_color:
            DOM.notification_badge_color.value || "5a5b5c",
        bullet_types: DOM.bullet_types.value
            .split(" ")
            .filter(filterBlanks) || ["*", "-", "+"],
        get_params: DOM.get_params.value.split(" ").filter(filterBlanks) || [
            "q",
            "v"
        ],
        tabnos: DOM.tabnos.value || 0,
        padding: DOM.padding.value || 5,
        text_direction: DOM.text_direction.value || "ltr",
        browser_action_shortcut:
            DOM.browser_action_shortcut.value || "Ctrl+Alt+N",
        sidebar_action_shortcut:
            DOM.sidebar_action_shortcut.value || "Alt+Shift+N"
    };
    browser.storage.local.set({ options: options });
    browser.commands.update({
        name: "_execute_browser_action",
        shortcut: DOM.browser_action_shortcut.value || "Ctrl+Alt+N"
    });
    browser.commands.update({
        name: "_execute_sidebar_action",
        shortcut: DOM.sidebar_action_shortcut.value || "Alt+Shift+N"
    });
}

function colorSync(ele) {
    if (ele.target.dataset.hasOwnProperty("colorsync")) {
        var target = document.querySelector(ele.target.dataset.colorsync);
        target.value =
            target.type === "color"
                ? "#" + ele.target.value
                : ele.target.value.substring(1);
    }
}

function domainModeSync(ele) {
    DOM.domain_mode.innerText =
        ele.target.value === "blacklist" ? "Ignore" : "Enforce";
}

async function restoreOptions() {
    const res = await browser.storage.local.get();
    DOM.theme.value = res.options.theme;
    DOM.background_color.value = res.options.background_color;
    DOM.background_color_picker.value = "#" + res.options.background_color;
    DOM.background_color_dark.value = res.options.background_color_dark;
    DOM.background_color_picker_dark.value =
        "#" + res.options.background_color_dark;
    DOM.font_color.value = res.options.font_color;
    DOM.font_color_picker.value = "#" + res.options.font_color;
    DOM.font_color_dark.value = res.options.font_color_dark;
    DOM.font_color_picker_dark.value = "#" + res.options.font_color_dark;
    DOM.width.value = res.options.width;
    DOM.height.value = res.options.height;
    DOM.font_family.value = res.options.font_family;
    DOM.font_css.value = res.options.font_css;
    DOM.font_size.value = res.options.font_size;
    DOM.default_display.value = res.options.default_display;
    DOM.private_browsing.value = res.options.private_browsing;
    DOM.subdomains_mode.value = res.options.subdomains_mode;
    DOM.subdomains.value = res.options.subdomains.join(" ");
    DOM.notification_badge.value = res.options.notification_badge;
    DOM.notification_badge_color.value = res.options.notification_badge_color;
    DOM.notification_badge_color_picker.value =
        "#" + res.options.notification_badge_color;
    DOM.bullet_types.value = res.options.bullet_types.join(" ");
    DOM.get_params.value = res.options.get_params.join(" ");
    DOM.tabnos.value = res.options.tabnos;
    DOM.padding.value = res.options.padding;
    DOM.text_direction.value = res.options.text_direction;
    DOM.browser_action_shortcut.value = res.options.browser_action_shortcut;
    DOM.sidebar_action_shortcut.value = res.options.sidebar_action_shortcut;
    if (res.options.subdomains_mode === "whitelist") {
        DOM.domain_mode.innerText = "Enforce";
    }
    exportNotesAndOptions();
}

async function exportNotesAndOptions() {
    var res = await browser.storage.local.get();
    DOM.export.href = "data:text/json;charset=utf-8," + JSON.stringify(res);
    DOM.exportTextarea.value = JSON.stringify(res, null, "    ");
}

function importOptions() {
    var reader = new FileReader();
    reader.addEventListener("load", () => {
        var obj = JSON.parse(reader.result);
        browser.storage.local.clear();
        browser.storage.local.set(obj);
        location.reload();
    });
    var file = DOM.import.files[0];
    reader.readAsText(file);
}

function changeBadgeColor() {
    browser.browserAction.setBadgeBackgroundColor({
        color: "#" + DOM.notification_badge_color.value
    });
}

async function uploadToSync() {
    const res = await browser.storage.local.get();
    await browser.storage.sync.clear();
    browser.storage.sync.set(res);
}

async function downloadFromSync() {
    const res = await browser.storage.sync.get();
    await browser.storage.local.clear();
    browser.storage.local.set(res);
}

// sync
DOM.upload.addEventListener("click", uploadToSync);
DOM.download.addEventListener("click", downloadFromSync);
// import
DOM.import.addEventListener("change", importOptions);
// color sync
DOM.table.addEventListener("input", colorSync);
// Subdomain Sync
DOM.subdomains_mode.addEventListener("input", domainModeSync);
// save options
DOM.table.addEventListener("input", saveOptions); // Event delegation is a lot simpler than what I was trying
// badges
DOM.notification_badge_color.addEventListener("input", changeBadgeColor);
DOM.notification_badge_color_picker.addEventListener("input", changeBadgeColor);
// on storage change
browser.storage.onChanged.addListener(exportNotesAndOptions);
// onload
document.addEventListener("DOMContentLoaded", restoreOptions);

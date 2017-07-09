function setOpts() {
    browser.storage.local.get("options").then((res) => {
        if (!res.options) {
            res.options = {};
        }
        if (!res.options.theme) {
            res.options.theme = "light";
        }
        if (!res.options.background_color) {
            res.options.background_color = "ffffff";
        }
        if (!res.options.font_color) {
            res.options.font_color = "000000";
        }
        if (!res.options.background_color_dark) {
            res.options.background_color_dark = "000000";
        }
        if (!res.options.font_color_dark) {
            res.options.font_color_dark = "ffffff";
        }
        if (!res.options.width) {
            res.options.height = 400;
        }
        if (!res.options.height) {
            res.options.height = 300;
        }
        if (!res.options.font_family) {
            res.options.font_family = "default";
        }
        if (!res.options.font_size) {
            res.options.font_size = 16;
        }
        if (!res.options.default_display) {
            res.options.default_display = "general_notes";
        }
        browser.storage.local.set(res);
    });
}
browser.runtime.onInstalled.addListener(setOpts);

function setOpts() {
    browser.storage.local.get("options").then((res) => {
        if (res.options === undefined) {
            res.options = {};
        }
        if (res.options.theme === undefined) {
            res.options.theme = "light";
        }
        if (res.options.background_color === undefined) {
            res.options.background_color = "ffffff";
        }
        if (res.options.font_color === undefined) {
            res.options.font_color = "000000";
        }
        if (res.options.background_color_dark === undefined) {
            res.options.background_color_dark = "000000";
        }
        if (res.options.font_color_dark === undefined) {
            res.options.font_color_dark = "ffffff";
        }
        if (res.options.width === undefined) {
            res.options.width = 400;
        }
        if (res.options.height === undefined) {
            res.options.height = 300;
        }
        if (res.options.font_family === undefined) {
            res.options.font_family = "default";
        }
        if (res.options.font_size === undefined) {
            res.options.font_size = 16;
        }
        if (res.options.font_css === undefined) {
            res.options.font_css = "";
        }
        if (res.options.default_display === undefined) {
            res.options.default_display = "general_notes";
        }
        if (res.options.ignore_subdomains === undefined) {
            res.options.ignore_subdomains = "";
        }
        if (res.site_notes === undefined) {
            res.site_notes = {};
        }
        browser.storage.local.set(res);
    });
}
browser.runtime.onInstalled.addListener(setOpts);

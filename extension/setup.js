function setOpts() {
    browser.storage.local.get("options").then((res) => {
        // if (res.options === undefined) {
        //     res.options = {};
        // }
        // if (res.options.theme === undefined) {
        //     res.options.theme = "light";
        // }
        // if (res.options.background_color === undefined) {
        //     res.options.background_color = "ffffff";
        // }
        // if (res.options.font_color === undefined) {
        //     res.options.font_color = "000000";
        // }
        // if (res.options.background_color_dark === undefined) {
        //     res.options.background_color_dark = "000000";
        // }
        // if (res.options.font_color_dark === undefined) {
        //     res.options.font_color_dark = "ffffff";
        // }
        // if (res.options.width === undefined) {
        //     res.options.width = 400;
        // }
        // if (res.options.height === undefined) {
        //     res.options.height = 300;
        // }
        // if (res.options.font_family === undefined) {
        //     res.options.font_family = "default";
        // }
        // if (res.options.font_size === undefined) {
        //     res.options.font_size = 16;
        // }
        // if (res.options.font_css === undefined) {
        //     res.options.font_css = "";
        // }
        // if (res.options.default_display === undefined) {
        //     res.options.default_display = "general_notes";
        // }
        // if (res.options.subdomains_mode === undefined) {
        //     res.options.subdomains_mode = "blacklist";
        // }
        // if (res.options.subdomains === undefined) {
        //     res.options.subdomains = "";
        // }
        // if (res.site_notes === undefined) {
        //     res.site_notes = {};
        // }
        res.options = typeof(res.options) === undefined ? {} : res.options;
        res.options.theme = typeof(res.options.theme) === undefined ? "light" : res.options.theme;
        res.options.background_color = typeof(res.options.background_color) === undefined ?  "ffffff" : res.options.background_color;
        res.options.font_color = typeof(res.options.font_color) === undefined ?  "000000" : res.options.font_color;
        res.options.background_color_dark = typeof(res.options.background_color_dark) === undefined ?  "000000" : res.options.background_color_dark;
        res.options.font_color_dark = typeof(res.options.font_color_dark) === undefined ?  "ffffff" : res.options.font_color_dark;
        res.options.width = typeof(res.options.width) === undefined ? 400 : res.options.width;
        res.options.height = typeof(res.options.height) === undefined ? 300 : res.options.height;
        res.options.font_family = typeof(res.options.font_family) === undefined ?  "default" : res.options.font_family;
        res.options.font_size = typeof(res.options.font_size) === undefined ? 16 : res.options.font_size;
        res.options.font_css = typeof(res.options.font_css) === undefined ?  "" : res.options.font_css;
        res.options.default_display = typeof(res.options.default_display) === undefined ?  "general_notes" : res.options.default_display;
        res.options.subdomains_mode = typeof(res.options.subdomains_mode) === undefined ?  "blacklist" : res.options.subdomains_mode;
        res.options.subdomains = typeof(res.options.subdomains) === undefined ?  "" : res.options.subdomains;
        res.site_notes = typeof(res.site_notes) === undefined ? {} : res.site_notes;
        browser.storage.local.set(res);
    });
}
browser.runtime.onInstalled.addListener(setOpts);

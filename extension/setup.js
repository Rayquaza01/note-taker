function setOpts() {
    browser.storage.local.get().then((res) => {
        res.options = typeof(res.options) === "undefined" ? {} : res.options;
        res.options.theme = typeof(res.options.theme) === "undefined" ? "light" : res.options.theme;
        res.options.background_color = typeof(res.options.background_color) === "undefined" ?  "ffffff" : res.options.background_color;
        res.options.font_color = typeof(res.options.font_color) === "undefined" ?  "000000" : res.options.font_color;
        res.options.background_color_dark = typeof(res.options.background_color_dark) === "undefined" ?  "000000" : res.options.background_color_dark;
        res.options.font_color_dark = typeof(res.options.font_color_dark) === "undefined" ?  "ffffff" : res.options.font_color_dark;
        res.options.width = typeof(res.options.width) === "undefined" ? 400 : res.options.width;
        res.options.height = typeof(res.options.height) === "undefined" ? 300 : res.options.height;
        res.options.font_family = typeof(res.options.font_family) === "undefined" ?  "default" : res.options.font_family;
        res.options.font_size = typeof(res.options.font_size) === "undefined" ? 16 : res.options.font_size;
        res.options.font_css = typeof(res.options.font_css) === "undefined" ?  "" : res.options.font_css;
        res.options.default_display = typeof(res.options.default_display) === "undefined" ?  "general_notes" : res.options.default_display;
        res.options.subdomains_mode = typeof(res.options.subdomains_mode) === "undefined" ?  "blacklist" : res.options.subdomains_mode;
        res.options.subdomains = typeof(res.options.subdomains) === "undefined" ?  [] : res.options.subdomains;
        res.site_notes = typeof(res.site_notes) === "undefined" ? {} : res.site_notes;
        browser.storage.local.set(res);
    });
}
browser.runtime.onInstalled.addListener(setOpts);

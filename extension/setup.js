function setOpts() {
    browser.storage.local.get().then((res) => {
        res.options = res.hasOwnProperty("options") ? res.options : {};
        res.options.theme = res.options.hasOwnProperty("theme") ? res.options.theme : "light";
        res.options.background_color = res.options.hasOwnProperty("background_color") ? res.options.background_color : "ffffff";
        res.options.font_color = res.options.hasOwnProperty("font_color") ? res.options.font_color : "000000";
        res.options.background_color_dark = res.options.hasOwnProperty("background_color_dark") ? res.options.background_color_dark : "000000";
        res.options.font_color_dark = res.options.hasOwnProperty("font_color_dark") ? res.options.font_color_dark : "ffffff";
        res.options.width = res.options.hasOwnProperty("width") ? res.options.width : 400;
        res.options.height = res.options.hasOwnProperty("height") ? res.options.height :300;
        res.options.font_family = res.options.hasOwnProperty("font_family") ? res.options.font_family : "default";
        res.options.font_size = res.options.hasOwnProperty("font_size") ? res.options.font_size :16;
        res.options.font_css = res.options.hasOwnProperty("font_css") ? res.options.font_css : "";
        res.options.default_display = res.options.hasOwnProperty("default_display") ? res.options.default_display : "general_notes";
        res.options.private_browsing = res.options.hasOwnProperty("private_browsing") ? res.options.private_browsing : false;
        res.options.subdomains_mode = res.options.hasOwnProperty("subdomains_mode") ? res.options.subdomains_mode : "blacklist";
        res.options.subdomains = res.options.hasOwnProperty("subdomains") ? res.options.subdomains : [];
        res.site_notes = res.hasOwnProperty("site_notes") ? res.site_notes : {};
        browser.storage.local.set(res);
    });
}
browser.runtime.onInstalled.addListener(setOpts);

async function siteParser(rawUrl, mode = "") {
    var res = await browser.storage.local.get("options");
    var url = new URL(rawUrl);
    if (url.protocol === "about:") {
        return url.protocol + url.pathname;
    } else if (url.protocol.match(/https?:/g)) {
        var site = psl.parse(url.hostname);
        if (res.options.per_site === "url" || mode === "url-notes") {
            return url.hostname + url.pathname;
        } else if (res.options.subdomains_mode === "blacklist") {
            if (res.options.subdomains.indexOf(site.domain) > -1 || res.options.subdomains.length === 0) {
                return site.domain;
            } else {
                return url.hostname;
            }
        } else if (res.options.subdomains_mode === "whitelist") {
            if (res.options.subdomains.indexOf(site.domain) > -1 || res.options.subdomains.length === 0) {
                return url.hostname;
            } else {
                return site.domain;
            }
        }
    } else {
        return "general_notes";
    }
}

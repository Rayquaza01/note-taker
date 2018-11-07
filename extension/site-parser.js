/* globals psl */
/* eslint no-unused-vars: 0 */
function allowedParams(search, allowed) {
    let params = search
        .substring(1)
        .split("&")
        .filter(item => allowed.indexOf(item.split("=")[0]) > -1);
    return params.length > 0 ? "?" + params.join("&") : "";
}

function siteParser(rawUrl, res, mode = null) {
    mode = mode === null ? res.options.default_display : mode;
    let url = new URL(rawUrl);
    if (url.protocol === "about:") {
        return url.protocol + url.pathname;
    } else if (url.protocol.match(/https?:/g)) {
        let site = psl.parse(url.hostname);
        if (mode === "url") {
            let params = allowedParams(url.search, res.options.get_params);
            return url.hostname + url.pathname + params;
        } else if (res.options.subdomains_mode === "blacklist") {
            if (
                res.options.subdomains.indexOf(site.domain) > -1 ||
                res.options.subdomains.length === 0
            ) {
                return site.domain;
            } else {
                return url.hostname;
            }
        } else if (res.options.subdomains_mode === "whitelist") {
            if (
                res.options.subdomains.indexOf(site.domain) > -1 ||
                res.options.subdomains.length === 0
            ) {
                return url.hostname;
            } else {
                return site.domain;
            }
        }
    } else {
        return "general_notes";
    }
}

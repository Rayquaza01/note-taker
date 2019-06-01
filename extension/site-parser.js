/* globals psl */
/* eslint no-unused-vars: 0 */
// (?:(?<=domain@)|^)param

function escapeRegex(regex) {
    return regex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function allowedParams(search, allowed, domain) {
    let params = search
        .substring(1)
        .split("&")
        .filter(item => allowed.indexOf(item.split("=")[0]) > -1);
    return params.length > 0 ? "?" + params.join("&") : "";
}

function siteParser(rawUrl, res, mode = null, ) {
    mode = mode === null ? res.options.default_display : mode;
    let response = { general: "general_notes" };
    let url = new URL(rawUrl);
    if (url.protocol === "about:") {
        response.url = url.protocol + url.pathname;
        response.domain = url.protocol + url.pathname;
    } else if (url.protocol.match(/https?:/g)) {
        let site = psl.parse(url.hostname);

        let params = allowedParams(url.search, res.options.get_params, site.domain);
        response.url = url.hostname + url.pathname + params;

        if (res.options.subdomains_mode === "blacklist") {
            if (
                res.options.subdomains.indexOf(site.domain) > -1 ||
                res.options.subdomains.length === 0
            ) {
                response.domain = site.domain;
            } else {
                response.domain = url.hostname;
            }
        } else if (res.options.subdomains_mode === "whitelist") {
            if (
                res.options.subdomains.indexOf(site.domain) > -1 ||
                res.options.subdomains.length === 0
            ) {
                response.domain = url.hostname;
            } else {
                response.domain = site.domain;
            }
        }
    } else {
        return [response.general, "general_notes"];
    }
    return [response[mode], mode];
}

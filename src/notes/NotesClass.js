import psl from "../psl.min.js";

// see Finding the Current Note in the manual
function findCurrentNote(url, options) {
    const { default_display, subdomains_mode, subdomains, get_params } = options;

    if (default_display === "general_notes") {
        return "general_notes";
    }

    let parsedURL;
    try {
        parsedURL = new URL(url);
    } catch {
        return url;
    }

    switch (default_display) {
        case "domain":
            if (parsedURL.protocol === "about:") {
                return parsedURL.protocol + parsedURL.pathname;
            }

            if (!parsedURL.protocol.match(/https?:/)) {
                return "general_notes";
            }

            const { domain } = psl.parse(url);

            if (subdomains.length === 0 || subdomains.includes(domain)) {
                return subdomains_mode === "whitelist" ? url.hostname : domain;
            } else {
                return subdomains_mode === "whitelist" ? domain : url.hostname;
            }
        case "url":
            if (parsedURL.protocol === "about:") {
                return parsedURL.protocol + parsedURL.pathname;
            }
            return;
    }
}

class Note {
    constructor(note, tab, mode) {
        this.note = note;
        this.tab = tab;
        this.mode = mode;
        this.location = "site_notes"; // the key where notes are stored in browser.storage
    }

    async init() {
        let { options } = await browser.storage.local.get("options");
        this.note = findCurrentNote(this.note, option);
    }

    async get() {
        let res = await browser.storage.local.get(this.location);
        return res.site_notes[this.note][this.tab];
    }

    async set(contents) {
        let res = await browser.storage.local.get(this.location);
        res.site_notes[this.note][this.tab] = contents;
        res.updated = Date.now();
        browser.storage.local.set(res);
    }
}

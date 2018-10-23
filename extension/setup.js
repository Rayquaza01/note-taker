/* globals siteParser */
function defaultValues(object, settings) {
    for (let key in settings) {
        if (!object.hasOwnProperty(key)) {
            object[key] = settings[key];
        }
    }
    return object;
}

async function setOpts() {
    let res = await browser.storage.local.get();
    res = defaultValues(res, {
        options: {},
        site_notes: {},
        general_notes: []
    });
    res.options = defaultValues(res.options, {
        theme: "light",
        background_color: "ffffff",
        font_color: "000000",
        background_color_dark: "000000",
        font_color_dark: "ffffff",
        width: 400,
        height: 300,
        font_family: "default",
        font_size: 16,
        font_css: "",
        default_display: "general_notes",
        private_browsing: false,
        subdomains_mode: "blacklist",
        subdomains: [],
        notification_badge: "disabled",
        notification_badge_color: "d90000",
        bullet_types: ["*", "-", "+"],
        get_params: ["q", "v"],
        tabnos: 1,
        padding: 5,
        text_direction: "ltr",
        browser_action_shortcut: "Alt+Shift+M",
        sidebar_action_shortcut: "Alt+Shift+N"
    });
    // compatibility for upgrading note storage from previous versions
    browser.commands.update({
        name: "_execute_browser_action",
        shortcut: res.options.browser_action_shortcut
    });
    browser.commands.update({
        name: "_execute_sidebar_action",
        shortcut: res.options.sidebar_action_shortcut
    });
    if (res.options.default_display === "site_notes") {
        res.options.default_display = res.options.per_site;
    }
    // res.options.per_site = res.options.hasOwnProperty("per_site") ? res.options.per_site : "domain";
    if (!Array.isArray(res.general_notes)) {
        res.general_notes = [res.general_notes];
    }
    for (var site in res.site_notes) {
        if (!Array.isArray(res.site_notes[site])) {
            res.site_notes[site] = [res.site_notes[site]];
        }
    }
    browser.storage.local.set(res);
}

function escapeRegex(regex) {
    return regex.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function setBadge(bullet_types, notification_badge, notes, tabId) {
    if (notes !== null && notes !== "") {
        if (notification_badge.indexOf("enabled") > -1) {
            browser.browserAction.setBadgeText({ text: "!", tabId: tabId });
        }
        if (notification_badge.indexOf("bullets") > -1) {
            let escaped = bullet_types.map(escapeRegex);
            let regex = new RegExp("^\\s*(" + escaped.join("|") + ").*$", "gm");
            let bulletCount = (notes.match(regex) || []).length;
            if (bulletCount > 0) {
                browser.browserAction.setBadgeText({
                    text: bulletCount.toString(),
                    tabId: tabId
                });
            } else if (notification_badge.indexOf("enabled") === -1) {
                browser.browserAction.setBadgeText({ text: "", tabId: tabId });
            }
        }
    } else {
        browser.browserAction.setBadgeText({ text: "", tabId: tabId });
    }
}

function setBadgeSite(res, tab) {
    let site = siteParser(tab.url, res.options.default_display, res);
    if (site === "general_notes") {
        setBadgeGeneral(res, tab);
    } else if (!tab.incognito || (res.options.private_browsing && tab.incognito)) {
        if (
            res.site_notes.hasOwnProperty(site) &&
            res.site_notes[site].hasOwnProperty(0)
        ) {
            setBadge(
                res.options.bullet_types,
                res.options.notification_badge,
                res.site_notes[site][0],
                tab.id
            );
        } else {
            browser.browserAction.setBadgeText({ text: "", tabId: tab.id });
        }
    } else {
        setBadgeGeneral(res, tab);
    }
}

function setBadgeGeneral(res, tab) {
    setBadge(
        res.options.bullet_types,
        res.options.notification_badge,
        res.general_notes[0],
        tab.id
    );
}

async function updateBadge() {
    let res = await browser.storage.local.get();
    let tabs = await browser.tabs.query({ active: true });
    if (res.options.notification_badge !== "disabled") {
        switch (res.options.default_display) {
            case "domain":
            case "url":
                tabs.forEach(setBadgeSite.bind(null, res));
                break;
            case "general_notes":
                tabs.forEach(setBadgeGeneral.bind(null, res));
                break;
        }
    } else {
        for (let tab of tabs) {
            browser.browserAction.setBadgeText({ text: "", tabId: tab.id });
        }
    }
}

browser.storage.local.get("options").then(res => {
    browser.browserAction.setBadgeBackgroundColor({
        color: "#" + res.options.notification_badge_color
    });
});
browser.tabs.onActivated.addListener(updateBadge);
browser.tabs.onUpdated.addListener(updateBadge);
browser.storage.onChanged.addListener(updateBadge);
browser.runtime.onInstalled.addListener(setOpts);

/* globals siteParser */
function compareObjs(obj1, obj2) {
    // Deep compare objects.
    // Works for arrays and objects containing items comparable with ===
    if (typeof obj1 === typeof obj2) {
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            // if both are arrays
            if (obj1.length === obj2.length) {
                // if arrays of same length
                for (let i = 0; i < obj1.length; i++) {
                    // return false on first failed comparison
                    if (!compareObjs(obj1[i], obj2[i])) {
                        return false;
                    }
                }
                // return true no failed comparisons
                return true;
            } else {
                // arrays not same length
                return false;
            }
        } else if (typeof obj1 === "object" && typeof obj2 === "object") {
            // typeof returns object for both objects and arrays.
            // Array.isArray detects only arrays, so only objects reach this point

            // get keys from objects and sort
            let keys1 = Object.keys(obj1).sort();
            let keys2 = Object.keys(obj2).sort();
            if (compareObjs(keys1, keys2)) {
                // get array of values
                let values1 = keys1.map(key => obj1[key]);
                let values2 = keys2.map(key => obj2[key]);
                return compareObjs(values1, values2);
            } else {
                // keys are different
                return false;
            }
        } else {
            // not array or object, return direct comparison
            return obj1 === obj2;
        }
    } else {
        // not array, not same type
        return false;
    }
}

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
        general_notes: [],
        sync: {},
        backup: {}
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
        sidebar_action_shortcut: "Alt+Shift+N",
        api: []
    });
    res.sync = defaultValues(res.sync, {
        interval: 0,
        notify: false
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
        if (notification_badge.includes("enabled")) {
            browser.browserAction.setBadgeText({ text: "!", tabId: tabId });
        }
        if (notification_badge.includes("bullets")) {
            let escaped = bullet_types.map(escapeRegex);
            let regex = new RegExp("^\\s*(" + escaped.join("|") + ").*$", "gm");
            let bulletCount = (notes.match(regex) || []).length;
            if (bulletCount > 0) {
                browser.browserAction.setBadgeText({
                    text: bulletCount.toString(),
                    tabId: tabId
                });
            } else if (!notification_badge.includes("enabled")) {
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

async function autoSync() {
    let local = await browser.storage.local.get(["general_notes", "site_notes"]);
    let sync = await browser.storage.sync.get(["general_notes", "site_notes"]);
    let res = await browser.storage.local.get(["sync", "backup"]);
    // compare sync and local against backup
    let localChanges = compareObjs(res.backup, local);
    let syncChanges = compareObjs(res.backup, sync);
    if (localChanges && syncChanges) {
        // conflict
    } else if (localChanges) {
        // remove old sync and backup
        await browser.storage.sync.remove(["general_notes", "site_notes"]);
        await browser.storage.local.remove("backup");
        // set sync and backup to local
        browser.storage.sync.set(local);
        browser.storage.local.set({ backup: local });
    } else if (syncChanges) {
        // remove old local and backup
        await browser.storage.local.remove(["general_notes", "site_notes"]);
        await browser.storage.local.remove("backup");
        // set local and backup to sync
        browser.storage.local.set(sync);
        browser.storage.local.set({ backup: sync });
    } else {
        // everything is already synced.
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

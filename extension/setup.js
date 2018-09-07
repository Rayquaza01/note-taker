async function setOpts() {
    var res = await browser.storage.local.get();
    res.options = res.hasOwnProperty("options") ? res.options : {};
    res.options.theme = res.options.hasOwnProperty("theme") ? res.options.theme : "light";
    res.options.background_color = res.options.hasOwnProperty("background_color") ? res.options.background_color : "ffffff";
    res.options.font_color = res.options.hasOwnProperty("font_color") ? res.options.font_color : "000000";
    res.options.background_color_dark = res.options.hasOwnProperty("background_color_dark") ? res.options.background_color_dark : "000000";
    res.options.font_color_dark = res.options.hasOwnProperty("font_color_dark") ? res.options.font_color_dark : "ffffff";
    res.options.width = res.options.hasOwnProperty("width") ? res.options.width : 400;
    res.options.height = res.options.hasOwnProperty("height") ? res.options.height : 300;
    res.options.font_family = res.options.hasOwnProperty("font_family") ? res.options.font_family : "default";
    res.options.font_size = res.options.hasOwnProperty("font_size") ? res.options.font_size : 16;
    res.options.font_css = res.options.hasOwnProperty("font_css") ? res.options.font_css : "";
    res.options.default_display = res.options.hasOwnProperty("default_display") ? res.options.default_display : "general_notes";
    if (res.options.default_display === "site_notes") {
        res.options.default_display = res.options.per_site;
    }
    // res.options.per_site = res.options.hasOwnProperty("per_site") ? res.options.per_site : "domain";
    res.options.private_browsing = res.options.hasOwnProperty("private_browsing") ? res.options.private_browsing : false;
    res.options.subdomains_mode = res.options.hasOwnProperty("subdomains_mode") ? res.options.subdomains_mode : "blacklist";
    res.options.subdomains = res.options.hasOwnProperty("subdomains") ? res.options.subdomains : [];
    res.options.notification_badge = res.options.hasOwnProperty("notification_badge") ? res.options.notification_badge : "disabled";
    res.options.notification_badge_color = res.options.hasOwnProperty("notification_badge_color") ? res.options.notification_badge_color : "d90000";
    res.options.bullet_types = res.options.hasOwnProperty("bullet_types") ? res.options.bullet_types : ["*", "-", "+"];
    res.options.get_params = res.options.hasOwnProperty("get_params") ? res.options.get_params : ["q", "v"];
    res.options.tabnos = res.options.hasOwnProperty("tabnos") ? res.options.tabnos : 1;
    res.options.padding = res.options.hasOwnProperty("padding") ? res.options.padding : 5;
    res.options.text_direction = res.options.hasOwnProperty("text_direction") ? res.options.text_direction : "ltr";
    res.site_notes = res.hasOwnProperty("site_notes") ? res.site_notes : {};
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

function bulletCounter(bulletTypes, note) {
    var bulletCount = 0;
    var escaped = bulletTypes.map(escapeRegex);
    var regex = new RegExp("^\\s*(" + escaped.join("|") + ")");
    for (var line of note.split("\n")) {
        if (line.search(regex) > -1) {
            ++bulletCount;
        }
    }
    return bulletCount;
}

function setBadge(bullet_types, notification_badge, notes, tabId) {
    if (notes !== null && notes !== "") {
        if (notification_badge.indexOf("enabled") > -1) {
            browser.browserAction.setBadgeText({text: "!", tabId: tabId});
        }
        if (notification_badge.indexOf("bullets") > -1) {
            var bulletCount = bulletCounter(bullet_types, notes);
            if (bulletCount > 0) {
                browser.browserAction.setBadgeText({text: bulletCount.toString(), tabId: tabId});
            } else if (notification_badge.indexOf("enabled") === -1) {
                browser.browserAction.setBadgeText({text: "", tabId: tabId});
            }
        }
    } else {
        browser.browserAction.setBadgeText({text: "", tabId: tabId});
    }
}

async function setBadgeSite(tab) {
    var res = await browser.storage.local.get(["site_notes", "options"]);
    var site = await siteParser(tab.url, res.options.default_display);
    if (site === "general_notes") {
        setBadgeGeneral(tab);
    } else if (!tab.incognito || (res.options.private_browsing && tab.incognito)) {
        if (res.site_notes.hasOwnProperty(site)) {
            setBadge(res.options.bullet_types, res.options.notification_badge, res.site_notes[site][0], tab.id);
        } else {
            browser.browserAction.setBadgeText({text: "", tabId: tab.id});
        }
    } else {
        setBadgeGeneral(tab);
    }
}

async function setBadgeGeneral(tab) {
    var res = await browser.storage.local.get(["general_notes", "options"]);
    setBadge(res.options.bullet_types, res.options.notification_badge, res.general_notes[0], tab.id);
}

async function updateBadge() {
    var res = await browser.storage.local.get("options");
    var tabs = await browser.tabs.query({active: true});
    if (res.options.notification_badge !== "disabled") {
        switch (res.options.default_display) {
        case "domain":
        case "url":
            tabs.forEach(setBadgeSite);
            break;
        case "general_notes":
            tabs.forEach(setBadgeGeneral);
            break;
        }
    } else {
        var allTabs = await browser.tabs.query({});
        for (var tab of allTabs) {
            browser.browserAction.setBadgeText({text: "", tabId: tab.id});
        }
    }
}

browser.storage.local.get("options").then((res) => {
    browser.browserAction.setBadgeBackgroundColor({color: "#" + res.options.notification_badge_color});
});
browser.tabs.onActivated.addListener(updateBadge);
browser.tabs.onUpdated.addListener(updateBadge);
browser.storage.onChanged.addListener(updateBadge);
browser.runtime.onInstalled.addListener(setOpts);

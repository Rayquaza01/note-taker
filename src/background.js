const defaults = require("./assets/defaults.json")

function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

function defaultValues(object, settings) {
    for (let key of Object.keys(settings)) {
        if (!hasOwnProperty(object, key)) {
            object[key] = settings[key];
        }
    }
    return object;
}

function migrate(storage) {
    if (hasOwnProperty(storage, "general_notes")) {
        storage.site_notes.general_notes = storage.general_notes;
        delete storage.general_notes;
    }
    return storage;
}

async function setOptions() {
    let res = browser.storage.local.get();
    res = migrate(storage);
    res = defaultValues(res, {
        options: {},
        site_notes: {},
        backup: {}
    });
    res.site_notes = defaultValues(res.site_notes, {
        general_notes: ["Hello, world!"]
    });
    res.options = defaultValues(res.options, defaults);
    res.backup = defaultValues(res.backup, res.site_notes);

    let sync = browser.storage.sync.get();
    sync = migrate(sync);

    browser.storage.local.set(res);
    browser.storage.sync.set(sync);
}

browser.storage.local.get("options").then(res => {
    browser.browserAction.setBadgeBackgroundColor({
        color: "#" + res.options.notification_badge_color
    });
});
browser.runtime.onInstalled.addListener(setOptions);

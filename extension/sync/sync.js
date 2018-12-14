/* eslint-env webextensions */
/* eslint no-unused-vars: 0 */
/* globals compare */

async function sync() {
    // local contains current locally stored notes
    let local = await browser.storage.local.get(["general_notes", "site_notes"]);
    // sync contains current remotely stored notes
    let sync = await browser.storage.sync.get(["general_notes", "site_notes"]);
    // res.backup contains a local backup from previous sync
    let res = await browser.storage.local.get("backup");
    // compare sync and local against backup
    let localChanges = !compare.compare(res.backup, local); // true if local and backup are different
    let syncChanges = !compare.compare(res.backup, sync); // true if sync and backup are different
    if (localChanges && syncChanges) {
        // conflict, both were changed
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

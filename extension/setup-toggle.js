function toggleSidebar() {
    var views = browser.extension.getViews({type: "sidebar", windowId: currentWindowId});
    console.log(views);
    if (views.length === 0) {
        browser.sidebarAction.open();
    } else {
        browser.sidebarAction.close();
    }
}
function toolbarAction(mode) {
    if (mode === "sidebar") {
        browser.browserAction.setPopup({popup: ""});
    } else if (mode === "popup") {
        browser.browserAction.setPopup({popup: "notes.html"});
    }
}
async function windowFocus() {
    var curWin = await browser.windows.getCurrent();
    var currentWindowId = curWin.id;
    console.log(currentWindowId);
}
function isSidebarOpen() {
    browser.windows.getCurrent().then((curWin) => {
        var views = browser.extension.getViews({type: "sidebar", windowId: curWin.id});
        if (views.length === 0) {
            return false;
        } else {
            return true;
        }
    });
}
browser.windows.onFocusChanged.addListener(windowFocus);
browser.browserAction.onClicked.addListener(toggleSidebar);
browser.runtime.onMessage.addListener(toolbarAction);

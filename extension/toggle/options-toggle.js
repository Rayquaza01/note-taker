const toolbar_action = document.getElementById("toolbar-action");
        toolbar_action: toolbar_action.value || "popup",
        toolbar_action.value = res.options.toolbar_action;
function openToolbar() {
    browser.runtime.sendMessage(toolbar_action.value);
}
// sidebar toggle
toolbar_action.addEventListener("input", openToolbar)

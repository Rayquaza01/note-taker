function setDefaults(info) {
    console.log(info);
    if (info.reason === "install" || "update") {
        browser.storage.local.get().then((res) => {
            if (!res.options) {
                res.options = {
                    background_color: "ffffff",
                    font_color: "000000",
                    width: 400,
                    height: 300,
                    font_family: "default",
                    font_size: 16
                }
                browser.storage.local.set(res)
            }
        });
    }
}
browser.runtime.onInstalled.addListener(setDefaults);

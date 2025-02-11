import { Extension } from "webextension-polyfill";

export function getContext(): Extension.ViewType | undefined {
    for (let context of ["popup", "sidebar", "tab"] as Extension.ViewType[]) {
        if (browser.extension.getViews({ type: context }).indexOf(window) > -1) {
            return context;
        }
    }
    return undefined;
}


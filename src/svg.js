function loadSVG(svg) {
    return new DOMParser().parseFromString(svg, "image/svg+xml").documentElement;
}

export const Icons = {
    icon: loadSVG(require("svg-inline-loader?!./icons/icon.svg")),
    backburger: loadSVG(require("svg-inline-loader?!./icons/mdi/backburger.svg")),
    delete: loadSVG(require("svg-inline-loader?!./icons/mdi/delete.svg")),
    menu: loadSVG(require("svg-inline-loader?!./icons/mdi/menu.svg")),
    openInNew: loadSVG(require("svg-inline-loader?!./icons/mdi/open-in-new.svg")),
    plus: loadSVG(require("svg-inline-loader?!./icons/mdi/plus.svg")),
    settings: loadSVG(require("svg-inline-loader?!./icons/mdi/settings.svg")),
    sync: loadSVG(require("svg-inline-loader?!./icons/mdi/sync.svg")),
    syncAlert: loadSVG(require("svg-inline-loader?!./icons/mdi/sync-alert.svg")),
    themeLightDark: loadSVG(require("svg-inline-loader?!./icons/mdi/theme-light-dark.svg"))
};

export function insertSVG() {
    for (let item of [...document.querySelectorAll(".svg")]) {
        item.appendChild(Icons[item.dataset.icon]);
    }
}

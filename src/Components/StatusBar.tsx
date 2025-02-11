import React from "react";
require("./StatusBar.css");

import { Icon } from "./Icon";

import { mdiMenu, mdiThemeLightDark, mdiCog } from "@mdi/js";

export interface StatusBarProps {
    current: string
    onMenuClick?: () => void
}

export function StatusBar(props: StatusBarProps) {
    return (
        <div className="StatusBar">
            <div className="StatusBar__Menu" role="button" onClick={props.onMenuClick}>
                <Icon icon={mdiMenu} title="Menu" />
                <span className="StatusBar__current">{ props.current }</span>
            </div>
            <div className="StatusBar__Buttons">
                <Icon icon={mdiThemeLightDark} title="Toggle Theme" />
                <Icon icon={mdiCog} title="Settings" />
            </div>
        </div>
    );
}

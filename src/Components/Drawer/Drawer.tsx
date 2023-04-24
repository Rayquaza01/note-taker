import React from "react";
import "./Drawer.css";

export interface DrawerProps {
    children?: React.ReactNode
    open: boolean
    width: number | string

    onOverlayClick?: () => void
}

export function Drawer(props: DrawerProps) {
    return (
        <div className="reactDrawerOverlay" style={{ width: props.open ? "100vw" : 0 }} onClick={props.onOverlayClick}>
            <div className="reactDrawer" style={{ width: props.open ? props.width : 0 }} onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    );
}

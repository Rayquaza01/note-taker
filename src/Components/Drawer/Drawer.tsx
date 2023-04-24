import React from "react";
import "./Drawer.css";

export interface DrawerProps {
    children?: React.ReactNode;
    open: boolean
    width: number | string;
}

export function Drawer(props: DrawerProps) {
    return (
        <div className="reactDrawer" style={{ width: props.open ? props.width : 0 }}>
            {props.children}
        </div>
    );
}

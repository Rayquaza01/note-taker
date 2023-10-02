import React from "react";
import { Modal } from "../Modal";
import "./Drawer.css";

export interface DrawerProps {
    open: boolean
    onModalClick: () => void
    children: React.ReactNode
    anchor: "left" | "top"
}

export function Drawer(props: DrawerProps) {
    return (
        <Modal open={props.open} onClick={props.onModalClick} type="drawer" anchor={props.anchor}>
            <div className="drawer">
                { props.children }
            </div>
        </Modal>
    );
}

import React from "react";

import { Modal } from "../Modal";

import "./Dialog.css";

export interface DialogProps {
    open: boolean
    children: React.ReactNode
    anchor: "top" | "left"
    onModalClick: () => void
}

export function Dialog(props: DialogProps) {
    return (
        <Modal open={props.open} onClick={props.onModalClick} type="dialog" anchor={props.anchor}>
            <div className="dialog">
                {props.children}
            </div>
        </Modal>
    );
}

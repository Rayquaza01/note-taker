import React from "react";
import "./Modal.css";

export interface ModalProps {
    open: boolean;
    onClick: () => void;
    children: React.ReactNode;
    type: "dialog" | "drawer",
    anchor: "top" | "left"
}

export function Modal(props: ModalProps) {
    function onClick(e: React.MouseEvent) {
        if (e.target === e.currentTarget) {
            props.onClick();
        }
    }

    const classes = "modal modal-" + props.anchor;

    return (
        <div className={classes} onClick={onClick} data-open={props.open} data-type={props.type}>
            { props.children }
        </div>
    );
}

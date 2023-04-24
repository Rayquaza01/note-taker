import React from "react";
import "./Dialog.css";

export interface DialogProps {
    open: boolean
    children?: React.ReactNode

    onOverlayClick?: () => void
}

export function Dialog(props: DialogProps) {
    return (
        <div className="reactDialogOverlay" style={{ width: props.open ? "100vw" : 0 }} onClick={props.onOverlayClick}>
            <div className="reactDialog" onClick={e => e.stopPropagation()}>
                {props.children}
            </div>
        </div>
    );
}

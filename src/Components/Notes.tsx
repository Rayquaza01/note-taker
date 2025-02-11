import React, { useMemo } from "react";
import { getContext } from "../getContext";
require("./Notes.css");

export interface NotesTextboxProps {
    height: number
    width: number
    value: string
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export function NotesTextbox(props: NotesTextboxProps) {
    const context = useMemo(() => getContext(), []);

    return (
        <textarea
            className="NotesTextbox"
            value={props.value}
            onChange={props.onChange}
            style={context === "popup" ? { width: props.width, height: props.height } : {}}>
        </textarea>
    );
}

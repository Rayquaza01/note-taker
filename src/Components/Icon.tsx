import React from "react";
require("./Icon.css");

export interface IconProps {
    icon: string
    color?: string
    name?: string

    title?: string

    onClick?: () => void
}

export function Icon(props: IconProps) {
    let classes = "";
    if (props.name) {
        classes = "icon " + props.name;
    } else {
        classes = "icon";
    }

    return (
        <span className="IconWrapper" title={props.title} onClick={props.onClick}>
            <svg className={classes}>
                <path d={props.icon}></path>
            </svg>
        </span>
    );
}

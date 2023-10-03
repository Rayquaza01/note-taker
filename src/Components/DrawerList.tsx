import React, { useState } from "react";
import "./DrawerList.css";

export interface DrawerListItemProps {
    name: string
}

export function DrawerListItem(props: DrawerListItemProps) {
    return (
        <div className="drawer-list-item">
            <span className="name">{ props.name }</span>
            <button>Rename</button>
            <button>Delete</button>
        </div>
    );
}

const items = [
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" }
];

export interface DrawerListProps {

}

export function DrawerList(props: DrawerListProps) {
    const [search, setSearch] = useState("");

    return (
        <div className="drawer-list">
            <input type="text" className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"></input>
            {
                items.filter(item => search === "" || search.includes(item.name))
                    .map(item => <DrawerListItem {...item} key={item.name} />)
            }
        </div>
    );
}

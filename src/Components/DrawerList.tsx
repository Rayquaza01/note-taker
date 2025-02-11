import React, { useState } from "react";
import "./DrawerList.css";

import { Note } from "../Notes";
import { useStorageLocal } from "../Hooks/useStorage";

export interface DrawerListItemProps {
    name: string
}

export function DrawerListItem(props: DrawerListItemProps) {
    return (
        <div className="DrawerList__Item">
            <span className="DrawerList__Item-name">{ props.name }</span>
            <button>Rename</button>
            <button>Delete</button>
        </div>
    );
}

export interface DrawerListProps {

}

export function DrawerList(props: DrawerListProps) {
    const [search, setSearch] = useState("");
    const notes = useStorageLocal<Note[]>("notes", []);

    return (
        <div className="DrawerList">
            <input type="text" className="DrawerList__search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"></input>
            {
                notes.filter(item => search === "" || search.includes(item.name))
                    .map(item => <DrawerListItem {...item} key={item.name} />)
            }
        </div>
    );
}

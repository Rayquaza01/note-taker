import React, { useMemo, useState } from "react";
import "./DrawerList.css";

import { Note } from "../Notes";

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
    notes: Note[]
}

export function DrawerList(props: DrawerListProps) {
    const [search, setSearch] = useState("");
    const visibleNotes = useMemo(() => {
        return props.notes
            .filter(item => search === "" || search.includes(item.name))
            .sort((a, b) => {
                if (a.name < b.name) {
                    return 1;
                } else if (a.name > b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
    }, [props.notes, search])

    return (
        <div className="DrawerList">
            <input type="text" className="DrawerList__search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search"></input>
            {
                visibleNotes.map(item => <DrawerListItem {...item} key={item.name} />)
            }
        </div>
    );
}

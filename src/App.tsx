import React, { useState } from "react";
import "./App.css";

import { Drawer } from "./Components/Modal/Drawer/Drawer";
import { Dialog } from "./Components/Modal/Dialog/Dialog";

import { DrawerList } from "./Components/DrawerList";
import { StatusBar } from "./Components/StatusBar";

import { useStorageLocal } from "./Hooks/useStorage";

import { Note } from "./Notes";

export function App() {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const notes = useStorageLocal<Note[]>("notes", []);

    const [currentNote, setCurrentNote] = useState<string>("Default");

    function toggleDrawer() {
        setOpen(!open);
    }

    function toggleDialog() {
        setOpenDialog(!openDialog);
    }

    function newNote() {
        notes.push({ name: "hi", value: ["ok"] })
        browser.storage.local.set({ notes })
    }

    return (
        <div>
            <button onClick={toggleDrawer}>Toggle</button>
            <button onClick={toggleDialog}>Toggle Dialog</button>
            <StatusBar current={currentNote} onMenuClick={toggleDrawer} />
            <Drawer open={open} onModalClick={() => setOpen(false)} anchor="left">
                <button onClick={toggleDrawer}>Toggle</button>
                <button onClick={newNote}>New Note</button>
                <DrawerList />
            </Drawer>
            <Dialog open={openDialog} onModalClick={() => setOpenDialog(false)} anchor="left">
                <button onClick={toggleDialog}>Toggle Dialog</button>
            </Dialog>
        </div>
    );
}

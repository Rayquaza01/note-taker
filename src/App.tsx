import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import { Drawer } from "./Components/Modal/Drawer/Drawer";
import { Dialog } from "./Components/Modal/Dialog/Dialog";

import { DrawerList } from "./Components/DrawerList";
import { StatusBar } from "./Components/StatusBar";

import { NotesTextbox } from "./Components/Notes";

import { useStorageLocal, putStorageLocal } from "./Hooks/useStorage";

import { Note } from "./Notes";

export function App() {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    const [notes, notesReady] = useStorageLocal<Note[]>("notes", []);

    const [currentNote, setCurrentNote] = useState<string>("Default");
    const [currentTab, setCurrentTab] = useState<number>(0);
    const [currentText, setCurrentText] = useState<string>("");

    function toggleDrawer() {
        setOpen(!open);
    }

    function toggleDialog() {
        setOpenDialog(!openDialog);
    }

    function newNote() {
        notes.push({ name: "hi", value: ["ok"], modified: new Date() })
        // putStorageLocal("notes", notes);
    }

    function LoadCurrentNote() {
        const cur = notes.find(i => i.name === currentNote)
        if (cur) {
            console.log("Current note:", cur);
            setCurrentText(cur.value[currentTab]);
        }
    }

    function UpdateNoteStorage() {
        const cur = notes.findIndex(i => i.name === currentNote)

        if (cur > -1) {
            notes[cur].value[currentTab] = currentText

            console.log("Saving changes");
        } else {
            notes.push({ name: currentNote, value: [currentText], modified: new Date() })
        }

        putStorageLocal("notes", notes);
    }

    useEffect(() => { notesReady && LoadCurrentNote() }, [notesReady]);
    useEffect(LoadCurrentNote, [currentNote, currentTab]);
    useEffect(UpdateNoteStorage, [currentText]);

    return (
        <div className="App">
            <NotesTextbox width={500} height={300} value={currentText} onChange={(e) => setCurrentText(e.target.value)} />
            <StatusBar current={currentNote} onMenuClick={toggleDrawer} />
            <Drawer open={open} onModalClick={() => setOpen(false)} anchor="left">
                <button onClick={toggleDrawer}>Toggle</button>
                <button onClick={newNote}>New Note</button>
                <DrawerList notes={notes} />
            </Drawer>
            <Dialog open={openDialog} onModalClick={() => setOpenDialog(false)} anchor="left">
                <button onClick={toggleDialog}>Toggle Dialog</button>
            </Dialog>
        </div>
    );
}

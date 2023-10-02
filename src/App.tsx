import React, { useState } from "react";
import "./App.css";

import { Drawer } from "./Components/Modal/Drawer/Drawer";
import { Dialog } from "./Components/Modal/Dialog/Dialog";

export function App() {
    const [open, setOpen] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);

    function toggleDrawer() {
        setOpen(!open);
    }

    function toggleDialog() {
        setOpenDialog(!openDialog);
    }

    return (
        <div>
            <button onClick={toggleDrawer}>Toggle</button>
            <button onClick={toggleDialog}>Toggle Dialog</button>
            <Drawer open={open} onModalClick={() => setOpen(false)} anchor="left">
                <button onClick={toggleDrawer}>Toggle</button>
                Hi!
                <button onClick={toggleDialog}>Toggle Dialog</button>
            </Drawer>
            <Dialog open={openDialog} onModalClick={() => setOpenDialog(false)} anchor="top">
                <button onClick={toggleDialog}>Toggle Dialog</button>
            </Dialog>
        </div>
    );
}

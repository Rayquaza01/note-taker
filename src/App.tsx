import React, { useState } from "react";
import "./App.css";

import { Drawer } from "./Components/Drawer/Drawer";

export function App() {
    const [open, setOpen] = useState(false);

    function toggleDrawer() {
        setOpen(!open);
    }

    return (
        <div>
            <button onClick={toggleDrawer}>Toggle</button>
            <Drawer open={open} width={500}>
                <button onClick={toggleDrawer}>Toggle</button>
                Hi!
            </Drawer>
        </div>
    );
}

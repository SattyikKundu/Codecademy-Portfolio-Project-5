import React from "react";

import Menu from "../components/menu/menu.jsx";

import './App.css';

const App = () => {
    //console.log("App rendered");
    return (
        <div className="app-body">
            <Menu />
            <h1>Googles Toodles...</h1>
        </div>
    );
}
export default App;
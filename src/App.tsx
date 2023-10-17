import { useState } from "react";
import "./App.css";
import Menu from "./views/Menu";
import Tetris from "./views/Tetris";
import Scoreboard from "./views/Scoreboard";

export default function App() {
    const [screen, setScreen] = useState("menu");
    const [selectedLevel, setSelectedLevel] = useState("");

    return (
        <div className="content">
            {screen === "menu" && <Menu setScreen={setScreen} setSelectedLevel={setSelectedLevel} />}
            {screen === "tetris" && <Tetris setScreen={setScreen} selectedLevel={selectedLevel} />}
            {screen === "scoreboard" && <Scoreboard setScreen={setScreen} />}
        </div>
    );
}

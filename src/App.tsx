import { useEffect, useState } from "react";
import "./App.css";
import Menu from "./views/Menu";
import Tetris from "./views/Tetris";
import Scoreboard from "./views/Scoreboard";

export default function App() {
    const [screen, setScreen] = useState("menu");
    const [selectedLevel, setSelectedLevel] = useState("");

    useEffect(() => {
        const ambienceAudio = new Audio("/audio/ambience.ogg");
        ambienceAudio.loop = true;
        ambienceAudio.play();

        return () => {
            ambienceAudio.pause();
            ambienceAudio.currentTime = 0;
        };
    }, [screen]);

    return (
        <div className="content">
            {screen === "menu" && <Menu setScreen={setScreen} setSelectedLevel={setSelectedLevel} />}
            {screen === "tetris" && <Tetris setScreen={setScreen} selectedLevel={selectedLevel} />}
            {screen === "scoreboard" && <Scoreboard setScreen={setScreen} />}
        </div>
    );
}

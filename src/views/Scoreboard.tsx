import { useEffect, useRef, useState } from "react";
import { DocumentData, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";

export default function Scoreboard({
    setScreen,
}: {
    setScreen: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [scores, setScores] = useState<DocumentData[]>([]);
    const [value, setValue] = useState<string>("");

    const inputValueRef = useRef<HTMLInputElement>(null);
    const keyAudio = new Audio("/audio/key.ogg");

    const getScores = async () => {
        const querySnapshot = await getDocs(
            query(collection(db, "scoreboard"), orderBy("score", "desc"), limit(10))
        );

        const docData = querySnapshot.docs.map((doc) => doc.data());

        setScores(docData);
    };

    const handleResponse = () => {
        if (value === "yes") return setScreen("tetris");
        if (value === "no") return setScreen("menu");
    };

    useEffect(() => {
        getScores();

        window.addEventListener("click", () => inputValueRef.current?.focus());
        inputValueRef.current?.focus();
    }, []);

    return (
        <div className="scoreboard-container">
            <br />
            <br />
            <div className="column-container">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="name-column">
                    NAME
                    <br />
                    {scores.map(({ name }, i) => (
                        <div key={i}>{name}</div>
                    ))}
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="level-column">
                    LEVEL <br />
                    {scores.map(({ level }, i) => (
                        <div key={i}>{level}</div>
                    ))}
                </div>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="score-column">
                    SCORE
                    <br />
                    {scores.map(({ score }, i) => (
                        <div key={i}>{score}</div>
                    ))}
                </div>
                &nbsp;
                <div className="best-column">
                    <br />
                    {scores.map((_, i) => (
                        <div key={i}>{i === 0 && "**"}</div>
                    ))}
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <span className="insert-name">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                START AGAIN? (YES/NO) - {value.toUpperCase()}
                <span className="cursor">◼</span>
                <input
                    onChange={(e) => {
                        keyAudio.play();
                        setValue(e.currentTarget.value);
                    }}
                    value={value}
                    type="text"
                    ref={inputValueRef}
                    onKeyDown={(e) => e.key === "Enter" && handleResponse()}
                />
            </span>
        </div>
    );
}

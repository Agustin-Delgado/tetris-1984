import { useEffect, useRef, useState } from "react";

export default function Menu({
    setScreen,
    setSelectedLevel,
}: {
    setScreen: React.Dispatch<React.SetStateAction<string>>;
    setSelectedLevel: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [level, setLevel] = useState("");
    const inputLevelRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: { currentTarget: { value: string } }) => {
        const regex = /^$|^[0-9]+$/;
        if (!regex.test(e.currentTarget.value)) return;
        setLevel(e.currentTarget.value);
    };

    const handleSubmit = (e: { key: string }) => {
        if (e.key !== "Enter" || !level) return;
        setScreen("tetris");
        setSelectedLevel(level);
    };

    useEffect(() => {
        window.addEventListener("click", () => inputLevelRef.current?.focus());
        inputLevelRef.current?.focus();
    }, []);

    return (
        <div className="menu-container">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            ∎&nbsp;∎
            <br />T E T R I S
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;∎&nbsp;∎
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
            <span className="insert-level">
                YOUR LEVEL? (0-9) -&nbsp;{level}
                <span className="cursor">◼</span>
                <input
                    onChange={handleChange}
                    value={level}
                    type="text"
                    maxLength={1}
                    ref={inputLevelRef}
                    onKeyDown={handleSubmit}
                />
            </span>
        </div>
    );
}

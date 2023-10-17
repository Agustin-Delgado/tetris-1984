import { useEffect, useRef, useState } from "react";
import { BH, BW } from "../constants/boardSize";
import { getFormattedBoard } from "../utils/getFormattedBoard";
import { getRandomPiece } from "../utils/getRandomPiece";
import { reverseRows } from "../utils/reverseRows";
import { transpose } from "../utils/transpose";
import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const matrix = Array.from({ length: BH }, () => Array.from({ length: BW }).fill(-1)) as number[][];

export default function Tetris({
    selectedLevel,
    setScreen,
}: {
    selectedLevel: string;
    setScreen: React.Dispatch<React.SetStateAction<string>>;
}) {
    const [board, setBoard] = useState(matrix);
    const [name, setName] = useState<string>("");
    const [gameOver, setGameOver] = useState(false);
    const [comingPiece, setComingPiece] = useState<number[][] | null>(null);
    const [isShowNextEnabled, setIsShowNextEnabled] = useState<boolean>(false);
    const [score, setScore] = useState({
        score: 0,
        fullLines: 0,
    });

    const boardRef = useRef(board);
    const currentPieceRef = useRef<number[][] | null>(null);
    const currentPiecePositionRef = useRef<number[][]>([]);
    const inputNameRef = useRef<HTMLInputElement>(null);

    const getNewPiece = () => {
        const newPiece = getRandomPiece();
        const nextPiece = getRandomPiece();

        if (comingPiece !== null) {
            currentPieceRef.current = comingPiece;
            setComingPiece(nextPiece);
        } else {
            currentPieceRef.current = newPiece;
            setComingPiece(nextPiece);
        }

        const centeredPieceInBoardAxes = getCenteredPieceInBoardAxes();

        if (!centeredPieceInBoardAxes) return;

        const gameOver = checkPlaceOcuppied(centeredPieceInBoardAxes);

        if (gameOver) {
            setGameOver(true);
            return;
        }

        updateBoard(centeredPieceInBoardAxes);
    };

    const updateBoard = (pieceAxes: number[][]) => {
        currentPiecePositionRef.current = pieceAxes;

        setBoard((prevBoard) => {
            const updatedBoard = prevBoard.map((rows) => rows.slice()); //Deep copy of board
            for (let i = 0; i < pieceAxes.length; i++) {
                updatedBoard[pieceAxes[i][0]][pieceAxes[i][1]] = 1;
            }
            boardRef.current = prevBoard;
            return updatedBoard;
        });
    };

    const getPieceWidth = () => {
        if (!currentPieceRef.current) return;
        const formattedPiece = getFormattedPiece(currentPieceRef.current);
        const pieceWidth = formattedPiece[0].length;
        return pieceWidth;
    };

    const getCenteredPieceInBoardAxes = () => {
        if (!currentPieceRef.current) return;

        const pieceAxes = getPieceAxes(currentPieceRef.current);
        const pieceWidth = getPieceWidth();
        const centeredPieceInBoardAxes = [];

        for (let i = 0; i < pieceAxes.length; i++) {
            if (!!pieceWidth && pieceWidth > 3) {
                centeredPieceInBoardAxes.push([pieceAxes[i][0], BW / 2 - 1 + pieceAxes[i][1] - 1]);
            } else {
                centeredPieceInBoardAxes.push([pieceAxes[i][0], BW / 2 - 1 + pieceAxes[i][1]]);
            }
        }

        return centeredPieceInBoardAxes;
    };

    const getPieceAxes = (piece: number[][]) => {
        const pieceAxes = [];
        for (let i = 0; i < piece.length; i++) {
            let index = piece[i].indexOf(1);

            while (index != -1) {
                pieceAxes.push([i, index]);
                index = piece[i].indexOf(1, index + 1);
            }
        }
        return pieceAxes;
    };

    const getFormattedPiece = (piece: number[][]) => {
        const formattedXAxe = [];
        const formattedYAxe = [];

        for (let i = 0; i < piece.length; i++) {
            const someRowWithOne = piece[i].some((value) => value === 1);
            if (someRowWithOne) formattedXAxe.push(piece[i]);
        }
        const transposeFormattedXAxe = transpose(formattedXAxe);

        for (let i = 0; i < transposeFormattedXAxe.length; i++) {
            const someRowWithOne = transposeFormattedXAxe[i].some((value) => value === 1);
            if (someRowWithOne) formattedYAxe.push(transposeFormattedXAxe[i]);
        }
        return transpose(formattedYAxe);
    };

    const getNewPiecePosition = (direction: "left" | "right" | "bottom") => {
        const pieceInBoardAxes = currentPiecePositionRef.current;
        const displacedPieceInBoardAxes = [];

        for (let i = 0; i < pieceInBoardAxes.length; i++) {
            if (direction === "left") {
                displacedPieceInBoardAxes.push([pieceInBoardAxes[i][0], pieceInBoardAxes[i][1] - 1]);
            } else if (direction === "right") {
                displacedPieceInBoardAxes.push([pieceInBoardAxes[i][0], pieceInBoardAxes[i][1] + 1]);
            } else {
                displacedPieceInBoardAxes.push([pieceInBoardAxes[i][0] + 1, pieceInBoardAxes[i][1]]);
            }
        }
        return displacedPieceInBoardAxes;
    };

    const checkPieceOnBorder = (displacedPieceInBoardAxes: number[][]) => {
        for (let i = 0; i < displacedPieceInBoardAxes.length; i++) {
            const pieceInLeftBorder = displacedPieceInBoardAxes[i][1] < 1;
            const pieceInRightBorder = displacedPieceInBoardAxes[i][1] > BW - 2;
            const pieceInBottomBorder = displacedPieceInBoardAxes[i][0] > BH - 2;

            if (pieceInLeftBorder || pieceInRightBorder || pieceInBottomBorder) return true;
        }
        return false;
    };

    const checkPlaceOcuppied = (displacedPieceInBoardAxes: number[][]) => {
        for (let i = 0; i < displacedPieceInBoardAxes.length; i++) {
            if (boardRef.current[displacedPieceInBoardAxes[i][0]][displacedPieceInBoardAxes[i][1]] !== -1)
                return true;
        }
        return false;
    };

    const checkPieceOnBottom = (displacedPieceInBoardAxes: number[][]) => {
        for (let i = 0; i < displacedPieceInBoardAxes.length; i++) {
            const displacedPieceInBoardYAxe = displacedPieceInBoardAxes[i][0];
            if (displacedPieceInBoardYAxe === BH - 2) return true;
        }
        return false;
    };

    const checkRowCompleted = (board: number[][]) => {
        const completedRows = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i].filter((character) => character === 1).length === 10) completedRows.push(i);
        }
        return completedRows;
    };

    const removeCompletedRows = () => {
        let completedRows = 0;

        setBoard((prevBoard) => {
            const updatedBoard = prevBoard.map((rows) => rows.slice());
            const rowsCompleted = checkRowCompleted(updatedBoard);

            if (rowsCompleted.length < 1) return updatedBoard;

            for (let i = 0; i < rowsCompleted.length; i++) {
                updatedBoard.splice(rowsCompleted[i], 1);
                updatedBoard.unshift([-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
            }

            completedRows = rowsCompleted.length;

            return updatedBoard;
        });

        setScore((prevScore) => ({ ...prevScore, fullLines: prevScore.fullLines + completedRows }));
    };

    const deletePreviousPieceInBoard = () => {
        const previousPieceInBoardAxes = currentPiecePositionRef.current;

        setBoard((prevBoard) => {
            const updatedBoard = prevBoard.map((rows) => rows.slice());
            for (let i = 0; i < previousPieceInBoardAxes.length; i++) {
                updatedBoard[previousPieceInBoardAxes[i][0]][previousPieceInBoardAxes[i][1]] = -1;
            }
            boardRef.current = prevBoard;
            return updatedBoard;
        });
    };

    const movePiece = (direction: "left" | "right" | "bottom") => {
        if (gameOver) return;

        const displacedPieceInBoardAxes = getNewPiecePosition(direction);
        const isPieceOnBorder = checkPieceOnBorder(displacedPieceInBoardAxes);
        const isPlaceOccupied = checkPlaceOcuppied(displacedPieceInBoardAxes);
        const isPieceOnBottom = checkPieceOnBottom(displacedPieceInBoardAxes);

        if ((direction === "bottom" && isPieceOnBottom) || (direction === "bottom" && isPlaceOccupied)) {
            removeCompletedRows();
            setScore((prevScore) => ({ ...prevScore, score: prevScore.score + 20 }));
            return getNewPiece();
        }

        if (isPieceOnBorder || isPlaceOccupied || isPieceOnBottom) return;

        deletePreviousPieceInBoard();
        updateBoard(displacedPieceInBoardAxes);
    };

    const rotatePiece = () => {
        if (!currentPieceRef.current) return;

        const currentPiecePosition = currentPiecePositionRef.current;
        const currentPieceAxes = getPieceAxes(currentPieceRef.current);
        const transposedCurrentPiece = transpose(currentPieceRef.current);
        const rotatedCurrentPiece = reverseRows(transposedCurrentPiece);
        const rotatedCurrentPieceAxes = getPieceAxes(rotatedCurrentPiece);
        const rotatedPiecePosition = [];

        for (let i = 0; i < currentPiecePosition.length; i++) {
            const currentPiecePositionX = currentPiecePosition[i][1];
            const currentPiecePositionY = currentPiecePosition[i][0];

            const currentPieceAxesX = currentPieceAxes[i][1];
            const currentPieceAxesY = currentPieceAxes[i][0];

            const rotatedCurrentPieceAxesX = rotatedCurrentPieceAxes[i][1];
            const rotatedCurrentPieceAxesY = rotatedCurrentPieceAxes[i][0];

            rotatedPiecePosition.push([
                currentPiecePositionY - currentPieceAxesY + rotatedCurrentPieceAxesY,
                currentPiecePositionX - currentPieceAxesX + rotatedCurrentPieceAxesX,
            ]);
        }

        const isPieceOnBorder = checkPieceOnBorder(rotatedPiecePosition);
        const isPlaceOccupied = checkPlaceOcuppied(rotatedPiecePosition);
        const isPieceOnBottom = checkPieceOnBottom(rotatedPiecePosition);

        if (isPieceOnBorder || isPlaceOccupied || isPieceOnBottom) return;

        currentPieceRef.current = rotatedCurrentPiece;
        deletePreviousPieceInBoard();
        updateBoard(rotatedPiecePosition);
    };

    const hardDrop = () => {
        let isPlaceOccupied = false;
        let isPieceOnBottom = false;
        const newCurrentPiecePosition = currentPiecePositionRef.current.map((rows) => rows.slice());

        while (isPieceOnBottom === false && isPlaceOccupied === false) {
            isPieceOnBottom = checkPieceOnBottom(newCurrentPiecePosition);
            isPlaceOccupied = checkPlaceOcuppied(newCurrentPiecePosition);

            if (!isPieceOnBottom && !isPlaceOccupied) {
                for (let i = 0; i < newCurrentPiecePosition.length; i++) {
                    newCurrentPiecePosition[i][0] += 1;
                }
            } else {
                for (let i = 0; i < newCurrentPiecePosition.length; i++) {
                    if (newCurrentPiecePosition[i][0] === 0) return;
                    newCurrentPiecePosition[i][0] -= 1;
                }
            }
        }

        deletePreviousPieceInBoard();
        updateBoard(newCurrentPiecePosition);
        removeCompletedRows();

        setScore((prevScore) => ({ ...prevScore, score: prevScore.score + 40 }));

        return getNewPiece();
    };

    const start = () => {
        setBoard(matrix);
        boardRef.current = matrix;
        setGameOver(false);
        currentPieceRef.current = null;
        currentPiecePositionRef.current = [];
        setComingPiece(null);
        setScore({ score: 0, fullLines: 0 });
        getNewPiece();
    };

    const handlePressKey = (e: { key: string; repeat: boolean }) => {
        if (e.key === "ArrowDown") return movePiece("bottom");

        if (e.repeat) return;

        if (e.key === "1") return setIsShowNextEnabled((prevState) => !prevState);
        if (e.key === "5") return start();
        if (e.key === "ArrowUp") return rotatePiece();
        if (e.key === "ArrowLeft") return movePiece("left");
        if (e.key === "ArrowRight") return movePiece("right");
        if (e.key === " ") return hardDrop();
    };

    const handleLoadScore = async () => {
        if (name === "") return;

        await addDoc(collection(db, "scoreboard"), {
            name: name,
            level: selectedLevel,
            score: score.score,
        });
        setScreen("scoreboard");
    };

    useEffect(() => {
        !comingPiece && start();

        gameOver && window.addEventListener("click", () => inputNameRef.current?.focus());
        gameOver && inputNameRef.current?.focus();

        const fallPiece = setInterval(() => movePiece("bottom"), 500);
        window.addEventListener("keydown", handlePressKey);

        return () => {
            clearInterval(fallPiece);
            window.removeEventListener("keydown", handlePressKey);
            window.removeEventListener("click", () => inputNameRef.current?.focus());
        };
    }, [comingPiece, gameOver]);

    return (
        <div className="tetris-container">
            <br />
            <br />
            <br />
            <div className="tetris-content">
                <div className="score-container">
                    COMPLETED LINES:&nbsp;&nbsp;{score.fullLines}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <br />
                    LEVEL:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {selectedLevel}
                    <br />
                    &nbsp;&nbsp;SCORE:&nbsp;&nbsp;&nbsp;&nbsp;{score.score}
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    {isShowNextEnabled &&
                        comingPiece &&
                        comingPiece.map((row) => {
                            return (
                                <>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    {row.map((value) => {
                                        return value === 1 ? "∎∎" : <>&nbsp;&nbsp;</>;
                                    })}
                                    <br />
                                </>
                            );
                        })}
                    <br />
                    <br />
                    <br />
                    {gameOver && (
                        <span className="insert-name">
                            YOUR NAME?{name.toUpperCase()}
                            <span className="cursor">◼</span>
                            <input
                                onChange={(e) => setName(e.currentTarget.value)}
                                value={name}
                                type="text"
                                ref={inputNameRef}
                                onKeyDown={(e) => e.key === "Enter" && handleLoadScore()}
                            />
                        </span>
                    )}
                </div>
                <div className="board-container">
                    {board.map((x, xIndex) => (
                        <div className="tetris-row" key={xIndex}>
                            {x.map((y, yIndex) => {
                                const formattedBoard = getFormattedBoard(yIndex, y, xIndex);
                                return formattedBoard;
                            })}
                        </div>
                    ))}
                </div>
                <div className="settings">
                    &nbsp;&nbsp;&nbsp;7: LEFT&nbsp;&nbsp;&nbsp;9: RIGHT
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8: ROTATE
                    <br />
                    &nbsp;&nbsp;&nbsp;4: SPEED&nbsp;&nbsp;&nbsp;5: RESET
                    <br />
                    &nbsp;&nbsp;&nbsp;1: SHOW NEXT
                    <br />
                    &nbsp;&nbsp;&nbsp;0:&nbsp;&nbsp;ERASE THIS TEXT
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SPACEBAR - RESET
                </div>
            </div>
        </div>
    );
}

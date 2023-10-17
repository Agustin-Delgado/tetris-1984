import { BH, BW } from "../constants/boardSize";

export const getFormattedBoard = (yIndex: number, y: number, xIndex: number) => {
    if (xIndex === BH - 1 && yIndex === 0) return " ";
    if (xIndex === BH - 1 && yIndex === BW - 1) return " ";
    if (xIndex === BH - 1) return "\\/";
    if (xIndex === BH - 2 && yIndex === 0) return "‹!";
    if (xIndex === BH - 2 && yIndex === BW - 1) return "!›";
    if (xIndex === BH - 2) return "==";
    if (yIndex === 0) return "‹!";
    if (yIndex === BW - 1) return "!›";
    if (y === -1) return " .";
    if (y === 1 || y === 0) return "∎∎";
};

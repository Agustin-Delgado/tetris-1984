import { PIECES } from "../constants/pieces";

export const getRandomPiece = () => {
    const randomNumber = Math.floor(Math.random() * PIECES.length);
    return PIECES[randomNumber];
};

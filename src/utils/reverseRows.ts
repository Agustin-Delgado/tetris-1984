export const reverseRows = (matrix: number[][]) => {
    const reversedPiece = [];

    for (let i = 0; i < matrix.length; i++) reversedPiece.push([...matrix[i]].reverse());
    return reversedPiece;
};

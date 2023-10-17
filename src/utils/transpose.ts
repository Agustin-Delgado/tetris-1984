export const transpose = (matrix: number[][]) => {
    const X = matrix[0].length;
    const Y = matrix.length;

    const transposedPiece = [];

    for (let i = 0; i < X; i++) {
        const transposedRows = [];

        for (let j = 0; j < Y; j++) transposedRows.push(matrix[j][i]);
        transposedPiece.push(transposedRows);
    }
    return transposedPiece;
};

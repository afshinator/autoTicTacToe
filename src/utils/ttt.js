// A bunch of helper functions for tic tac toe logic

export const EMPTY_TOKEN = "_"; // is token the right word?
export const EMPTY_BOARD = Array(9).fill(EMPTY_TOKEN);

export const isUsersTurn = (gameStarted, round) => {
  if (gameStarted === "computer") {
    return !(round % 2);
  } else if (gameStarted === "user") {
    return round % 2;
  }
  return;
};

// All the combinations that can win a game, indexed by board position
const winningCombinations = [
  [
    [3, 6],
    [4, 8],
    [1, 2]
  ],
  [
    [4, 7],
    [0, 2]
  ],
  [
    [5, 8],
    [0, 1],
    [6, 4]
  ],
  [
    [0, 6],
    [4, 5]
  ],
  [
    [1, 7],
    [0, 8],
    [3, 5],
    [2, 6]
  ],
  [
    [2, 8],
    [3, 4]
  ],
  [
    [0, 3],
    [7, 8],
    [2, 4]
  ],
  [
    [1, 4],
    [6, 8]
  ],
  [
    [2, 5],
    [6, 7],
    [0, 4]
  ]
];


const ttt = {
  state: {},
  setState: params => {},
  // i is an index into ttt board, upper left is 0, lower right is 8
  isEdge: i => [1, 3, 5, 7].indexOf(i) !== -1,
  isCorner: i => [0, 2, 6, 8].indexOf(i) !== -1,
  isCenter: i => i === 4,
  orthogonalOpenCorners: (iX, boardData) => {
    const possibilites = [];
    if (iX === 0) {
      if (boardData[1] === EMPTY_TOKEN && boardData[2] === EMPTY_TOKEN) {
        possibilites.push(2); // I can place in this row, place in 2
      }
      if (boardData[3] === EMPTY_TOKEN && boardData[6] === EMPTY_TOKEN) {
        possibilites.push(6); // I can place in this col, place in 6
      }
    } else if (iX === 2) {
      if (boardData[0] === EMPTY_TOKEN && boardData[1] === EMPTY_TOKEN) {
        possibilites.push(0); // I can place in this row, place in 0
      }
      if (boardData[8] === EMPTY_TOKEN && boardData[5] === EMPTY_TOKEN) {
        possibilites.push(8); // I can place in this col, place in 8
      }
    } else if (iX === 6) {
      if (boardData[7] === EMPTY_TOKEN && boardData[8] === EMPTY_TOKEN) {
        possibilites.push(8); // I can place in this row, place in 8
      }
      if (boardData[0] === EMPTY_TOKEN && boardData[3] === EMPTY_TOKEN) {
        possibilites.push(0); // I can place in this col, place in 0
      }
    } else if (iX === 8) {
      if (boardData[6] === EMPTY_TOKEN && boardData[7] === EMPTY_TOKEN) {
        possibilites.push(6); // I can place in this row, place in 6
      }
      if (boardData[2] === EMPTY_TOKEN && boardData[5] === EMPTY_TOKEN) {
        possibilites.push(2); // I can place in this col, place in 2
      }
    }
    return possibilites;
  },
  // check for an existing win state for xOrO; or if isLookAhead is true,
  // check all the empty spaces for a possible win if xOrO was there.
  winCheck: (xOrO, boardData, isLookAhead = false) => {
    const wins = [];

    // For each square xOrO occupied by comparator, check to see
    // if its in a win combo.
    const comparator = !isLookAhead ? xOrO : EMPTY_TOKEN;

    boardData.forEach((sqr, i) => {
      if (sqr === comparator) {
        winningCombinations[i].forEach(combo => {
          if (boardData[combo[0]] === xOrO && boardData[combo[1]] === xOrO) {
            wins.push(i);
          }
        });
      }
    });
    return wins;
  },
  winPossibilities: (xOrO, boardData) => {
    return ttt.winCheck(xOrO, boardData, true);
  }
};

export default ttt;

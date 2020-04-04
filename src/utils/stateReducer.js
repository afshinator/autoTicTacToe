import { EMPTY_TOKEN, EMPTY_BOARD, isUsersTurn } from "./ttt";

function reducer(state, action) {
  const { boardData, round, gameStarted } = state;
  // console.log("we are in the reducer, ", action, state);

  switch (action.type) {
    case "nextRound":
      return { ...state, round: round + 1 };
    case "gameOver":
      return { ...state, round: 0 };
    case "gameStarted":
      const { whoIsFirst } = action.data;
      const newState = {
        ...state,
        winningSpots: false,
        boardData: EMPTY_BOARD,
        round: 1,
      };
      return { ...newState, gameStarted: whoIsFirst };
    case "someoneWon":
      return { ...state, gameStarted: false, winningSpots: action.data };
    case "tieGame":
      return { ...state, gameStarted: false };
    case "updateBoard":
      const { id, which } = action.data;
      if (boardData[id] === EMPTY_TOKEN) {
        const newBoard = [...boardData];
        newBoard[id] = which;
        return { ...state, boardData: newBoard };
      } else {
        console.warn(
          "uh oh, updateBoard is trying to set an occupied spot! ",
          id,
          which
        );
        return { ...state };
      }
    case "squareSelection":
      const idd = action.data.id;
      if (gameStarted && isUsersTurn(gameStarted, round)) {
        if (boardData[idd] === EMPTY_TOKEN) {
          const newBoard = [...boardData];
          if (gameStarted === "computer") {
            newBoard[idd] = round % 2 ? "x" : "o";
          } else {
            newBoard[idd] = !(round % 2) ? "x" : "o";
          }
          return { ...state, boardData: newBoard, round: round + 1 };
        } else {
          console.info("Trying to play an occupied square.");
        }
      }
      return { ...state };

    default:
      throw new Error();
  }
}

export default reducer;

import React, { useReducer } from "react";
import styled from "styled-components";
import Header from "./Header";
import Board from "./Board";
import ttt from "../utils/ttt";
import reducer from "../utils/stateReducer";
import { EMPTY_TOKEN, EMPTY_BOARD, isUsersTurn } from "../utils/ttt";

const playDelay = 1000; // Pause for when the computer makes her move

// Return random-ish digit between 0 and max, used when there's a
// variety of places computer can move to.
const randomNumber = (max) => {
  return Math.trunc(Math.random() * 10000) % max;
};

const StyledGame = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vmin;
  width: 100vw;
`;

const initialState = {
  gameStarted: false,
  round: 0,
  boardData: EMPTY_BOARD,
  winningSpots: null,
};


// Game is the container for Tic Tac Toe Game
// All the logic for the game is here.
function Game() {
  const [state, dispatch] = useReducer(reducer, initialState);

  React.useEffect(() => {
    if (!state.gameStarted) {
      dispatch({ type: "gameOver" });
    } // If game is finished, reset round
  }, [state.gameStarted]);

  // TODO: This hook is too long!
  React.useEffect(() => {
    const { round, boardData, gameStarted } = state;

    const someoneWon = (who, how) => {
      if (who === "x") {
        console.log("COMPUTER WON :", how);
      } else {
        console.log("USER WON!!! ", how);
      }
      dispatch({ type: "someoneWon" , data: how });
    };

    const tieGame = () => {
      console.log("TIE GAME ");
      dispatch({ type: "tieGame" });
    };

    const updateBoard = (id, which = "x") => {
      dispatch({ type: "updateBoard", data: { id, which } });
    };

    const chooseCenter = () => {
      updateBoard(4, "x"); // 0 based index, 9 spots so 4 is center
    };

    const chooseACorner = () => {
      const availableCorners = allSpotTypesWithOccupier("corners", EMPTY_TOKEN);
      const id = availableCorners[randomNumber(availableCorners.length)];
      updateBoard(id, "x");
    };

    const chooseAnEdge = () => {
      const availableEdges = allSpotTypesWithOccupier("edges", EMPTY_TOKEN);
      const id = availableEdges[randomNumber(availableEdges.length)];
      updateBoard(id, "x");
    };

    const allSpotTypesWithOccupier = (type, occupier) => {
      // occupier could be x, o, or empty
      const allCorners = [0, 2, 6, 8];
      const allEdges = [1, 3, 5, 7];
      const allMatches = [];
      const spotType = type === "corners" ? allCorners : allEdges;
      spotType.forEach((i) => {
        // look for and save available spots of type given
        if (boardData[i] === occupier) allMatches.push(i);
      });
      return allMatches;
    };

    const isComputersTurn = !isUsersTurn(gameStarted, round);
    const computerTakeTurn = (whatToDo, updateArg) => {
      setTimeout(() => {
        switch (whatToDo) {
          case "update":
            updateBoard(updateArg);
            break;
          case "corner":
            chooseACorner();
            break;
          case "center":
            chooseCenter();
            break;
          case "edge":
            chooseAnEdge();
            break;
          default:
            console.warn("whoops, computerTakeTurn called with ", whatToDo);
            return;
        }
        dispatch({ type: "nextRound" }); // setRound(round + 1);
      }, playDelay);
    };

    if (round === 1 && isComputersTurn) {
      // computer going first
      chooseACorner();
      dispatch({ type: "nextRound" });
    } else if (round === 2 && isComputersTurn) {
      // user went first
      const i = boardData.indexOf("o");
      if (ttt.isCenter(i)) {
        computerTakeTurn("corner");
      } else if (ttt.isCorner(i) || ttt.isEdge(i)) {
        computerTakeTurn("center");
      }
    } else if (round === 3 && isComputersTurn) {
      // computer went first choosing a corner,
      const i = boardData.indexOf("o");
      const ix = boardData.indexOf("x"); // which corner did i place?
      let possibilites = [];

      if (ttt.isCenter(i)) {
        computerTakeTurn("update", 8 - ix); // 8-ix will give the corner diagonal to first placement
      } else if (ttt.isCorner(i) || ttt.isEdge(i)) {
        possibilites = ttt.orthogonalOpenCorners(ix, boardData);
        computerTakeTurn(
          "update",
          possibilites[randomNumber(possibilites.length)]
        );
      }
    } else if (round === 4 && isComputersTurn) {
      // User went first
      const userWins = ttt.winPossibilities("o", boardData);
      if (userWins.length) {
        // If user has a winning move, block it
        computerTakeTurn("update", userWins[0]);
      } else {
        if (boardData[4] === "x") {
          // If computer started off in center...
          computerTakeTurn("edge");
        } else {
          // I wasn't in center, I must be in a corner
          const whereAmI = allSpotTypesWithOccupier("corners", "x");
          let possibilites = ttt.orthogonalOpenCorners(whereAmI[0], boardData);
          computerTakeTurn(
            "update",
            possibilites[randomNumber(possibilites.length)]
          );
        }
      }
    } else if (round > 4) {
      const wins = ttt.winCheck("x", boardData);
      if (wins.length) {
        someoneWon("x", wins);
        return;
      }
      const userWins = ttt.winCheck("o", boardData);
      if (userWins.length) {
        console.warn("WHAT? user won? ", userWins);
        someoneWon("o", userWins);
        return;
      }

      if (boardData.indexOf(EMPTY_TOKEN) === -1) {
        tieGame();
        return;
      }
    }
    if (round > 4 && isComputersTurn) {
      // If I have a win opportunity, take it!
      const wins = ttt.winPossibilities("x", boardData);

      if (wins.length) {
        computerTakeTurn("update", wins[randomNumber(wins.length)]);
        return;
      }
      // If user has a winning move, block it
      const userWins = ttt.winPossibilities("o", boardData);

      if (userWins.length) {
        computerTakeTurn("update", userWins[0]);
        return;
      }

      const whereAmI = allSpotTypesWithOccupier("corners", "x");
      let possibilites = ttt.orthogonalOpenCorners(whereAmI[0], boardData);

      if (possibilites.length)
        computerTakeTurn(
          "update",
          possibilites[randomNumber(possibilites.length)]
        );
      else computerTakeTurn("corner");
    }
  }, [state.round]);

  const handleGameStarted = (whoIsFirst) => {
    if (whoIsFirst) {
      dispatch({ type: "gameStarted", data: { whoIsFirst } });
    } else dispatch({ type: "gameOver" });
  };

  const handleSquareSelection = (id) => {
    if (state.gameStarted) dispatch({ type: "squareSelection", data: { id } });
  };

  const { gameStarted, boardData, winningSpots } = state;
  return (
    <StyledGame>
      <Header gameStarted={gameStarted} setGameStarted={handleGameStarted} />
      <Board
        gameStarted={gameStarted}
        boardData={boardData}
        handleSquareSelection={handleSquareSelection}
        winningSpots={winningSpots}
      />
    </StyledGame>
  );
}

export default Game;

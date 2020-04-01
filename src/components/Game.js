import React, { useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Board from "./Board";
import ttt from "../utils/ttt";
import { EMPTY_TOKEN } from "../utils/ttt";

const playDelay = 1000; // Pause for when the computer makes her move

// Return random-ish digit between 0 and max, used when there's a
// variety of places computer can move to.
const randomNumber = max => {
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

const EMPTY_BOARD = Array(9).fill(EMPTY_TOKEN);

// Game is the container for Tic Tac Toe Game
// All the logic for the game is here.
function Game() {
  const [gameStarted, setGameStarted] = useState(false);  // Will hold who starts first too
  const [round, setRound] = useState(0);                  // Round in the game
  const [boardData, setBoardData] = useState(EMPTY_BOARD);
  const [winningSpots, setWinningSpots] = useState();     // Once someone wins, will hold the winning spots

  // Returns true if its the users turn to play
  const isUsersTurn = () => {
    if (gameStarted === "computer") {
      return !(round % 2);
    } else if (gameStarted === "user") {
      return round % 2;
    }
    return;
  };

  // This hook is activated when gameStarted changes,
  React.useEffect(() => {
    if (!gameStarted) { setRound(0); }  // If game is finished, reset round
  }, [gameStarted]);


  // This hook holds essentially all of the game logic, and its too long!
  // Another problem is that I know (thanks to the linter) that the
  // dependencies array is incomplete, and I might get a situation where one of
  // my state variable is out of sync -- but its unclear to me how to fix that
  // since hooks are very new to me, and I haven't seen the problem manifest.
  React.useEffect(() => {
    const isComputersTurn = !isUsersTurn();

    const computerWon = how => {
      console.log("COMPUTER WON ", how);
      setWinningSpots(how);
      setGameStarted(false);
    };

    const tieGame = () => {
      console.log("TIE GAME ");
      setGameStarted(false);
    };

    const updateBoard = (id, which = "x") => {
      if (boardData[id] === EMPTY_TOKEN) {
        const newBoard = [...boardData];
        newBoard[id] = which;
        setBoardData(newBoard);
      } else {
        console.warn("uh oh, updateBoard is trying to set an occupied spot! ", id, which);
      }
    };

    const chooseCenter = () => {
      updateBoard(4, "x");    // 0 based index, 9 spots so 4 is center
    };

    const chooseACorner = () => {
      const availableCorners = allCornersWithOccupier(EMPTY_TOKEN);
      const id = availableCorners[randomNumber(availableCorners.length)];
      updateBoard(id, "x");
    };

    const allCornersWithOccupier = occupier => {
      // occupier could be x, o, or empty
      const allCorners = [0, 2, 6, 8];
      const allMatches = [];
      allCorners.forEach(i => {
        // look for and save available corners
        if (boardData[i] === occupier) allMatches.push(i);
      });
      return allMatches;
    };

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
          default:
            console.warn("whoops, computerTakeTurn called with ", whatToDo);
            return;
        }
        setRound(round + 1);
      }, playDelay);
    };

    // if (!gameStarted) return;

    if (round === 1 && isComputersTurn) {
      // computer going first
      chooseACorner();
      setRound(round + 1);
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
      // User went first,
      // if user has an opportunity to win, have to block it
      const userWins = ttt.winPossibilities("o", boardData);

      if (userWins.length) {
        // If user has a winning move, block it
        computerTakeTurn("update", userWins[0]);
      } else {
        if (boardData[4] === "x") {
          // If I started off in center...
          computerTakeTurn("corner");
        } else {
          // I wasn't in center, I must be in a corner
          const whereAmI = allCornersWithOccupier("x");
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
        computerWon(wins);
        return;
      }
      const userWins = ttt.winCheck("o", boardData);
      if (userWins.length) {
        console.warn("WHAT? user won? ", userWins);
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

      const whereAmI = allCornersWithOccupier("x");
      let possibilites = ttt.orthogonalOpenCorners(whereAmI[0], boardData);

      if (possibilites.length)
        computerTakeTurn(
          "update",
          possibilites[randomNumber(possibilites.length)]
        );
      else computerTakeTurn("corner");
    }
  }, [round]);

  const handleGameStarted = whoIsFirst => {
    if (whoIsFirst !== false) {
      setWinningSpots(false);
      setBoardData(EMPTY_BOARD);
      setRound(1);
    }
    setGameStarted(whoIsFirst);
  };

  const handleSquareSelection = id => {
    if (gameStarted && isUsersTurn()) {
      if (boardData[id] === EMPTY_TOKEN) {
        const newBoard = [...boardData];
        if (gameStarted === "computer") {
          newBoard[id] = round % 2 ? "x" : "o";
        } else {
          newBoard[id] = !(round % 2) ? "x" : "o";
        }
        setBoardData(newBoard);
        setRound(round + 1);
      } else {
        console.info("Trying to play an occupied square.");
      }
    }
  };

  return (
    <StyledGame>
      <Header gameStarted={gameStarted} setGameStarted={handleGameStarted} />
      <Board
        gameStarted={gameStarted}
        setGameStarted={setGameStarted}
        boardData={boardData}
        handleSquareSelection={handleSquareSelection}
        winningSpots={winningSpots}
      />
    </StyledGame>
  );
}

export default Game;

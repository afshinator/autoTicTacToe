import React, { useState } from "react";
import styled from "styled-components";
import Header from "./Header";
import Board from "./Board";

const StyledGame = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vmin;
  width: 100vw;
`;

export const EMPTY_TOKEN = "_"; // is token the right word?
const EMPTY_BOARD = Array(9).fill(EMPTY_TOKEN);

// Game is the container for Tic Tac Toe Game
function Game() {
  const [gameStarted, setGameStarted] = useState(false);
  const [round, setRound] = useState(0);
  const [boardData, setBoardData] = useState(EMPTY_BOARD);

  // Returns true if its the users turn to play
  const isUsersTurn = () => {
    if (gameStarted === "computer") {
      return !(round % 2);
    } else if (gameStarted === "user") {
      return round % 2;
    }
    return false;
  };

  const handleGameStarted = newState => {
    if (newState !== false) {
      setBoardData(EMPTY_BOARD);
      setRound(1);
    }
    setGameStarted(newState);
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
      />
    </StyledGame>
  );
}

export default Game;

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

  const handleGameStarted = newState => {}
  const handleSquareSelection = id => {
  };
  
  return (
    <StyledGame>
      <Header gameStarted={gameStarted} setGameStarted={handleGameStarted} />
      { /* <Board /> */}
    </StyledGame>
  );
}

export default Game;

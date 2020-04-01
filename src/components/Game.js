import React, { useState } from "react";
import styled from "styled-components";

const StyledGame = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vmin;
  width: 100vw;
`;


// Game is the container for Tic Tac Toe Game
function Game() {
  return (
    <StyledGame>
      {/* <Header />
      <Board /> */}
    </StyledGame>
  );
}

export default Game;

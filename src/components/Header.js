import React from "react";
import styled from "styled-components";
import Button from "./Button";
// eslint-disable-next-line no-unused-vars
import COLORS from "../utils/colors";

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StyledTitle = styled.h1`
  color: COLORS.text;
  font-size: 2.5em;
  margin-bottom: 0;
`;

// The header contains: Title of the game/app, control buttons
function Header(props) {
  const { gameStarted, setGameStarted } = props;

  return (
    <React.Fragment>
      <StyledTitle>Tic Tac Toe</StyledTitle>
      <ButtonRow>
        <Button
          onClick={() => {
            setGameStarted("computer");
          }}
          disabled={gameStarted}
        >
          Start - COMPUTER first
        </Button>
        <Button
          onClick={() => {
            setGameStarted("user");
          }}
          disabled={gameStarted}
        >
          Start - USER first
        </Button>
        <Button
          onClick={() => {
            setGameStarted(false);
          }}
          disabled={!gameStarted}
        >
          Reset
        </Button>
      </ButtonRow>
    </React.Fragment>
  );
}

export default Header;

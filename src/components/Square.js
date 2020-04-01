import React from "react";
import styled from "styled-components";
import COLORS from "../utils/colors";

const BORDER = `5px solid ${COLORS.board}`;

const whichColor = props => {
  return props.whatAmI === "x" ? COLORS.xPiece : COLORS.oPiece;
};

const StyledSquare = styled.div`
  width: 31%;
  height: 32%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => (props.highlight ? COLORS.bkgdWon : "none")};
  transition: background-color 0.2s ease;
  &:hover {
    background-color: ${COLORS.sqrSelect};
  }

  // TTT board looks like a big hash mark; lets implement w/ css on
  // existing boxes, taking advantage of their sequential id's and
  // selectively showing or hiding borders of different sides.

  border-top: ${props =>
    props["data-id"] > 2
      ? BORDER
      : "none"}; // show top-border for all but top row
  border-bottom: ${props =>
    props["data-id"] < 6 ? BORDER : "none"}; // bottom, for all but bottom row
  border-left: ${props =>
    props["data-id"] % 3 !== 0 ? BORDER : "none"}; // no left edge for 0, 3, & 6
  border-right: ${props =>
    props["data-id"] % 3 !== 2
      ? BORDER
      : "none"}; // no right edge, for 2, 5, & 8
`;

const StyledGamePiece = styled.span`
  font-size: 6em;

  /* TODO: There is an intermittent bug that shows up in Chrome:
    the first box selected seems to cause a jump in the page.  It has to do with 
    this dynamic updating of the color in css and styled-components.
    Firefox does not have this issue.
  */
  color: ${whichColor};

  /* rotate-scale-up animation css courtesy of 
      https://animista.net/
  */
  -webkit-animation: rotate-scale-up 0.25s linear both;
  animation: rotate-scale-up 0.25s linear both;

  @-webkit-keyframes rotate-scale-up {
    0% {
      -webkit-transform: scale(1) rotateZ(0);
      transform: scale(1) rotateZ(0);
    }
    50% {
      -webkit-transform: scale(2) rotateZ(180deg);
      transform: scale(2) rotateZ(180deg);
    }
    100% {
      -webkit-transform: scale(1) rotateZ(360deg);
      transform: scale(1) rotateZ(360deg);
    }
  }
  @keyframes rotate-scale-up {
    0% {
      -webkit-transform: scale(1) rotateZ(0);
      transform: scale(1) rotateZ(0);
    }
    50% {
      -webkit-transform: scale(2) rotateZ(180deg);
      transform: scale(2) rotateZ(180deg);
    }
    100% {
      -webkit-transform: scale(1) rotateZ(360deg);
      transform: scale(1) rotateZ(360deg);
    }
  }
`;

// A Sqaure is a position that a player can choose to occupy in ttt;
// There will be 9 of them in a ttt game.
function Square(props) {
  const { boardData, handleSquareSelection, gameStarted, winningSpots } = props;
  const id = props["data-id"];
  const isX = boardData[id] === "x";
  const isO = boardData[id] === "o";

  const highlight =
    !gameStarted && winningSpots && winningSpots.indexOf(id) !== -1;

  return (
    <StyledSquare
      data-id={id}
      highlight={highlight}
      onClick={e => {
        if (boardData[id] !== "_") {
          console.log("occupied!");
          return;
        }
        handleSquareSelection(id);
      }}
    >
      {isO ? (
        <StyledGamePiece
          className="shadow-drop-2-center"
          whatAmI={boardData[id]} // this prop is for whichColor()
        >
          O
        </StyledGamePiece>
      ) : null}
      {isX ? (
        <StyledGamePiece
          className="shadow-drop-2-center"
          whatAmI={boardData[id]}
        >
          X
        </StyledGamePiece>
      ) : null}
    </StyledSquare>
  );
}

export default Square;

import React from "react";
import styled from "styled-components";
import Square from "./Square";

const StyledBoard = styled.main`
  margin-top: 40px;
  width: 100%;
  max-width: 1000px;
  height: 320px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

// The Tic tac toe board.  The board is visually created with
// the component Square using css.
// Here we build the html of the board by putting 9 Squares in a box.
function Board(props) {
  const { boardData } = props;

  return (
    <StyledBoard>
      {boardData.map((sq, i) => (
        <Square key={i} data-id={i} {...props} />
      ))}
    </StyledBoard>
  );
}

export default Board;

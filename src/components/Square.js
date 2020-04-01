import React from "react";
import styled from "styled-components";
import COLORS from "../utils/colors";

const StyledSquare = styled.div``;

// A Sqaure is a position that a player can choose to occupy in ttt;
// There will be 9 of them in a ttt game.
function Square(props) {
  return <StyledSquare></StyledSquare>;
}

export default Square;

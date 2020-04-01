import styled from "styled-components";
import COLORS from "../utils/colors";

const Button = styled.button`
  background: ${props => {
    return props.disabled ? COLORS.buttonFade : COLORS.button;
  }};
  color: ${props => {
    return props.disabled ? COLORS.bkgd : COLORS.btnText;
  }};
  font-family: "Kalam-Regular"; // see App.js for how we have access to this
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
`;

export default Button;

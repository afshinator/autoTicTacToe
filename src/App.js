import React from "react";
import { createGlobalStyle } from "styled-components";
import KalamRegular from "./assets/Kalam-Regular.ttf";
import COLORS from "./utils/colors";
import Game from "./components/Game";

// See: https://styled-components.com/docs/api#createglobalstyle
const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: "Kalam-Regular";
  src: url(${KalamRegular});
}
body {
  background: ${COLORS.bkgd};
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  font-family: "Kalam-Regular";
  user-select: none;
}
`;

/*  I like this top level component to be free of things that don't 
    necessarily need to be here.
    In the future stuff like redux, context bindings, etc... can go here.
*/
function App() {
  return (
    <React.Fragment>
      <GlobalStyle />
      <Game />
    </React.Fragment>
  );
}

export default App;

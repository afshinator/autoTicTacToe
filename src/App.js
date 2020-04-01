import React from "react";
import { createGlobalStyle } from "styled-components";
import COLORS from "./utils/colors";
import "./App.css";

// Add global styles
// See: https://styled-components.com/docs/api#createglobalstyle
const GlobalStyle = createGlobalStyle`
  body {
    background: ${COLORS.bkgd};
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    user-select: none;
  }
`;

function App() {
  return <div className="App"></div>;
}

export default App;

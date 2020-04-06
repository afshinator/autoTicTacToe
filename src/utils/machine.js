const cpus_turn = {
  cpus_turn: {
    id: "cpus_turn",

    states: {
      playing: {
        on: {
          "": [
            { target: "round1", cond: "isItFirstRound" },
            // { target: "round2", cond: "isItCpusTurn" },
          ],
        },
      },
      round1: { type: 'final'},
      round2: {},
    },
  },
};

const tttMachine = Machine(
  {
    id: "tictactoe",
    initial: "gameOver",
    context: {
      round: 0,
    },
    states: {
      gameOver: {
        exit: ["disableStartButtons"],
        on: {
          USER_FIRST_BTN: "playing.user_first",
          CPU_FIRST_BTN: "playing.cpu_first",
        },
      },
      playing: {
        entry: ["clearBoard", "enableResetButton"],
        exit: ["enableStartButtons", "disableResetButton"],
        states: {
          user_first: {
            on: {
              "": { actions: "incrementRound", target: "users_turn" },
            },
          },
          cpu_first: {
            on: {
              "": { actions: "incrementRound", target: "cpus_turn" },
            },
          },
          users_turn: { id: "users_turn" },
          ...cpus_turn,
        },
        on: {
          GAME_RESET: "gameOver",
        },
      },
    },
  },
  {
    actions: {
      incrementRound: (c, e) => {
        console.log(`incrementRound...`, c, e);
        actions: assign({
          round: c.round + 1,
        });
      },
      enableStartButtons: (context, event) => {
        console.log(`enableStartButtons...`, event);
      },
      disableStartButtons: (context, event) => {
        console.log("disableStartButtons...", event);
      },
      disableResetButton: (context, event) => {
        console.log("disableResetButton...", event);
      },
      enableResetButton: (context, event) => {
        console.log("enableResetButton...", event);
      },
      clearBoard: (context, event) => {
        console.log("clearBoard...", event);
      },
      waitForUserToMove: (context, event) => {
        console.log("waitForUserToMove..", event);
      },
      cpuStart: (context, event) => {
        console.log("cpuStart...", event);
      },
      moveToACorner: (context, event) => {
        console.log("moveToACorner...", event);
      },
      moveToCenter: (context, event) => {
        console.log("moveToCenter...", event);
      },
    },
    guards: {
      isItFirstRound: (c, e) => {
        console.log("g:isItFirstRound ", c, e);
        return c.round === 1;
      },
      isUserFirst: (c, e) => {
        console.log("g:isUserFirst ", c, e);
        return false;
      },
      round1UserMovedToCenter: (context, event) => {
        console.log("round1UserMovedToCenter, event ", event);
        return true;
      },
      round1UserMovedToCorner: (context, event) => {
        console.log("round1UserMovedToCorner, event ", event);
        return true;
      },
      round1UserMovedToEdge: (context, event) => {
        console.log("round1UserMovedToEdge, event ", event);
        return true;
      },
    },
  }
);

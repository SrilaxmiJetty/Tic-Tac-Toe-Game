// const cells = Array.from(document.querySelectorAll(".cell"));
// const gameTurns = document.querySelector("#game-turns");
// const gameOver = document.querySelector("#display-gameover");
// const resetButton = document.querySelector("#reset");

// let currentPlayer = "X";
// let isGameActive = true;
// let board = ["", "", "", "", "", "", "", "", ""];
// const winningConditions = [
//   [0, 1, 2],
//   [3, 4, 5],
//   [6, 7, 8],
//   [0, 3, 6],
//   [1, 4, 7],
//   [2, 5, 8],
//   [0, 4, 8],
//   [2, 4, 6],
// ];

// const isValidCell = (cell) => {
//   if (cell.innerText === "X" || cell.innerText === "O") {
//     return false;
//   }
//   return true;
// };

// const handleCellClick = (clickedCell, index) => {
//   const cell = clickedCell.target;
//   if (isValidCell(cell) && isGameActive) {
//     cell.innerText = currentPlayer;
//     board[index] = currentPlayer;
//     handleResultValidation();
//     changePlayer();
//   }
// };

// const changePlayer = () => {
//   currentPlayer = currentPlayer === "X" ? "O" : "X";
//   gameTurns.innerText = currentPlayer;
// };

// const handleResultValidation = () => {
//   for (let it = 0; it < 8; it++) {
//     const winCondition = winningConditions[it];
//     const a = board[winCondition[0]];
//     const b = board[winCondition[1]];
//     const c = board[winCondition[2]];

//     if (a === "" || b === "" || c === "") {
//       continue;
//     }
//     if (a === b && b === c) {
//       gameOver.innerText = "Game Over!";
//       isGameActive = false;
//       break;
//     }
//     if (board.includes("")) {
//       gameOver.innerText = "Game Tie!";
//       isGameActive = false;
//       break;
//     }
//   }
// };

// const handleRestartGame = () => {
//   board = ["", "", "", "", "", "", "", "", ""];
//   isGameActive = true;
//   if (currentPlayer === "O") {
//     changePlayer();
//   }
//   cells.forEach((cell) => {
//     cell.innerText = "";
//   });
// };

// cells.forEach((cell) => {
//   cell.addEventListener("click", handleCellClick(cell, index));
// });

// resetButton.addEventListener("click", handleRestartGame());

const gameTurns = document.querySelector("#game-turns");
const gameBoard = document.querySelector("#game-board");
const gameOver = document.querySelector("#display-gameover");
const gameStatusMsg = document.querySelector("#game_status_msg");
// const cells = Array.from(document.querySelectorAll(".cell"));
let cellBlocked = -1;
let blockTill = -1;

const cells = [];
const intialGameState = {
  filled: 0,
  positions: {
    x: [],
    o: [],
  },
  activePlayer: "x",
  winner: undefined,
  gameDraw: false,
};

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let game = { ...intialGameState, positions: { x: [], o: [] } };

const showWinner = () => {
  if (game.gameDraw) {
    gameStatusMsg.innerText = "Game is draw!";
    gameStatusMsg.classList.remove("text-success");
    gameStatusMsg.classList.add("text-warning");
    return;
  }
  if (game.winner) {
    gameStatusMsg.innerHTML = `Game is over, winner is '${game.winner.toUpperCase()}'`;
    gameStatusMsg.classList.remove("text-warning");
    gameStatusMsg.classList.add("text-success");
  }
};

const highliteWinningPattern = (pattern) => {
  console.log({ pattern });
  pattern.forEach((cellIndex) => {
    cells[cellIndex].classList.add("winning-cell");
  });
};

const toggleActivePlayer = () => {
  game.activePlayer = game.activePlayer === "x" ? "o" : "x";
  gameTurns.innerHTML = game.activePlayer;
};

const checkWinner = () => {
  let winner = undefined;
  const { positions } = game;
  const positionsOfX = positions.x;
  const positionsOfO = positions.o;
  if (positionsOfX.length >= 3) {
    winningConditions.forEach((condition) => {
      const winnerIsX = condition.every((position) =>
        positionsOfX.includes(position)
      );
      if (winnerIsX) {
        game.winner = "x";
        highliteWinningPattern(condition);
      }
    });
    if (game.winner) {
      showWinner();
      return;
    }
  }

  if (positionsOfO.length >= 3) {
    winningConditions.forEach((condition) => {
      const winnerIsO = condition.every((position) =>
        positionsOfO.includes(position)
      );
      if (winnerIsO) {
        highliteWinningPattern(condition);
        game.winner = "o";
        showWinner();
      }
    });
  }
  if (game.filled === 9 && !game.winner && !game.gameDraw) {
    game.gameDraw = true;
    showWinner();
    return;
  }
  toggleActivePlayer();
};

const setRandomCellBlocked = () => {
  cellBlocked = Math.floor(Math.random() * 9);
  blockTill = Math.floor(Math.random() * 7);
  // console.log({ blockTill });
  disableBlockedCell();
};

const disableBlockedCell = () => {
  cells[cellBlocked]?.setAttribute("disabled", true);
};

const enableBlockedCell = () => {
  cells[cellBlocked]?.removeAttribute("disabled");
};

const handleCellClick = (cellIndex) => {
  const selectedCell = cells[cellIndex];
  if (game.filled == blockTill) {
    enableBlockedCell();
  }
  if (game.winner || game.gameDraw) return;
  game.filled += 1;
  selectedCell.setAttribute("disabled", true);
  selectedCell.innerText = game.activePlayer;
  selectedCell.classList.add("filled");
  selectedCell.classList.add(
    game.activePlayer === "x" ? "bg-danger" : "bg-success"
  );

  game.positions[game.activePlayer].push(cellIndex);
  if (game.filled >= 5) {
    checkWinner();
  } else toggleActivePlayer();
};

const resetGame = () => {
  gameStatusMsg.innerHTML = "";
  gameBoard.innerHTML = "";
  game = { ...intialGameState, positions: { x: [], o: [] } };
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cells[i] = cell;
    gameBoard.appendChild(cell);
  }
  // cells.forEach((cell) => {
  //   cell.innerHTML = "";
  //   cell.removeAttribute("disabled");
  //   cell.classList.remove("filled");
  //   cell.classList.remove("bg-danger");
  //   cell.classList.remove("bg-success");
  //   cell.classList.remove("winning-cell");
  // });
  setRandomCellBlocked();
  cells.forEach((cell, index) => {
    cell.setAttribute("data-index", index);
    cell.setAttribute("onclick", `handleCellClick(${index})`);
  });
};

resetGame();

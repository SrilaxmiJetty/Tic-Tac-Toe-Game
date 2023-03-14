const cells = Array.from(document.querySelectorAll(".cell"));
const gameStatusMsg = document.querySelector("#game_status_msg");
const gameTurns = document.querySelector("#game-turns");
console.log(cells);

const initialGameState = {
  activePlayer: "x",
  filled: 0,
  positions: {
    x: [],
    o: [],
  },
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

let game = { ...initialGameState, positions: { x: [], o: [] } };

const showWinner = () => {
  if (game.gameDraw) {
    //   alert("Oh!, Game is draw");
    gameStatusMsg.innerText = "Oh!, Game is draw";

    return;
  }
  if (game.winner) {
    gameStatusMsg.innerHTML = `Game Over. Winner is ${game.winner}`;

    // alert(`Game Over. Winner is ${game.winner}`);
  }
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
  console.log({ positions });
  if (positionsOfX.length >= 3) {
    winningConditions.forEach((condition) => {
      const winnerIsX = condition.every((position) =>
        positionsOfX.includes(position)
      );
      if (winnerIsX) {
        game.winner = "x";
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
        game.winner = "o";
        showWinner();
      }
    });
  }

  // Game draw condition
  if (game.filled === 9 && !game.winner && !game.gameDraw) {
    game.gameDraw = true;
    showWinner();
    return;
  }
  toggleActivePlayer();
};

const handleCellClick = (cellIndex) => {
  if (game.winner || game.gameDraw) return;
  game.filled += 1;
  cells[cellIndex].setAttribute("disabled", true);
  cells[cellIndex].innerText = game.activePlayer;
  game.positions[game.activePlayer].push(cellIndex);
  if (game.filled >= 5) checkWinner();
  else toggleActivePlayer();
};

const resetGame = () => {
  gameStatusMsg.innerHTML = "";

  game = { ...initialGameState, positions: { x: [], o: [] } };
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.removeAttribute("disabled");
  });
};

cells.forEach((cell, index) => {
  cell.setAttribute("data-index", index);
  cell.setAttribute("onclick", `handleCellClick(${index})`);
});

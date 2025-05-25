const board = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("resetBtn");
const modal = document.getElementById("gameModal");
const modalMsg = document.getElementById("modalMessage");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalContent = document.getElementById("modalContent");
const clickSound = document.getElementById("clickSound");
const winSound = document.getElementById("winSound");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
  message.textContent = `Player ${currentPlayer}'s turn`;
}

function handleClick(e) {
  const cell = e.target;
  const index = cell.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  gameState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(`player-${currentPlayer}`);
  clickSound.play();

  checkWinner();

  if (gameActive) {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    message.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  let roundWon = false;
  let winningLine = [];

  for (const condition of winConditions) {
    const [a, b, c] = condition;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      roundWon = true;
      winningLine = condition;
      break;
    }
  }

  if (roundWon) {
    gameActive = false;
    winSound.play();
    winningLine.forEach(index => {
      board.children[index].classList.add("winning-cell");
    });
    message.textContent = `Player ${currentPlayer} wins!`;
    showModal(`Player ${currentPlayer} wins!`);
    return;
  }

  if (!gameState.includes("")) {
    gameActive = false;
    message.textContent = "It's a draw!";
    showModal("It's a draw!");
  }
}

function resetGame() {
  currentPlayer = "X";
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  hideModal();
  createBoard();
}

function showModal(msg) {
  modalMsg.textContent = msg;
  modal.classList.remove("hidden");
}

function hideModal() {
  modal.classList.add("hidden");
}

resetBtn.addEventListener("click", resetGame);
closeModalBtn.addEventListener("click", resetGame);
createBoard();

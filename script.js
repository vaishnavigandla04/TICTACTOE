const cells = Array.from(document.querySelectorAll('.cell'));
const currentPlayerElement = document.getElementById('current-player');
const turnLabelElement = document.getElementById('turn-label');
const statusElement = document.getElementById('status');
const restartButton = document.getElementById('restart');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const scoreDrawElement = document.getElementById('score-draw');

let boardState = Array(9).fill('');
let currentPlayer = 'X';
let gameOver = false;
let scores = {
  X: 0,
  O: 0,
  Draw: 0,
};

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellNames = [
  'Top left cell',
  'Top middle cell',
  'Top right cell',
  'Middle left cell',
  'Center cell',
  'Middle right cell',
  'Bottom left cell',
  'Bottom middle cell',
  'Bottom right cell',
];

function updateStatus(message) {
  statusElement.textContent = message;
}

function updateCurrentPlayer() {
  currentPlayerElement.textContent = currentPlayer;
  turnLabelElement.hidden = gameOver;
}

function updateScores() {
  scoreXElement.textContent = scores.X;
  scoreOElement.textContent = scores.O;
  scoreDrawElement.textContent = scores.Draw;
}

function resetGame() {
  boardState.fill('');
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('winner', 'x', 'o');
    cell.setAttribute('aria-label', `${cellNames[Number(cell.dataset.index)]}, empty`);
  });
  updateCurrentPlayer();
  updateStatus('Choose a square to begin.');
}

function checkWin() {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      return { winner: boardState[a], line };
    }
  }
  if (boardState.every((value) => value !== '')) {
    return { winner: 'Draw' };
  }
  return null;
}

function endGame(result) {
  gameOver = true;
  if (result.winner === 'Draw') {
    scores.Draw += 1;
    updateStatus("It's a draw!");
  } else {
    scores[result.winner] += 1;
    updateStatus(`Player ${result.winner} wins!`);
    result.line.forEach((index) => {
      cells[index].classList.add('winner');
    });
  }
  updateScores();
  cells.forEach((cell) => (cell.disabled = true));
  updateCurrentPlayer();
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (gameOver || boardState[index]) return;

  boardState[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.setAttribute('aria-label', `${cellNames[index]}, player ${currentPlayer}`);

  const result = checkWin();
  if (result) {
    endGame(result);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateCurrentPlayer();
}

cells.forEach((cell) => {
  cell.addEventListener('click', handleCellClick);
});
restartButton.addEventListener('click', resetGame);

updateScores();
resetGame();

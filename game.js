const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const statusDisplay = document.getElementById('status');

const ROWS = 20; const COLS = 10; const SIZE = 30;
let board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
let score = 0;
let currentPlayer = 1; // 1-Синий, 2-Красный

// Фигурки (тетромино)
const SHAPES = [
    [[1, 1, 1, 1]], // палка
    [[1, 1], [1, 1]], // квадрат
    [[0, 1, 0], [1, 1, 1]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]]  // S
];

let curShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
let curX = 3, curY = 0;

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем застывшие блоки (любого цвета)
    board.forEach((row, y) => row.forEach((val, x) => {
        if (val) {
            ctx.fillStyle = val === 1 ? '#0055ff' : '#ff3333';
            ctx.fillRect(x * SIZE, y * SIZE, SIZE - 1, SIZE - 1);
        }
    }));

    // Рисуем падающую фигуру
    ctx.fillStyle = currentPlayer === 1 ? '#00aaff' : '#ff6666';
    curShape.forEach((row, y) => row.forEach((val, x) => {
        if (val) ctx.fillRect((curX + x) * SIZE, (curY + y) * SIZE, SIZE - 1, SIZE - 1);
    }));
}

function canMove(nx, ny, shape = curShape) {
    return shape.every((row, dy) => row.every((val, dx) => {
        let tx = nx + dx, ty = ny + dy;
        return !val || (tx >= 0 && tx < COLS && ty < ROWS && (!board[ty] || board[ty][tx] === 0));
    }));
}

function checkLines() {
    let linesCleared = 0;
    // Проверяем каждую линию: если в ней нет нулей (0), значит она полная
    for (let y = ROWS - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1); // Удаляем линию
            board.unshift(Array(COLS).fill(0)); // Добавляем пустую сверху
            linesCleared++;
            y++; // Проверяем ту же позицию еще раз
        }
    }
    if (linesCleared > 0) {
        score += linesCleared * 100;
        scoreDisplay.innerText = score;
        if (score >= 2000) {
            alert("ПОБЕДА! Вы набрали 2000 очков!");
            resetGame();
        }
    }
}

function lock() {
    curShape.forEach((row, y) => row.forEach((val, x) => {
        if (val) board[curY + y][curX + x] = currentPlayer;
    }));

    checkLines();

    // Смена игрока
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    statusDisplay.innerText = `ХОД: ${currentPlayer === 1 ? 'СИНИЙ' : 'КРАСНЫЙ'}`;
    statusDisplay.style.background = currentPlayer === 1 ? 'blue' : 'red';

    // Новая фигура
    curY = 0; curX = 3;
    curShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];

    if (!canMove(curX, curY)) {
        alert("Игра окончена! Попробуйте снова.");
        resetGame();
    }
}

function resetGame() {
    board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    score = 0;
    scoreDisplay.innerText = score;
}

function update() {
    if (canMove(curX, curY + 1)) curY++; else lock();
    draw();
}

window.onkeydown = (e) => {
    if (e.key === 'ArrowLeft' && canMove(curX - 1, curY)) curX--;
    if (e.key === 'ArrowRight' && canMove(curX + 1, curY)) curX++;
    if (e.key === 'ArrowDown') update();
    draw();
};

setInterval(update, 500);
draw();

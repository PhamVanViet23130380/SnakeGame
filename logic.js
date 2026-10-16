document.getElementById("l1").addEventListener("click", Level1);

var row = 10;
var col = 10;
var game = document.getElementById("game");
var snake = [];

function initGame(col, row) {
    for (let i = 0; i < row; i++) {
        let tr = document.createElement("tr");
        for (var j = 0; j < col; j++) {
            let td = document.createElement("td");
            td.id = "cell_" + i + "_" + j;
            td.classList.add("cell");
            tr.appendChild(td);
        }
        game.appendChild(tr);
    }
}

function initSnake() {
    let x = parseInt(Math.random() * (row - 2)) + 1;
    let y = parseInt(Math.random() * (row - 2)) + 1;
    return [{ x, y }, { x, y: y - 1 }];
}

function renderSnake() {
    for (let i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            document.getElementById("cell_" + i + "_" + j).classList.remove("dot");
        }
    }
    for (const dot of snake) {
        document.getElementById("cell_" + dot.x + "_" + dot.y).classList.add("dot");
    }
}

function Level1() {
    if (!game.hidden) return;
    game.textContent = "";
    initGame(row, col);
    snake = initSnake();
    document.getElementById("menu").hidden = true;
    document.getElementById("subtitle").textContent = "Level 1";
    game.hidden = false;
    renderSnake();
    setInterval(() => {
        let head = snake.at(-1);
        let tail = snake.shift();
        tail.y = head.y - 1 < 0 ? 9 : head.y - 1;
        snake.push(tail);
        renderSnake();
    }, 300);
}

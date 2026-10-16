document.getElementById("l1").addEventListener("click", Level1);

var row = 10;
var col = 10;
var game = document.getElementById("game");
var snake = [];
var apple = null;
var key = "";
var movingKey = "";

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

function initApple() {
    let empty = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            let free = true;
            for (const dot of snake) {
                if (dot.x === i && dot.y === j) {
                    free = false;
                    break;
                }

            }
            if (free) empty.push({ x: i, y: j });
        }

    }
    if (empty.length === 0) return null;
    return empty[parseInt(Math.random() * empty.length)];
}

function renderSnake() {
    for (let i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            document.getElementById("cell_" + i + "_" + j).classList.remove("dot", "apple");
        }
    }
    for (const dot of snake) {
        document.getElementById("cell_" + dot.x + "_" + dot.y).classList.add("dot");
    }
    if (apple !== null) {
        document.getElementById("cell_" + apple.x + "_" + apple.y).classList.add("apple");
    }
}

function Level1() {
    if (!game.hidden) return;
    game.textContent = "";
    initGame(row, col);
    snake = initSnake();
    apple = initApple();
    document.getElementById("menu").hidden = true;
    document.getElementById("subtitle").textContent = "Level 1";
    game.hidden = false;
    renderSnake()
    setInterval(() => {
        let head = snake.at(-1);
        let newHead = { x: head.x, y: head.y };
        // x là hàng, y là cột
        switch (key) {
            case "ArrowUp":
                newHead.x = head.x - 1 < 0 ? row - 1 : head.x - 1;
                break;
            case "ArrowDown":
                newHead.x = head.x + 1 >= row ? 0 : head.x + 1;
                break;
            case "ArrowRight":
                newHead.y = head.y + 1 >= col ? 0 : head.y + 1;
                break;
            case "ArrowLeft":
            default:
                newHead.y = head.y - 1 < 0 ? 9 : head.y - 1;
                break;
        }
        if (apple !== null && newHead.x === apple.x && newHead.y === apple.y) {
            // Ăn táo giữ đuôi, thêm đầu mới để rắn dài ra.
            snake.push(newHead);
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        movingKey = key;
        renderSnake();
    }, 300);
}

document.addEventListener("keydown", function (event) {
    if (game.hidden) return;
    switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight": {
            event.preventDefault();

            let currentKey = movingKey || "ArrowLeft";
            if (
                (currentKey === "ArrowUp" && event.key === "ArrowDown") ||
                (currentKey === "ArrowDown" && event.key === "ArrowUp") ||
                (currentKey === "ArrowLeft" && event.key === "ArrowRight") ||
                (currentKey === "ArrowRight" && event.key === "ArrowLeft"))
                return;

            key = event.key;
            break;
        }
    }
});

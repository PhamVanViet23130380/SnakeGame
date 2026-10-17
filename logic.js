document.getElementById("l1").addEventListener("click", Level1);
document.getElementById("stop").addEventListener("click", stopGame);
document.getElementById("back").addEventListener("click", backMenu);
document.getElementById("l2").addEventListener("click", Level2);

var row = 10;
var col = 10;
var game = document.getElementById("game");
var snake = [];
var apple = null;
var key = "";
var movingKey = "";
var dead = false;
var score = 0;
var win = false;
var pause = false;
var timer = null;
var tuong = [];

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
    clearInterval(timer);
    game.textContent = "";
    initGame(row, col);
    snake = initSnake();
    apple = initApple();
    score = 0;
    dead = false;
    win = false;
    pause = false;
    key = "";
    movingKey = "";
    document.getElementById("menu").hidden = true;
    document.getElementById("subtitle").textContent = "Level 1 - Táo: 0/10";
    document.getElementById("buttons").hidden = false;
    document.getElementById("stop").textContent = "Stop";
    document.getElementById("stop").disabled = false;
    game.hidden = false;
    renderSnake()
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
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
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;

        for (let i = 0; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                dead = true;
                clearInterval(timer);
                document.getElementById("stop").disabled = true;
                document.getElementById("subtitle").textContent = "GAME OVER";
                return;
            }

        }

        if (an) {
            // Ăn táo giữ đuôi, thêm đầu mới để rắn dài ra.
            snake.push(newHead);
            score++;
            document.getElementById("subtitle").textContent = "Level 1 - Táo: " + score + "/10";
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        movingKey = key;
        renderSnake();
        if (score >= 10) {
            win = true;
            clearInterval(timer);
            document.getElementById("stop").disabled = true;
            Message();
        }
    }, 300);
}

function Level2() {
    if (!game.hidden) return;
    clearInterval(timer);
    game.textContent = "";
    initGame(row, col);
    tuong = [
        { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 3, y: 4 },
        { x: 6, y: 5 }, { x: 6, y: 6 }, { x: 6, y: 7 }
    ];
    for (const o of tuong) {
        document.getElementById("cell_" + o.x + "_" + o.y).classList.add("tuong");
    }

    // Rắn sinh ra trùng tường thì random lại vị trí.
    let trung = true;
    while (trung) {
        snake = initSnake();
        trung = false;
        for (const o of tuong) {
            for (const dot of snake) {
                if (dot.x === o.x && dot.y === o.y) trung = true;
            }
        }
    }

    apple = initApple();
    score = 0;
    dead = false;
    win = false;
    pause = false;
    key = "";
    movingKey = "";
    document.getElementById("menu").hidden = true;
    document.getElementById("title").textContent = "LEVEL 2";
    document.getElementById("subtitle").textContent = "Level 2 - Táo: 0/10";
    document.getElementById("buttons").hidden = false;
    document.getElementById("stop").textContent = "Stop";
    document.getElementById("stop").disabled = false;
    game.hidden = false;
    renderSnake();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
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
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;

        for (let i = 0; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                dead = true;
                clearInterval(timer);
                document.getElementById("stop").disabled = true;
                document.getElementById("subtitle").textContent = "GAME OVER";
                return;
            }
        }

        // Rắn đụng tường
        for (const o of tuong) {
            if (newHead.x === o.x && newHead.y === o.y) {
                dead = true;
                clearInterval(timer);
                document.getElementById("stop").disabled = true;
                document.getElementById("subtitle").textContent = "GAME OVER";
                return;
            }
        }

        if (an) {
            // Ăn táo giữ đuôi, thêm đầu mới để rắn dài ra.
            snake.push(newHead);
            score++;
            document.getElementById("subtitle").textContent = "Level 2 - Táo: " + score + "/10";
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        movingKey = key;
        renderSnake();
        if (score >= 10) {
            win = true;
            clearInterval(timer);
            document.getElementById("stop").disabled = true;
            Message();
        }
    }, 300);
}

function stopGame() {
    if (game.hidden || dead || win) return;
    pause = !pause;
    document.getElementById("stop").textContent = pause ? "Continue" : "Stop";
}

function backMenu() {
    clearInterval(timer);
    timer = null;
    pause = false;
    game.hidden = true;
    document.getElementById("buttons").hidden = true;
    document.getElementById("menu").hidden = false;
    document.getElementById("title").textContent = "RẮN SĂN MỒI";
    document.getElementById("subtitle").textContent = "Chọn màn chơi";
}

function Message() {
    game.hidden = true;
    document.getElementById("title").textContent = "LEVEL 2";
    document.getElementById("subtitle").textContent = "WIN";
}

document.addEventListener("keydown", function (event) {
    if (game.hidden || dead || win || pause) return;
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

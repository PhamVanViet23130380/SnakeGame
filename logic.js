document.getElementById("l1").addEventListener("click", Level1);
document.getElementById("stop").addEventListener("click", stopGame);
document.getElementById("back").addEventListener("click", backMenu);
document.getElementById("l2").addEventListener("click", Level2);
document.getElementById("restart").addEventListener("click", choiLai);
document.getElementById("l3").addEventListener("click", Level3);

var row = 10;
var col = 10;
var game = document.getElementById("game");
var snake = [];
var apple = null;
var appleDoc = null;
var key = "";
var movingKey = "";
var dead = false;
var score = 0;
var win = false;
var pause = false;
var timer = null;
var tuong = [];
var level = 1;

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
            for (const o of tuong) {
                if (o.x === i && o.y === j) {
                    free = false;
                    break;
                }

            }
            // Táo thường != táo độc.
            if (appleDoc !== null && appleDoc.x === i && appleDoc.y === j) free = false;
            if (free) empty.push({ x: i, y: j });
        }

    }
    if (empty.length === 0) return null;
    return empty[parseInt(Math.random() * empty.length)];
}

function initAppleDoc() {
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
            for (const o of tuong) {
                if (o.x === i && o.y === j) {
                    free = false;
                    break;
                }
            }

            if (apple !== null && apple.x === i && apple.y === j) free = false;
            if (free) empty.push({ x: i, y: j });
        
        }
    }
    if (empty.length === 0) return null;
    return empty[parseInt(Math.random() * empty.length)];
}

function renderSnake() {
    for (let i = 0; i < row; i++) {
        for (var j = 0; j < col; j++) {
            document.getElementById("cell_" + i + "_" + j).classList.remove("dot", "apple", "appleDoc");
        }
    }
    for (const dot of snake) {
        document.getElementById("cell_" + dot.x + "_" + dot.y).classList.add("dot");
    }
    if (apple !== null) {
        document.getElementById("cell_" + apple.x + "_" + apple.y).classList.add("apple");
    }
    if (appleDoc !== null) {
        document.getElementById("cell_" + appleDoc.x + "_" + appleDoc.y).classList.add("appleDoc");
    
    }
}

function Level1() {
    if (!game.hidden && !dead) return;
    level = 1;
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
    document.getElementById("restart").hidden = true;
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
                document.getElementById("restart").hidden = false;
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
    if (!game.hidden && !dead) return;
    level = 2;
    clearInterval(timer);
    game.textContent = "";
    initGame(row, col);
    tuong = [
        { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 },
        { x: 8, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 2 },
        { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 7, y: 8 },
        { x: 1, y: 7 }, { x: 1, y: 8 }, { x: 2, y: 8 },
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
    document.getElementById("restart").hidden = true;
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
                document.getElementById("restart").hidden = false;
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
                document.getElementById("restart").hidden = false;
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

function Level3() {
    if (!game.hidden && !dead) return;
    level = 3;
    clearInterval(timer);
    appleDoc = null;
    game.textContent = "";
    initGame(row, col);
    tuong = [
        { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 1 },
        { x: 8, y: 1 }, { x: 7, y: 1 }, { x: 8, y: 2 },
        { x: 8, y: 7 }, { x: 8, y: 8 }, { x: 7, y: 8 },
        { x: 1, y: 7 }, { x: 1, y: 8 }, { x: 2, y: 8 },
    ];
    for (const o of tuong) {
        document.getElementById("cell_" + o.x + "_" + o.y).classList.add("tuong");
    }

    // Rắn sinh ra trùng tường thì random
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
    appleDoc = initAppleDoc();
    score = 0;
    dead = false;
    win = false;
    pause = false;
    key = "";
    movingKey = "";
    document.getElementById("menu").hidden = true;
    document.getElementById("title").textContent = "LEVEL 3";
    document.getElementById("subtitle").textContent = "Level 3 - Điểm: 0/10";
    document.getElementById("buttons").hidden = false;
    document.getElementById("stop").textContent = "Stop";
    document.getElementById("stop").disabled = false;
    document.getElementById("restart").hidden = true;
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
        let anDoc = appleDoc !== null && newHead.x === appleDoc.x && newHead.y === appleDoc.y;

        for (let i = 0; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                dead = true;
                clearInterval(timer);
                document.getElementById("stop").disabled = true;
                document.getElementById("restart").hidden = false;
                document.getElementById("subtitle").textContent = "GAME OVER";
                return;
            }
        }

        // Rắn đụng tường.
        for (const o of tuong) {
            if (newHead.x === o.x && newHead.y === o.y) {
                dead = true;
                clearInterval(timer);
                document.getElementById("stop").disabled = true;
                document.getElementById("restart").hidden = false;
                document.getElementById("subtitle").textContent = "GAME OVER";
                return;
            }
        }

        if (an) {
            // Ăn táo + điểm
            snake.push(newHead);
            score++;
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }

        // Ăn táo độc trừ điểm
        if (anDoc) {
            score = score - 2;
            if (score < 0) score = 0;
            if (snake.length > 2) snake.shift();
            appleDoc = initAppleDoc();
        }
        document.getElementById("subtitle").textContent = "Level 3 - Điểm: " + score + "/10";
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

function choiLai() {
    if (!dead) return;
    if (level === 1) Level1();
    else if (level === 2) Level2();
    else if (level === 3) Level3();
}

function stopGame() {
    if (game.hidden || dead || win) return;
    pause = !pause;
    document.getElementById("stop").textContent = pause ? "Continue" : "Stop";
}

function backMenu() {
    clearInterval(timer);
    timer = null;
    appleDoc = null;
    tuong = [];
    pause = false;
    game.hidden = true;
    document.getElementById("buttons").hidden = true;
    document.getElementById("restart").hidden = true;
    document.getElementById("menu").hidden = false;
    document.getElementById("title").textContent = "RẮN SĂN MỒI";
    document.getElementById("subtitle").textContent = "Chọn màn chơi";
}

function Message() {
    game.hidden = true;
    document.getElementById("restart").hidden = true;
    document.getElementById("title").textContent = "LEVEL " + level;
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

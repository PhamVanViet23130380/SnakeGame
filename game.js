document.getElementById("l1").addEventListener("click", Level1);
document.getElementById("stop").addEventListener("click", stopGame);
document.getElementById("back").addEventListener("click", backMenu);
document.getElementById("l2").addEventListener("click", Level2);
document.getElementById("restart").addEventListener("click", choiLai);
document.getElementById("l3").addEventListener("click", Level3);
document.getElementById("l4").addEventListener("click", Level4);
document.getElementById("next").addEventListener("click", quaMan);
document.getElementById("l5").addEventListener("click", Level5);
document.getElementById("l6").addEventListener("click", Level6);

var row = 15;
var col = 15;
var game = document.getElementById("game");
var snake = [];
var apple = null;
var appleDoc = null;
var appleTuong = null;
var key = "";
var movingKey = "";
var dead = false;
var score = 0;
var win = false;
var pause = false;
var timer = null;
var tuong = [];
var level = 1;
var appleDao = null;
var count = 0;
var congA = null;
var congB = null;

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
    let x;
    let y;
    if (level === 4) {
        // Rắn ở khu trên, chừa khoảng trống bên trái để kịp điều khiển
        x = parseInt(Math.random() * 4) + 2;
        y = parseInt(Math.random() * 4) + 8;
    } else {
        x = parseInt(Math.random() * (row - 7)) + 5;
        y = parseInt(Math.random() * (col - 7)) + 5;
    }
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
            if (appleTuong !== null && appleTuong.x === i && appleTuong.y === j) free = false;
            if (appleDao !== null && appleDao.x === i && appleDao.y === j) free = false;
            if (congA !== null && congA.x === i && congA.y === j) free = false;
            if (congB !== null && congB.x === i && congB.y === j) free = false;
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
            document.getElementById("cell_" + i + "_" + j).classList.remove("dot", "apple", "appleDoc", "appleTuong", "appleDao");
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
    if (appleTuong !== null) {
        document.getElementById("cell_" + appleTuong.x + "_" + appleTuong.y).classList.add("appleTuong");
    }
    if (appleDao !== null) {
        document.getElementById("cell_" + appleDao.x + "_" + appleDao.y).classList.add("appleDao");
    }
}

function start() {
    score = 0;
    dead = false;
    win = false;
    pause = false;
    key = "";
    movingKey = "";
    document.getElementById("menu").hidden = true;
    if (level === 4) {
        document.getElementById("subtitle").textContent = "Level 4 - Táo: 0/20 | Vào A ra B, vào B ra A.";
    } else {
        document.getElementById("subtitle").textContent = "Level " + level + " - Điểm: 0/20";
    }
    document.getElementById("buttons").hidden = false;
    document.getElementById("daoPhim").hidden = level !== 6;
    document.getElementById("daoPhim").textContent = "Táo vàng: +2 điểm, đảo phím trong 20 bước.";
    document.getElementById("stop").textContent = "Stop";
    document.getElementById("stop").disabled = false;
    document.getElementById("restart").hidden = true;
    document.getElementById("next").hidden = true;
    document.getElementById("lose").hidden = true;
    document.getElementById("san").hidden = false;
    game.hidden = false;
    renderSnake();
}

// x là hàng, y là cột.
function diChuyen() {
    let head = snake.at(-1);
    let newHead = { x: head.x, y: head.y };
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
            newHead.y = head.y - 1 < 0 ? col - 1 : head.y - 1;
            break;
    }
    return newHead;
}

function checkThan(newHead) {
    for (let i = 0; i < snake.length; i++) {
        if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function checkTuong(newHead) {
    for (const o of tuong) {
        if (newHead.x === o.x && newHead.y === o.y) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    dead = true;
    clearInterval(timer);
    document.getElementById("stop").disabled = true;
    document.getElementById("restart").hidden = false;
    document.getElementById("lose").hidden = false;
}

function checkWin() {
    if (score >= 20) {
        win = true;
        clearInterval(timer);
        document.getElementById("stop").disabled = true;
        Message();
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
    start();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
        let newHead = diChuyen();
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;

        if (checkThan(newHead)) {
            gameOver();
            return;
        }

        if (an) {
            // Ăn táo giữ đuôi, thêm đầu mới để rắn dài ra
            snake.push(newHead);
            score++;
            document.getElementById("subtitle").textContent = "Level 1 - Táo: " + score + "/20";
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        movingKey = key;
        renderSnake();
        checkWin();
    }, 300);
}

function Level2() {
    if (!game.hidden && !dead) return;
    level = 2;
    clearInterval(timer);
    game.textContent = "";
    initGame(row, col);
    tuong = [
        {x:0, y:0 }, {x:0, y:1}, {x:0, y:2},{x:0, y:3}, {x: 0, y:4}, {x:0, y:5},{x:0, y:6}, {x:0, y: 7}, {x:0, y:8}, {x:0, y:9}, {x:0, y:10}, {x:0, y:11},{x:0, y:12}, {x:0, y:13}, {x:0, y:14},

        {x:14, y:0}, {x: 14, y:1}, {x:14,y:2},{x:14, y:3}, {x:14, y:4}, {x:14, y:5},{x:14, y:6}, {x:14, y:7}, {x:14, y:8},{x:14, y:9}, {x:14, y:10},{x:14, y:11},{x:14, y:12}, {x:14, y:13}, {x:14, y:14},

        {x:1, y:0},{x:2, y:0}, {x:3, y:0},{ x: 4, y:0}, {x:5, y:0}, {x:6, y:0},{x:7, y:0}, {x:8, y:0}, {x:9, y:0},{x:10, y:0}, {x:11, y:0}, {x:12, y:0},{x:13, y:0},

        {x:1, y:14}, {x:2, y:14}, {x:3, y:14},{x:4, y:14}, {x:5, y: 14}, {x:6, y:14},{x:7, y:14}, {x:8, y:14}, {x:9, y:14},{x:10, y:14}, {x:11,y: 14}, {x:12,y: 14},{x:13, y:14},
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
    document.getElementById("title").textContent = "LEVEL 2";
    start();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
        let newHead = diChuyen();
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;

        if (checkThan(newHead) || checkTuong(newHead)) {
            gameOver();
            return;
        }

        if (an) {
            // Ăn táo giữ đuôi, thêm đầu mới để rắn dài ra.
            snake.push(newHead);
            score++;
            document.getElementById("subtitle").textContent = "Level 2 - Táo: " + score + "/20";
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        movingKey = key;
        renderSnake();
        checkWin();
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
        {x:0, y:0 }, {x:0, y:1}, {x:0, y:2},{x:0, y:3}, {x: 0, y:4}, {x:0, y:5},{x:0, y:6}, {x:0, y: 7}, {x:0, y:8}, {x:0, y:9}, {x:0, y:10}, {x:0, y:11},{x:0, y:12}, {x:0, y:13}, {x:0, y:14},

        {x:14, y:0}, {x: 14, y:1}, {x:14,y:2},{x:14, y:3}, {x:14, y:4}, {x:14, y:5},{x:14, y:6}, {x:14, y:7}, {x:14, y:8},{x:14, y:9}, {x:14, y:10},{x:14, y:11},{x:14, y:12}, {x:14, y:13}, {x:14, y:14},

        {x:1, y:0},{x:2, y:0}, {x:3, y:0},{ x: 4, y:0}, {x:5, y:0}, {x:6, y:0},{x:7, y:0}, {x:8, y:0}, {x:9, y:0},{x:10, y:0}, {x:11, y:0}, {x:12, y:0},{x:13, y:0},

        {x:1, y:14}, {x:2, y:14}, {x:3, y:14},{x:4, y:14}, {x:5, y: 14}, {x:6, y:14},{x:7, y:14}, {x:8, y:14}, {x:9, y:14},{x:10, y:14}, {x:11,y: 14}, {x:12,y: 14},{x:13, y:14},
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
    document.getElementById("title").textContent = "LEVEL 3";
    start();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
        let newHead = diChuyen();
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;
        let anDoc = appleDoc !== null && newHead.x === appleDoc.x && newHead.y === appleDoc.y;

        if (checkThan(newHead) || checkTuong(newHead)) {
            gameOver();
            return;
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
        document.getElementById("subtitle").textContent = "Level 3 - Điểm: " + score + "/20";
        movingKey = key;
        renderSnake();
        checkWin();
    }, 300);
}

function Level4() {
    if (!game.hidden && !dead) return;
    level = 4;
    clearInterval(timer);
    appleDoc = null;
    appleTuong = null;
    appleDao = null;
    count = 0;
    congA = { x: 3, y: 3 };
    congB = { x: 11, y: 11 };
    game.textContent = "";
    initGame(row, col);
    tuong = [
        {x:0, y:0 }, {x:0, y:1}, {x:0, y:2},{x:0, y:3}, {x: 0, y:4}, {x:0, y:5},{x:0, y:6}, {x:0, y: 7}, {x:0, y:8}, {x:0, y:9}, {x:0, y:10}, {x:0, y:11},{x:0, y:12}, {x:0, y:13}, {x:0, y:14},

        {x:14, y:0}, {x: 14, y:1}, {x:14,y:2},{x:14, y:3}, {x:14, y:4}, {x:14, y:5},{x:14, y:6}, {x:14, y:7}, {x:14, y:8},{x:14, y:9}, {x:14, y:10},{x:14, y:11},{x:14, y:12}, {x:14, y:13}, {x:14, y:14},

        {x:1, y:0},{x:2, y:0}, {x:3, y:0},{ x: 4, y:0}, {x:5, y:0}, {x:6, y:0},{x:7, y:0}, {x:8, y:0}, {x:9, y:0},{x:10, y:0}, {x:11, y:0}, {x:12, y:0},{x:13, y:0},

        {x:1, y:14}, {x:2, y:14}, {x:3, y:14},{x:4, y:14}, {x:5, y: 14}, {x:6, y:14},{x:7, y:14}, {x:8, y:14}, {x:9, y:14},{x:10, y:14}, {x:11,y: 14}, {x:12,y: 14},{x:13, y:14},

        {x:7, y:1}, {x:7, y:2}, {x:7, y:3}, {x:7, y:4}, {x:7, y:5}, {x:7, y:6}, {x:7, y:7}, {x:7, y:8}, {x:7, y:9}, {x:7, y:10}, {x:7, y:11}, {x:7, y:12}, {x:7, y:13},
    ];
    for (const o of tuong) {
        document.getElementById("cell_" + o.x + "_" + o.y).classList.add("tuong");
    }
    document.getElementById("cell_" + congA.x + "_" + congA.y).classList.add("congA");
    document.getElementById("cell_" + congA.x + "_" + congA.y).textContent = "A";
    document.getElementById("cell_" + congB.x + "_" + congB.y).classList.add("congB");
    document.getElementById("cell_" + congB.x + "_" + congB.y).textContent = "B";

    snake = initSnake();
    apple = initApple();
    document.getElementById("title").textContent = "LEVEL 4";
    start();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
        let newHead = diChuyen();
        if (checkThan(newHead) || checkTuong(newHead)) {
            gameOver();
            return;
        }

        if (newHead.x === congA.x && newHead.y === congA.y) {
            newHead.x = congB.x;
            newHead.y = congB.y;
        } else if (newHead.x === congB.x && newHead.y === congB.y) {
            newHead.x = congA.x;
            newHead.y = congA.y;
        }

        if (checkThan(newHead) || checkTuong(newHead)) {
            gameOver();
            return;
        }
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;
        if (an) {
            snake.push(newHead);
            score++;
            apple = initApple();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        document.getElementById("subtitle").textContent = "Level 4 - Táo: " + score + "/20 | Vào A ra B, vào B ra A.";
        movingKey = key;
        renderSnake();
        checkWin();
    }, 300);
}

function Level5() {
    if (!game.hidden && !dead) return;
    level = 5;
    clearInterval(timer);
    appleDoc = null;
    appleTuong = null;
    game.textContent = "";
    initGame(row, col);
    tuong = [
        {x:0, y:0 }, {x:0, y:1}, {x:0, y:2},{x:0, y:3}, {x: 0, y:4}, {x:0, y:5},{x:0, y:6}, {x:0, y: 7}, {x:0, y:8}, {x:0, y:9}, {x:0, y:10}, {x:0, y:11},{x:0, y:12}, {x:0, y:13}, {x:0, y:14},

        {x:14, y:0}, {x: 14, y:1}, {x:14,y:2},{x:14, y:3}, {x:14, y:4}, {x:14, y:5},{x:14, y:6}, {x:14, y:7}, {x:14, y:8},{x:14, y:9}, {x:14, y:10},{x:14, y:11},{x:14, y:12}, {x:14, y:13}, {x:14, y:14},

        {x:1, y:0},{x:2, y:0}, {x:3, y:0},{ x: 4, y:0}, {x:5, y:0}, {x:6, y:0},{x:7, y:0}, {x:8, y:0}, {x:9, y:0},{x:10, y:0}, {x:11, y:0}, {x:12, y:0},{x:13, y:0},

        {x:1, y:14}, {x:2, y:14}, {x:3, y:14},{x:4, y:14}, {x:5, y: 14}, {x:6, y:14},{x:7, y:14}, {x:8, y:14}, {x:9, y:14},{x:10, y:14}, {x:11,y: 14}, {x:12,y: 14},{x:13, y:14},
    ];
    for (const o of tuong) {
        document.getElementById("cell_" + o.x + "_" + o.y).classList.add("tuong");
    }

    // Rắn sinh ra trùng tường thì random lại
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
    appleTuong = initAppleDoc();
    document.getElementById("title").textContent = "LEVEL 5";
    start();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
        let newHead = diChuyen();
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;
        let anTuong = appleTuong !== null && newHead.x === appleTuong.x && newHead.y === appleTuong.y;

        if (checkThan(newHead) || checkTuong(newHead)) {
            gameOver();
            return;
        }

        if (an) {
            snake.push(newHead);
            score++;
            apple = initApple();
        } else if (anTuong) {
            // Đuôi thành tường
            let tail = snake.shift();
            tuong.push({ x: tail.x, y: tail.y });
            document.getElementById("cell_" + tail.x + "_" + tail.y).classList.add("tuong");
            snake.push(newHead);
            appleTuong = initAppleDoc();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }
        document.getElementById("subtitle").textContent = "Level 5 - Táo: " + score + "/20";
        movingKey = key;
        renderSnake();
        checkWin();
    }, 300);
}

function Level6() {
    if (!game.hidden && !dead) return;
    level = 6;
    clearInterval(timer);
    appleDoc = null;
    appleTuong = null;
    appleDao = null;
    count = 0;
    game.textContent = "";
    initGame(row, col);
    tuong = [
        {x:0, y:0 }, {x:0, y:1}, {x:0, y:2},{x:0, y:3}, {x: 0, y:4}, {x:0, y:5},{x:0, y:6}, {x:0, y: 7}, {x:0, y:8}, {x:0, y:9}, {x:0, y:10}, {x:0, y:11},{x:0, y:12}, {x:0, y:13}, {x:0, y:14},

        {x:14, y:0}, {x: 14, y:1}, {x:14,y:2},{x:14, y:3}, {x:14, y:4}, {x:14, y:5},{x:14, y:6}, {x:14, y:7}, {x:14, y:8},{x:14, y:9}, {x:14, y:10},{x:14, y:11},{x:14, y:12}, {x:14, y:13}, {x:14, y:14},

        {x:1, y:0},{x:2, y:0}, {x:3, y:0},{ x: 4, y:0}, {x:5, y:0}, {x:6, y:0},{x:7, y:0}, {x:8, y:0}, {x:9, y:0},{x:10, y:0}, {x:11, y:0}, {x:12, y:0},{x:13, y:0},

        {x:1, y:14}, {x:2, y:14}, {x:3, y:14},{x:4, y:14}, {x:5, y: 14}, {x:6, y:14},{x:7, y:14}, {x:8, y:14}, {x:9, y:14},{x:10, y:14}, {x:11,y: 14}, {x:12,y: 14},{x:13, y:14},
    ];
    for (const o of tuong) {
        document.getElementById("cell_" + o.x + "_" + o.y).classList.add("tuong");
    }

    // Rắn sinh ra trùng tường thì random lại
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
    appleDao = initAppleDoc();
    document.getElementById("title").textContent = "LEVEL 6";
    start();
    timer = setInterval(() => {
        if (dead || win || pause || game.hidden) return;
        let newHead = diChuyen();
        let an = apple !== null && newHead.x === apple.x && newHead.y === apple.y;
        let anDao = appleDao !== null && newHead.x === appleDao.x && newHead.y === appleDao.y;

        if (checkThan(newHead) || checkTuong(newHead)) {
            gameOver();
            return;
        }

        if (an) {
            snake.push(newHead);
            score++;
            apple = initApple();
        } else if (anDao) {
            snake.push(newHead);
            score = score + 2;
            appleDao = initAppleDoc();
        } else {
            let tail = snake.shift();
            tail.x = newHead.x;
            tail.y = newHead.y;
            snake.push(tail);
        }

        if (anDao) {
            count = 20;
        } else if (count > 0) {
            count--;
        }
        document.getElementById("subtitle").textContent = "Level 6 - Điểm: " + score + "/20";
        if (count > 0) {
            document.getElementById("daoPhim").textContent = "Đảo phím: còn " + count + " bước.";
        } else {
            document.getElementById("daoPhim").textContent = "Táo vàng: +2 điểm, đảo phím trong 20 bước.";
        }
        movingKey = key;
        renderSnake();
        checkWin();
    }, 300);
}

function choiLai() {
    if (!dead) return;
    if (level === 1) Level1();
    else if (level === 2) Level2();
    else if (level === 3) Level3();
    else if (level === 4) Level4();
    else if (level === 5) Level5();
    else if (level === 6) Level6();
}

function stopGame() {
    if (game.hidden || dead || win) return;
    pause = !pause;
    document.getElementById("stop").textContent = pause ? "Continue" : "Stop";
}

function quaMan() {
    if (!win || level >= 6) return;
    backMenu();
    if (level === 1) Level2();
    else if (level === 2) Level3();
    else if (level === 3) Level4();
    else if (level === 4) Level5();
    else if (level === 5) Level6();
}

function backMenu() {
    clearInterval(timer);
    timer = null;
    appleDoc = null;
    appleTuong = null;
    appleDao = null;
    count = 0;
    congA = null;
    congB = null;
    tuong = [];
    pause = false;
    document.getElementById("lose").hidden = true;
    document.getElementById("san").hidden = true;
    game.hidden = true;
    document.getElementById("buttons").hidden = true;
    document.getElementById("restart").hidden = true;
    document.getElementById("next").hidden = true;
    document.getElementById("daoPhim").hidden = true;
    document.getElementById("menu").hidden = false;
    document.getElementById("title").textContent = "RẮN SĂN MỒI";
    document.getElementById("subtitle").textContent = "Chọn màn chơi";
}

function Message() {
    document.getElementById("lose").hidden = true;
    document.getElementById("san").hidden = true;
    game.hidden = true;
    document.getElementById("restart").hidden = true;
    document.getElementById("next").hidden = level >= 6;
    document.getElementById("daoPhim").hidden = true;
    document.getElementById("title").textContent = "LEVEL " + level;
    document.getElementById("subtitle").textContent = "YOU WIN";
}

document.addEventListener("keydown", function (event) {
    if (game.hidden || dead || win || pause) return;
    switch (event.key) {
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight": {
            event.preventDefault();

            let newKey = event.key;
            if (level === 6 && count > 0) {
                if (newKey === "ArrowUp") newKey = "ArrowDown";
                else if (newKey === "ArrowDown") newKey = "ArrowUp";
                else if (newKey === "ArrowLeft") newKey = "ArrowRight";
                else if (newKey === "ArrowRight") newKey = "ArrowLeft";
            }

            let currentKey = movingKey || "ArrowLeft";
            if (
                (currentKey === "ArrowUp" && newKey === "ArrowDown") || (currentKey === "ArrowDown" && newKey === "ArrowUp") || (currentKey === "ArrowLeft" && newKey === "ArrowRight") || (currentKey === "ArrowRight" && newKey === "ArrowLeft"))
                return;

            key = newKey;
            break;
        }
    }
});

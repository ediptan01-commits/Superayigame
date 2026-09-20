const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");

const healthText = document.getElementById("health");
const coinsText = document.getElementById("coins");
const scoreText = document.getElementById("score");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const jumpButton = document.getElementById("jump");

let gameRunning = false;

let keys = {
    left: false,
    right: false
};

let score = 0;
let coins = 0;
let health = 3;

let cameraX = 0;

const worldWidth = 6000;

const player = {
    x: 150,
    y: 300,
    width: 55,
    height: 70,

    velocityX: 0,
    velocityY: 0,

    speed: 5,
    jumpPower: 13,

    gravity: 0.6,

    grounded: false
};

let coinList = [];
let enemyList = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function createLevel() {

    coinList = [];
    enemyList = [];

    for (let i = 0; i < 35; i++) {

        coinList.push({
            x: 450 + i * 150,
            y: 300 - Math.random() * 100,
            radius: 12,
            collected: false
        });
    }

    for (let i = 0; i < 15; i++) {

        enemyList.push({
            x: 800 + i * 350,
            y: 390,
            width: 50,
            height: 45,
            speed: 1.5,
            direction: 1
        });
    }
}

function resetGame() {

    player.x = 150;
    player.y = 300;

    player.velocityX = 0;
    player.velocityY = 0;

    score = 0;
    coins = 0;
    health = 3;

    cameraX = 0;

    createLevel();

    updateHUD();
}

function updateHUD() {

    healthText.textContent = health;
    coinsText.textContent = coins;
    scoreText.textContent = score;
}

function jump() {

    if (!gameRunning) return;

    if (player.grounded) {

        player.velocityY = -player.jumpPower;

        player.grounded = false;
    }
}

function updatePlayer() {

    if (keys.left) {
        player.velocityX = -player.speed;
    }
    else if (keys.right) {
        player.velocityX = player.speed;
    }
    else {
        player.velocityX *= 0.8;
    }

    player.velocityY += player.gravity;

    player.x += player.velocityX;
    player.y += player.velocityY;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x > worldWidth - player.width) {
        player.x = worldWidth - player.width;
    }

    const groundY = canvas.height - 110;

    if (player.y + player.height >= groundY) {

        player.y = groundY - player.height;

        player.velocityY = 0;

        player.grounded = true;
    }
    else {
        player.grounded = false;
    }

    cameraX = player.x - canvas.width * 0.35;

    if (cameraX < 0) {
        cameraX = 0;
    }

    if (cameraX > worldWidth - canvas.width) {
        cameraX = worldWidth - canvas.width;
    }
}

function collision(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function updateCoins() {

    for (const coin of coinList) {

        if (coin.collected) continue;

        const distanceX =
            player.x + player.width / 2 - coin.x;

        const distanceY =
            player.y + player.height / 2 - coin.y;

        const distance =
            Math.sqrt(
                distanceX * distanceX +
                distanceY * distanceY
            );

        if (distance < 45) {

            coin.collected = true;

            coins++;

            score += 100;

            updateHUD();
        }
    }
}

function updateEnemies() {

    for (const enemy of enemyList) {

        enemy.x += enemy.speed * enemy.direction;

        if (enemy.x < 700 || enemy.x > worldWidth - 100) {
            enemy.direction *= -1;
        }

        if (collision(player, enemy)) {

            health--;

            updateHUD();

            player.x -= 150;

            player.velocityY = -8;

            if (health <= 0) {

                gameOver();
            }
        }
    }
}

function drawSky() {

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            canvas.height
        );

    gradient.addColorStop(0, "#66c7ff");
    gradient.addColorStop(0.65, "#d9f5ff");
    gradient.addColorStop(0.66, "#6dbd55");
    gradient.addColorStop(1, "#397c38");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function drawCloud(x, y, scale = 1) {

    ctx.fillStyle = "rgba(255,255,255,0.85)";

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        25 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 30 * scale,
        y - 15 * scale,
        35 * scale,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 65 * scale,
        y,
        25 * scale,
        0,
        Math.PI * 2
    );

    ctx.fill();
}

function drawTrees() {

    const groundY = canvas.height - 110;

    for (
        let x = -200;
        x < worldWidth;
        x += 220
    ) {

        const screenX = x - cameraX * 0.5;

        if (
            screenX < -100 ||
            screenX > canvas.width + 100
        ) continue;

        ctx.fillStyle = "#654321";

        ctx.fillRect(
            screenX,
            groundY - 100,
            25,
            100
        );

        ctx.fillStyle = "#287a3c";

        ctx.beginPath();

        ctx.arc(
            screenX + 12,
            groundY - 125,
            55,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

function drawGround() {

    const groundY = canvas.height - 110;

    ctx.fillStyle = "#4d963c";

    ctx.fillRect(
        0,
        groundY,
        canvas.width,
        110
    );

    ctx.fillStyle = "#36752e";

    for (
        let x = -cameraX % 80;
        x < canvas.width;
        x += 80
    ) {

        ctx.fillRect(
            x,
            groundY + 20,
            45,
            8
        );
    }
}

function drawPlayer() {

    const x = player.x - cameraX;
    const y = player.y;

    // Gövde
    ctx.fillStyle = "#8b5a3c";

    ctx.beginPath();

    ctx.roundRect(
        x,
        y + 15,
        player.width,
        player.height - 10,
        20
    );

    ctx.fill();

    // Kulaklar
    ctx.fillStyle = "#70452f";

    ctx.beginPath();

    ctx.arc(
        x + 10,
        y + 12,
        12,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 45,
        y + 12,
        12,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Yüz
    ctx.fillStyle = "#d49b70";

    ctx.beginPath();

    ctx.arc(
        x + 27,
        y + 35,
        20,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Gözler
    ctx.fillStyle = "#111";

    ctx.beginPath();

    ctx.arc(
        x + 20,
        y + 31,
        3,
        0,
        Math.PI * 2
    );

    ctx.arc(
        x + 34,
        y + 31,
        3,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Burun
    ctx.beginPath();

    ctx.arc(
        x + 27,
        y + 40,
        4,
        0,
        Math.PI * 2
    );

    ctx.fill();

    // Ayakkabılar
    ctx.fillStyle = "#222";

    ctx.fillRect(
        x - 4,
        y + player.height - 8,
        25,
        12
    );

    ctx.fillRect(
        x + 34,
        y + player.height - 8,
        25,
        12
    );
}

function drawCoins() {

    for (const coin of coinList) {

        if (coin.collected) continue;

        const x = coin.x - cameraX;

        if (
            x < -30 ||
            x > canvas.width + 30
        ) continue;

        ctx.fillStyle = "#ffd32a";

        ctx.beginPath();

        ctx.arc(
            x,
            coin.y,
            coin.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.strokeStyle = "#fff0a0";

        ctx.lineWidth = 3;

        ctx.stroke();
    }
}

function drawEnemies() {

    for (const enemy of enemyList) {

        const x = enemy.x - cameraX;

        if (
            x < -80 ||
            x > canvas.width + 80
        ) continue;

        ctx.fillStyle = "#713f2c";

        ctx.beginPath();

        ctx.roundRect(
            x,
            enemy.y,
            enemy.width,
            enemy.height,
            12
        );

        ctx.fill();

        ctx.fillStyle = "#fff";

        ctx.beginPath();

        ctx.arc(
            x + 14,
            enemy.y + 15,
            6,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 36,
            enemy.y + 15,
            6,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.fillStyle = "#111";

        ctx.beginPath();

        ctx.arc(
            x + 14,
            enemy.y + 15,
            2,
            0,
            Math.PI * 2
        );

        ctx.arc(
            x + 36,
            enemy.y + 15,
            2,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

function drawFinish() {

    const x = worldWidth - 150 - cameraX;

    if (
        x < -100 ||
        x > canvas.width + 100
    ) return;

    ctx.fillStyle = "#333";

    ctx.fillRect(
        x,
        canvas.height - 210,
        10,
        100
    );

    ctx.fillStyle = "#ff3b30";

    ctx.beginPath();

    ctx.moveTo(
        x + 10,
        canvas.height - 210
    );

    ctx.lineTo(
        x + 90,
        canvas.height - 180
    );

    ctx.lineTo(
        x + 10,
        canvas.height - 150
    );

    ctx.closePath();

    ctx.fill();

    ctx.fillStyle = "#fff";

    ctx.font = "bold 18px Arial";

    ctx.fillText(
        "BİTİŞ",
        x - 5,
        canvas.height - 225
    );
}

function draw() {

    drawSky();

    drawCloud(
        150 - cameraX * 0.2,
        100,
        1
    );

    drawCloud(
        600 - cameraX * 0.15,
        150,
        0.8
    );

    drawTrees();

    drawGround();

    drawCoins();

    drawEnemies();

    drawFinish();

    drawPlayer();
}

function checkFinish() {

    if (player.x >= worldWidth - 180) {

        gameRunning = false;

        menu.style.display = "flex";

        startButton.textContent = "TEKRAR OYNA";

        menu.querySelector("h1").textContent =
            "🏆 BÖLÜM TAMAMLANDI!";

        menu.querySelector("p").textContent =
            "Skor: " + score +
            "   •   Altın: " + coins;
    }
}

function gameOver() {

    gameRunning = false;

    menu.style.display = "flex";

    startButton.textContent = "TEKRAR OYNA";

    menu.querySelector("h1").textContent =
        "💀 OYUN BİTTİ";

    menu.querySelector("p").textContent =
        "Skorun: " + score;
}

function gameLoop() {

    if (gameRunning) {

        updatePlayer();

        updateCoins();

        updateEnemies();

        checkFinish();
    }

    draw();

    requestAnimationFrame(gameLoop);
}

function startGame() {

    resetGame();

    menu.style.display = "none";

    menu.querySelector("h1").textContent =
        "🐻 SÜPER AYI";

    menu.querySelector("p").textContent =
        "Macera şimdi başlıyor!";

    startButton.textContent =
        "OYUNA BAŞLA";

    gameRunning = true;
}

startButton.addEventListener(
    "click",
    startGame
);

leftButton.addEventListener(
    "pointerdown",
    () => {
        keys.left = true;
    }
);

leftButton.addEventListener(
    "pointerup",
    () => {
        keys.left = false;
    }
);

leftButton.addEventListener(
    "pointerleave",
    () => {
        keys.left = false;
    }
);

rightButton.addEventListener(
    "pointerdown",
    () => {
        keys.right = true;
    }
);

rightButton.addEventListener(
    "pointerup",
    () => {
        keys.right = false;
    }
);

rightButton.addEventListener(
    "pointerleave",
    () => {
        keys.right = false;
    }
);

jumpButton.addEventListener(
    "pointerdown",
    jump
);

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {
            keys.left = true;
        }

        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {
            keys.right = true;
        }

        if (
            event.key === "ArrowUp" ||
            event.key === "w" ||
            event.key === " "
        ) {
            jump();
        }
    }
);

window.addEventListener(
    "keyup",
    (event) => {

        if (
            event.key === "ArrowLeft" ||
            event.key === "a"
        ) {
            keys.left = false;
        }

        if (
            event.key === "ArrowRight" ||
            event.key === "d"
        ) {
            keys.right = false;
        }
    }
);

resetGame();

gameLoop();

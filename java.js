const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const winScreen = document.getElementById('winScreen');
let gameOver = false;
let startTime = Date.now();
let leaderboard = {
    'Red': 0,
    'Blue': 0
};

class Player {
    constructor(x, y, color, controls) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.color = color;
        this.controls = controls;
        this.speed = 5;
        this.maxX = canvas.width - this.width;
        this.maxY = canvas.height - this.height;
    }

    draw() {
        ctx.shadowBlur = 10; // Adjust the blur intensity as needed
        ctx.shadowColor = this.color; // Use the player's color for the glow

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Reset shadow properties
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
    }

    move() {
        if (this.controls.left && this.x > 0) this.x -= this.speed;
        if (this.controls.right && this.x < this.maxX) this.x += this.speed;
        if (this.controls.up && this.y > 0) this.y -= this.speed;
        if (this.controls.down && this.y < this.maxY) this.y += this.speed;
    }
}

const player1 = new Player(100, 100, 'red', {
    left: false,
    right: false,
    up: false,
    down: false
});

const player2 = new Player(200, 200, 'blue', {
    left: false,
    right: false,
    up: false,
    down: false
});

function keyHandler(event, status) {
    const keyMap = {
        'a': 'left',
        'd': 'right',
        'w': 'up',
        's': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right',
        'ArrowUp': 'up',
        'ArrowDown': 'down'
    };
    const key = keyMap[event.key];
    if (key) {
        if (event.key === 'a' || event.key === 'd' || event.key === 'w' || event.key === 's') {
            player1.controls[key] = status;
        } else {
            player2.controls[key] = status;
        }
    }
}

document.addEventListener('keydown', (event) => keyHandler(event, true));
document.addEventListener('keyup', (event) => keyHandler(event, false));

function checkCollision() {
    if (player1.x < player2.x + player2.width &&
        player1.x + player1.width > player2.x &&
        player1.y < player2.y + player2.height &&
        player1.y + player1.height > player2.y) {
        gameOver = true;
        updateLeaderboard('Red');
        showWinScreen('Red');
    }
}

function checkTimer() {
    if (Date.now() - startTime > 30000 && !gameOver) {
        gameOver = true;
        updateLeaderboard('Blue');
        showWinScreen('Blue');
    }
}

function drawTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = Math.max(30 - Math.floor((Date.now() - startTime) / 1000), 0);
    timerElement.textContent = `Time left: ${timeLeft}s`;
    if (timeLeft === 0) checkTimer();
}


function updateLeaderboard(winner) {

    if (leaderboard.Red >= 6) {
        gameOver = true;
        showWinScreen2(leaderboard.Red);
    } else if (leaderboard.Blue >= 6) {
        gameOver = true;
        showWinScreen2(leaderboard.Blue);
    } else {
        leaderboard[winner]++;
        gameOver = true;
    }
}

function drawLeaderboard() {
    const redScore = document.getElementById('redScore');
    const blueScore = document.getElementById('blueScore');
    redScore.textContent = `Red: ${leaderboard['Red']}`;
    blueScore.textContent = `Blue: ${leaderboard['Blue']}`;
}


function gameLoop() {


    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player1.move();
        player1.draw();
        player2.move();
        player2.draw();
        checkCollision();
        drawTimer();
        drawLeaderboard();
        requestAnimationFrame(gameLoop);
    }
}

function showWinScreen(winner) {
    winScreen.style.display = 'block';
    winScreen.textContent = winner + ' wins!';
    setTimeout(function () {
        winScreen.style.display = 'none';
        resetGame();
        if (leaderboard.Red == 6) {
            gameOver = true;
            document.getElementById("secr").innerHTML = "Red"
            showWinScreen2();
        } else if (leaderboard.Blue == 6) {
            gameOver = true;
            showWinScreen2();
            document.getElementById("secr").innerHTML = "Blue"

        }
    }, 3000);
}

function showWinScreen2() {
    winScreen.style.display = 'none';
    var ser = document.getElementById("secr").innerHTML;
    var sapce = "    "
    var r = confirm(ser + sapce + "win the game with 6 points! play again ?");
    if (r == true) {
        player1.x = 100;
        player1.y = 100;
        player2.x = 200;
        player2.y = 200;
        startTime = Date.now();
        gameOver = false;
        gameLoop();
        leaderboard['Red'] = 0;
        leaderboard['Blue'] = 0;
        document.getElementById("secr").innerHTML = ""
    }
    else {
        window.location.href = 'https://www.google.com';
    }
}

function resetGame() {
    player1.x = 100;
    player1.y = 100;
    player2.x = 200;
    player2.y = 200;
    startTime = Date.now();
    gameOver = false;
    gameLoop();
}




gameLoop();

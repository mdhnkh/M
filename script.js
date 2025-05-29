const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball properties
let x = canvas.width / 2;
let y = canvas.height - 30;
let isGameOver = false;
let dx = 2;
let dy = -2;
const ballRadius = 10;

// Paddle properties
const paddleHeight = 10;
const paddleWidth = 75;
let score = 0;
let paddleX = (canvas.width - paddleWidth) / 2;

// Brick properties
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// Bricks array
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

// Control state
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener('click', mouseClickHandlerForRestart, false);

function mouseClickHandlerForRestart() {
    if (isGameOver) {
        resetGame();
        draw(); // Restart the game loop immediately
    }
}

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}


function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;

                        // Check for win condition
                        let bricksLeft = 0;
                        for (let c2 = 0; c2 < brickColumnCount; c2++) {
                            for (let r2 = 0; r2 < brickRowCount; r2++) {
                                if (bricks[c2][r2].status === 1) {
                                    bricksLeft++;
                                }
                            }
                        }
                        if (bricksLeft === 0) {
                            isGameOver = true; 
                            // We'll use a flag or check score to display win message
                        }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = '#0095DD';
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function draw() {
    if (isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '24px Arial';
        ctx.fillStyle = '#0095DD';
        ctx.textAlign = 'center';
            
            if (score === brickRowCount * brickColumnCount) { // WIN CONDITION
                ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 20);
            } else { // GAME OVER CONDITION
                ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);
            }
            
        ctx.font = '16px Arial';
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 20);
            ctx.textAlign = 'left'; // Reset alignment
            return; 
    }

        // ... rest of the draw function
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            isGameOver = true; // Set game over state
        }
    }

    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    } else if (leftPressed && paddleX > 0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function resetGame() {
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 2; // Or your initial dx
    dy = -2; // Or your initial dy
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    isGameOver = false;

    // Reset bricks status
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r].status = 1;
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText('Score: ' + score, 8, 20);
}

draw();

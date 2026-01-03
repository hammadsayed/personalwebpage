// Matrix Rain Animation
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size to full screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters to use for the rain
const chars = '01010101ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$%^&*()_+';
const charArray = chars.split('');

const fontSize = 14;
const columns = canvas.width / fontSize;

// Array to keep track of the y position of each column
const drops = [];
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

function drawMatrix() {
    // Translucent black background to create trail effect
    ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff41'; // Hacker Green
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it has crossed the screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

// Run the animation
setInterval(drawMatrix, 33);

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});


// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';

    // Add a slight delay for the trail for a cool effect
    setTimeout(() => {
        cursorTrail.style.left = e.clientX + 'px';
        cursorTrail.style.top = e.clientY + 'px';
    }, 50);
});

// Add hover effect for links
const links = document.querySelectorAll('a, button');
links.forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.background = '#bc13fe'; // Change color on hover
        cursorTrail.style.borderColor = '#00ff41';
    });

    link.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = '#00ff41';
        cursorTrail.style.borderColor = '#bc13fe';
    });
});

// Cyber Dodge Mini-Game Logic
const gameCanvas = document.getElementById('game-canvas');
const gameCtx = gameCanvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreSpan = document.getElementById('final-score');

// Game State
let gameRunning = false;
let score = 0;
let gameSpeed = 3;
let player = { x: 0, y: 0, size: 20, color: '#00ff41' };
let obstacles = [];
let keys = {};

// Resize canvas to match display size for crisp rendering
function resizeGameCanvas() {
    const rect = gameCanvas.getBoundingClientRect();
    if (rect) {
        gameCanvas.width = rect.width;
        gameCanvas.height = rect.height;
        // Reset player position to bottom center
        player.y = gameCanvas.height - 40;
        player.x = gameCanvas.width / 2 - 10;
    }
}

window.addEventListener('resize', resizeGameCanvas);
// Call once to init, but checking if element exists first (it should)
if (gameCanvas) {
    resizeGameCanvas();
}

// Input Handling
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// Game Functionions
function spawnObstacle() {
    const size = Math.random() * 20 + 10;
    const x = Math.random() * (gameCanvas.width - size);
    obstacles.push({
        x: x,
        y: -size,
        width: size,
        height: size,
        speed: Math.random() * 2 + gameSpeed,
        color: Math.random() > 0.5 ? '#bc13fe' : '#ff5f56' // Purple or Red
    });
}

function updateGame() {
    if (!gameRunning) return;

    // Move Player
    if (keys['ArrowLeft'] && player.x > 0) player.x -= 5;
    if (keys['ArrowRight'] && player.x < gameCanvas.width - player.size) player.x += 5;

    // Spawn Obstacles randomly
    if (Math.random() < 0.05) spawnObstacle();

    // Update Obstacles
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        obs.y += obs.speed;

        // Collision Detection
        if (
            player.x < obs.x + obs.width &&
            player.x + player.size > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.size > obs.y
        ) {
            gameOver();
            return;
        }

        // Cleanup and Score
        if (obs.y > gameCanvas.height) {
            obstacles.splice(i, 1);
            i--;
            score += 10;
            scoreElement.innerText = `Score: ${score}`;

            // Increase diffculty slightly
            if (score % 100 === 0) gameSpeed += 0.5;
        }
    }
}

function drawGame() {
    // Clear
    gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Draw Player (Triangle for ship look?)
    gameCtx.fillStyle = player.color;
    gameCtx.beginPath();
    gameCtx.moveTo(player.x + player.size / 2, player.y);
    gameCtx.lineTo(player.x + player.size, player.y + player.size);
    gameCtx.lineTo(player.x, player.y + player.size);
    gameCtx.fill();

    // Draw Obstacles (Glitched Rects)
    obstacles.forEach(obs => {
        gameCtx.fillStyle = obs.color;
        gameCtx.fillRect(obs.x, obs.y, obs.width, obs.height);

        // Add random glitch effect
        if (Math.random() > 0.8) {
            gameCtx.fillStyle = '#fff';
            gameCtx.fillRect(obs.x + Math.random() * 5, obs.y, 2, obs.height);
        }
    });

    if (gameRunning) requestAnimationFrame(() => {
        updateGame();
        drawGame();
    });
}

function startGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 3;
    obstacles = [];
    scoreElement.innerText = "Score: 0";
    gameOverScreen.classList.add('hidden');
    startBtn.style.display = 'none'; // Hide start button during game
    resizeGameCanvas(); // Ensure size is correct
    drawGame();
}

function gameOver() {
    gameRunning = false;
    finalScoreSpan.innerText = score;
    gameOverScreen.classList.remove('hidden');
    startBtn.style.display = 'block';
    startBtn.innerText = "RESTART"; // Just in case, but we have a dedicated reboot button too
}

if (startBtn) startBtn.addEventListener('click', startGame);
if (restartBtn) restartBtn.addEventListener('click', startGame);

// Draw initial frame if ready
if (gameCanvas) {
    resizeGameCanvas();
    gameCtx.fillStyle = '#00ff41';
    gameCtx.font = "20px monospace";
    gameCtx.fillText("SYSTEM READY...", 50, 50);
}
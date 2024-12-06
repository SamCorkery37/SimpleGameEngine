const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 400;
canvas.height = 300;

// Game variables
let player = { x: 180, y: 250, width: 40, height: 40, color: 'lime', speed: 5 };
let bullets = [];
let enemies = [];
let isGameOver = false;

// Input tracking
let keys = {};

window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Update game state
function update() {
    // Player movement
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x + player.width < canvas.width) player.x += player.speed;

    // Shooting bullets
    if (keys[' '] && bullets.length < 10) {
        bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 5, height: 10, speed: 7 });
        keys[' '] = false; // Prevent holding space to spam bullets
    }

    // Move bullets
    bullets = bullets.filter(bullet => bullet.y > 0);
    bullets.forEach(bullet => bullet.y -= bullet.speed);

    // Spawn enemies
    if (Math.random() < 0.02) {
        enemies.push({ x: Math.random() * (canvas.width - 40), y: -40, width: 40, height: 40, speed: 2 });
    }

    // Move enemies
    enemies = enemies.filter(enemy => enemy.y < canvas.height);
    enemies.forEach(enemy => enemy.y += enemy.speed);

    // Collision detection
    enemies.forEach((enemy, enemyIndex) => {
        bullets.forEach((bullet, bulletIndex) => {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Remove bullet and enemy
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
            }
        });

        // Check if enemy hits player
        if (enemy.x < player.x + player.width &&
            enemy.x + enemy.width > player.x &&
            enemy.y < player.y + player.height &&
            enemy.y + enemy.height > player.y) {
            isGameOver = true;
        }
    });
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = 'yellow';
    bullets.forEach(bullet => ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height));

    // Draw enemies
    ctx.fillStyle = 'red';
    enemies.forEach(enemy => ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height));

    // Draw game over
    if (isGameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText('Game Over', 120, 150);
    }
}

// Game loop
function gameLoop() {
    if (!isGameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}
gameLoop();

// Global variables
let currentMessage = 1;
let noClickCount = 0;

// Game variables
let gameActive = false;
let heartsCaught = 0;
let gameTimer = 30;
let gameInterval;
let timerInterval;
let playerPosition = 50; // percentage from left
let fallingHearts = [];

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Show game first, messages are hidden initially
    setupGameControls();
    
    // Detect if mobile device
    if (window.innerWidth <= 768) {
        document.getElementById('mobileControls').style.display = 'flex';
    }
});

/**
 * Show a specific message by number
 * @param {number} messageNumber - The message number to show (1, 2, or 3)
 */
function showMessage(messageNumber) {
    console.log(`Attempting to show message ${messageNumber}`);
    
    // Hide all messages first and reset their styles
    const allMessages = document.querySelectorAll('.message-card');
    allMessages.forEach(message => {
        message.classList.remove('active');
        message.style.opacity = '';
        message.style.transform = '';
        message.style.position = 'absolute';
    });
    
    // Show the requested message after a brief delay
    setTimeout(() => {
        const targetMessage = document.getElementById(`message${messageNumber}`);
        if (targetMessage) {
            targetMessage.classList.add('active');
            targetMessage.style.position = 'relative';
            currentMessage = messageNumber;
            console.log(`Message ${messageNumber} is now active`);
        } else {
            console.error(`Message ${messageNumber} not found`);
        }
    }, 300);
}

/**
 * Show the next message in sequence
 * @param {number} nextMessageNumber - The next message number to display
 */
function showNextMessage(nextMessageNumber) {
    console.log(`Transitioning from message ${currentMessage} to message ${nextMessageNumber}`);
    
    // Prevent multiple rapid clicks
    if (window.transitioning) {
        console.log('Transition already in progress, ignoring click');
        return;
    }
    window.transitioning = true;
    
    // Add a gentle fade effect
    const currentMessageElement = document.getElementById(`message${currentMessage}`);
    if (currentMessageElement) {
        currentMessageElement.style.transition = 'all 0.4s ease';
        currentMessageElement.style.transform = 'translateY(-30px) scale(0.95)';
        currentMessageElement.style.opacity = '0';
    }
    
    // Show next message after transition
    setTimeout(() => {
        showMessage(nextMessageNumber);
        window.transitioning = false;
    }, 450);
}

/**
 * Handle when the "Yes" button is clicked
 */
function handleYes() {
    // Hide the current message
    const messageContainer = document.getElementById('messageContainer');
    const daisyContainer = document.getElementById('daisyContainer');
    
    // Add celebration effect
    messageContainer.style.transform = 'scale(0.9)';
    messageContainer.style.opacity = '0';
    
    // Show daisy animation after a brief delay
    setTimeout(() => {
        daisyContainer.classList.add('show');
        
        // Add some extra celebration effects
        createConfetti();
        
        // Play a success animation on the yes button
        const yesBtn = document.getElementById('yesBtn');
        yesBtn.style.transform = 'scale(1.2)';
        yesBtn.style.background = 'linear-gradient(135deg, #48BB78, #38A169)';
        
    }, 500);
}

/**
 * Handle when the "No" button is clicked - make it move around playfully
 */
function handleNo() {
    const noBtn = document.getElementById('noBtn');
    const buttonContainer = document.querySelector('.final-buttons');
    const containerRect = buttonContainer.getBoundingClientRect();
    
    noClickCount++;
    
    // Add moving class for smooth animation
    noBtn.classList.add('moving');
    
    // Calculate random position within the container bounds
    const maxX = containerRect.width - noBtn.offsetWidth;
    const maxY = containerRect.height - noBtn.offsetHeight;
    
    // Generate random positions, but ensure they're not too close to the Yes button
    let randomX, randomY;
    let attempts = 0;
    
    do {
        randomX = Math.random() * maxX;
        randomY = Math.random() * maxY;
        attempts++;
    } while (attempts < 10 && isPositionTooCloseToYes(randomX, randomY));
    
    // Apply the new position
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    noBtn.style.transform = 'none';
    
    // Change button text based on click count for playful interaction
    const messages = [
        "No",
        "Are you sure?",
        "Really?",
        "Think again!",
        "Come on...",
        "Pretty please?",
        "One more try?",
        "I believe in us!",
        "Don't give up!",
        "Yes? 😊"
    ];
    
    if (noClickCount < messages.length) {
        noBtn.textContent = messages[noClickCount];
    }
    
    // Add a little shake animation
    noBtn.style.animation = 'shake 0.5s ease-in-out';
    
    // Remove the moving class after animation
    setTimeout(() => {
        noBtn.classList.remove('moving');
        noBtn.style.animation = '';
    }, 500);
    
    // If they've clicked "No" many times, make the button smaller and add pleading text
    if (noClickCount >= 5) {
        noBtn.style.transform = 'scale(0.9)';
        noBtn.style.background = 'linear-gradient(135deg, #FF6B6B, #EE5A52)';
    }
}

/**
 * Check if the new position is too close to the Yes button
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {boolean} - True if too close
 */
function isPositionTooCloseToYes(x, y) {
    const yesBtn = document.getElementById('yesBtn');
    const yesRect = yesBtn.getBoundingClientRect();
    const buttonContainer = document.querySelector('.final-buttons');
    const containerRect = buttonContainer.getBoundingClientRect();
    
    // Calculate Yes button position relative to container
    const yesX = yesRect.left - containerRect.left;
    const yesY = yesRect.top - containerRect.top;
    
    // Check distance
    const distance = Math.sqrt(Math.pow(x - yesX, 2) + Math.pow(y - yesY, 2));
    return distance < 120; // Minimum distance of 120px
}

/**
 * Create confetti effect for celebration
 */
function createConfetti() {
    const confettiColors = ['#8B5FBF', '#6B46C1', '#553C9A', '#9F7AEA', '#B794F6'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    
    document.body.appendChild(confettiContainer);
    
    // Create multiple confetti pieces
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createConfettiPiece(confettiContainer, confettiColors);
        }, i * 100);
    }
    
    // Remove confetti container after animation
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 5000);
}

/**
 * Create a single confetti piece
 * @param {HTMLElement} container - Container element
 * @param {Array} colors - Array of colors to use
 */
function createConfettiPiece(container, colors) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    confetti.style.position = 'absolute';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-10px';
    confetti.style.borderRadius = '50%';
    confetti.style.animation = `confettiFall ${2 + Math.random() * 3}s linear forwards`;
    
    container.appendChild(confetti);
    
    // Remove confetti piece after animation
    setTimeout(() => {
        if (container.contains(confetti)) {
            container.removeChild(confetti);
        }
    }, 5000);
}

// Add CSS animation for confetti (injected via JavaScript)
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(calc(100vh + 20px)) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Add window resize handler for responsive behavior
window.addEventListener('resize', function() {
    // Reset no button position if window is resized
    if (currentMessage === 3 && noClickCount > 0) {
        const noBtn = document.getElementById('noBtn');
        noBtn.style.left = '50%';
        noBtn.style.top = '0';
        noBtn.style.transform = 'translateX(10px)';
        noClickCount = 0;
        noBtn.textContent = 'No';
    }
});

/**
 * Start the heart catching game
 */
function startGame() {
    if (gameActive) return;
    
    gameActive = true;
    heartsCaught = 0;
    gameTimer = 30;
    fallingHearts = [];
    
    // Update UI
    document.getElementById('heartCount').textContent = heartsCaught;
    document.getElementById('gameTimer').textContent = gameTimer;
    document.getElementById('startGameBtn').disabled = true;
    document.getElementById('startGameBtn').textContent = 'Playing...';
    
    // Show mobile controls if on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('mobileControls').style.display = 'flex';
    }
    
    // Start game timer
    timerInterval = setInterval(() => {
        gameTimer--;
        document.getElementById('gameTimer').textContent = gameTimer;
        
        if (gameTimer <= 0) {
            endGame(false);
        }
    }, 1000);
    
    // Start spawning hearts
    gameInterval = setInterval(spawnHeart, 800);
    
    // Start collision detection
    const collisionInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(collisionInterval);
            return;
        }
        checkCollisions();
    }, 50);
}

/**
 * Spawn a falling heart
 */
function spawnHeart() {
    if (!gameActive) return;
    
    const gameArea = document.getElementById('gameArea');
    const heart = document.createElement('div');
    heart.className = 'falling-heart';
    heart.textContent = '💜';
    heart.style.left = Math.random() * 85 + '%';
    
    const heartId = Date.now() + Math.random();
    heart.dataset.heartId = heartId;
    
    fallingHearts.push({
        element: heart,
        id: heartId,
        left: parseFloat(heart.style.left)
    });
    
    gameArea.appendChild(heart);
    
    // Remove heart after animation
    setTimeout(() => {
        if (heart.parentNode) {
            heart.parentNode.removeChild(heart);
            fallingHearts = fallingHearts.filter(h => h.id !== heartId);
        }
    }, 3000);
}

/**
 * Check for collisions between player and falling hearts
 */
function checkCollisions() {
    if (!gameActive) return;
    
    const player = document.getElementById('player');
    const playerRect = player.getBoundingClientRect();
    
    fallingHearts.forEach(heartData => {
        if (!heartData.element.parentNode) return;
        
        const heartRect = heartData.element.getBoundingClientRect();
        
        // Check if player and heart overlap
        if (playerRect.left < heartRect.right && 
            playerRect.right > heartRect.left && 
            playerRect.top < heartRect.bottom && 
            playerRect.bottom > heartRect.top) {
            
            // Heart caught!
            heartsCaught++;
            document.getElementById('heartCount').textContent = heartsCaught;
            
            // Remove caught heart with animation
            heartData.element.style.animation = 'none';
            heartData.element.style.transform = 'scale(1.5)';
            heartData.element.style.opacity = '0';
            heartData.element.style.zIndex = '20';
            
            setTimeout(() => {
                if (heartData.element.parentNode) {
                    heartData.element.parentNode.removeChild(heartData.element);
                }
            }, 200);
            
            // Remove from array
            fallingHearts = fallingHearts.filter(h => h.id !== heartData.id);
            
            // Check win condition
            if (heartsCaught >= 10) {
                endGame(true);
                return;
            }
        }
    });
}

/**
 * End the game
 */
function endGame(won) {
    gameActive = false;
    
    // Clear intervals
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    
    // Clear remaining hearts
    fallingHearts.forEach(heart => {
        if (heart.element.parentNode) {
            heart.element.parentNode.removeChild(heart.element);
        }
    });
    fallingHearts = [];
    
    const gameContainer = document.getElementById('gameContainer');
    
    if (won) {
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'game-success';
        successDiv.innerHTML = '🎉 Amazing! You won the game! 🎉<br>Here\'s something for you...';
        gameContainer.appendChild(successDiv);
        
        // Transition to messages after delay
        setTimeout(() => {
            gameContainer.style.transform = 'scale(0.9)';
            gameContainer.style.opacity = '0';
            
            setTimeout(() => {
                document.getElementById('gameContainer').style.display = 'none';
                document.getElementById('messageContainer').style.display = 'block';
                
                // Show first message
                setTimeout(() => {
                    const firstMessage = document.getElementById('message1');
                    if (firstMessage) {
                        firstMessage.classList.add('active');
                        currentMessage = 1;
                    }
                }, 300);
            }, 500);
        }, 2000);
        
    } else {
        // Show try again message then show messages anyway
        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';
        gameOverDiv.innerHTML = '⏰ Time\'s up! But here\'s something for you anyway...';
        gameContainer.appendChild(gameOverDiv);
        
        // Transition to messages after delay (even on failure)
        setTimeout(() => {
            gameContainer.style.transform = 'scale(0.9)';
            gameContainer.style.opacity = '0';
            
            setTimeout(() => {
                document.getElementById('gameContainer').style.display = 'none';
                document.getElementById('messageContainer').style.display = 'block';
                
                // Show first message
                setTimeout(() => {
                    const firstMessage = document.getElementById('message1');
                    if (firstMessage) {
                        firstMessage.classList.add('active');
                        currentMessage = 1;
                    }
                }, 300);
            }, 500);
        }, 2000);
    }
}

/**
 * Setup game controls
 */
function setupGameControls() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameActive) return;
        
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
            movePlayer(-5);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
            movePlayer(5);
        }
    });
    
    // Mobile controls
    document.getElementById('leftBtn').addEventListener('click', () => {
        if (gameActive) movePlayer(-5);
    });
    
    document.getElementById('rightBtn').addEventListener('click', () => {
        if (gameActive) movePlayer(5);
    });
    
    // Touch controls for game area
    let touchStartX = 0;
    const gameArea = document.getElementById('gameArea');
    
    gameArea.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    gameArea.addEventListener('touchmove', (e) => {
        if (!gameActive) return;
        e.preventDefault();
        
        const touchX = e.touches[0].clientX;
        const gameAreaRect = gameArea.getBoundingClientRect();
        const relativeX = ((touchX - gameAreaRect.left) / gameAreaRect.width) * 100;
        
        playerPosition = Math.max(5, Math.min(95, relativeX));
        updatePlayerPosition();
    }, { passive: false });
}

/**
 * Move player left or right
 */
function movePlayer(direction) {
    playerPosition += direction;
    playerPosition = Math.max(5, Math.min(95, playerPosition));
    updatePlayerPosition();
}

/**
 * Update player visual position
 */
function updatePlayerPosition() {
    const player = document.getElementById('player');
    player.style.left = playerPosition + '%';
}

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, { passive: true });

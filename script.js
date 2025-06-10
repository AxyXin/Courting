// Global variables
let currentMessage = 1;
let noClickCount = 0;

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    // Set initial message state - just show message 1 directly
    setTimeout(() => {
        const firstMessage = document.getElementById('message1');
        if (firstMessage) {
            firstMessage.classList.add('active');
            currentMessage = 1;
        }
    }, 300);
});

/**
 * Show a specific message by number
 * @param {number} messageNumber - The message number to show (1, 2, or 3)
 */
function showMessage(messageNumber) {
    // Hide all messages first
    const allMessages = document.querySelectorAll('.message-card');
    allMessages.forEach(message => {
        message.classList.remove('active');
    });
    
    // Show the requested message after a brief delay
    setTimeout(() => {
        const targetMessage = document.getElementById(`message${messageNumber}`);
        if (targetMessage) {
            targetMessage.classList.add('active');
            currentMessage = messageNumber;
        }
    }, 300);
}

/**
 * Show the next message in sequence
 * @param {number} nextMessageNumber - The next message number to display
 */
function showNextMessage(nextMessageNumber) {
    console.log(`Showing next message: ${nextMessageNumber}`);
    
    // Add a gentle fade effect
    const currentMessageElement = document.getElementById(`message${currentMessage}`);
    if (currentMessageElement) {
        currentMessageElement.style.transform = 'translateY(-30px) scale(0.95)';
        currentMessageElement.style.opacity = '0';
    }
    
    // Show next message after transition
    setTimeout(() => {
        showMessage(nextMessageNumber);
    }, 400);
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

// Add touch support for mobile devices
document.addEventListener('touchstart', function() {}, { passive: true });

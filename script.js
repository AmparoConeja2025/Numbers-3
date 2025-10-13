enterFullscreen()

// --- TRUE FULLSCREEN MODE FOR ANDROID ---
function enterFullscreen() {
  if (document.body.requestFullscreen && !document.fullscreenElement) {
    document.body.requestFullscreen({ navigationUI: "hide" }).catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  }
}
document.addEventListener('click', enterFullscreen, { once: true });
document.addEventListener('touchstart', enterFullscreen, { once: true });

// MOBILE-ONLY ENFORCEMENT
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 1024;
}

function isDeveloperMode() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.search.includes('dev=true');
}

function showDesktopMessage() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 40px;
        ">
            <div style="
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 40px;
                border-radius: 20px;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
            ">
                <h1 style="font-size: 32px; margin-bottom: 20px;">📱 Mobile Learning App</h1>
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px;">
                    This interactive learning tool is designed specifically for mobile devices to provide the optimal touch-based learning experience.
                </p>
                <p style="font-size: 18px; line-height: 1.6; margin-bottom: 20px; font-style: italic;">
                    Esta herramienta de aprendizaje interactiva está diseñada específicamente para dispositivos móviles para brindar la experiencia de aprendizaje táctil óptima.
                </p>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; opacity: 0.9;">
                    Visit our main site on your smartphone to access all of our available learning apps.<br>
                    <em>Visita nuestro sitio principal en tu teléfono para acceder a todas nuestras aplicaciones de aprendizaje disponibles.</em>
                </p>
                <div style="
                    background: rgba(255, 255, 255, 0.1);
                    padding: 20px;
                    border-radius: 12px;
                    font-size: 16px;
                    opacity: 0.9;
                ">
                    <strong>https://amparoconeja.com</strong>
                </div>
            </div>
        </div>
    `;
}

if (!isMobileDevice() && !isDeveloperMode()) {
    showDesktopMessage();
    throw new Error('Desktop access blocked - mobile device required');
}

const numbers = {
    0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 
    5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
    11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen',
    16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty',
    21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five',
    26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty',
    31: 'thirty-one', 32: 'thirty-two', 33: 'thirty-three', 34: 'thirty-four', 35: 'thirty-five',
    36: 'thirty-six', 37: 'thirty-seven', 38: 'thirty-eight', 39: 'thirty-nine', 40: 'forty',
    41: 'forty-one', 42: 'forty-two', 43: 'forty-three', 44: 'forty-four', 45: 'forty-five',
    46: 'forty-six', 47: 'forty-seven', 48: 'forty-eight', 49: 'forty-nine', 50: 'fifty',
    51: 'fifty-one', 52: 'fifty-two', 53: 'fifty-three', 54: 'fifty-four', 55: 'fifty-five',
    56: 'fifty-six', 57: 'fifty-seven', 58: 'fifty-eight', 59: 'fifty-nine', 60: 'sixty',
    61: 'sixty-one', 62: 'sixty-two', 63: 'sixty-three', 64: 'sixty-four', 65: 'sixty-five',
    66: 'sixty-six', 67: 'sixty-seven', 68: 'sixty-eight', 69: 'sixty-nine', 70: 'seventy',
    71: 'seventy-one', 72: 'seventy-two', 73: 'seventy-three', 74: 'seventy-four', 75: 'seventy-five',
    76: 'seventy-six', 77: 'seventy-seven', 78: 'seventy-eight', 79: 'seventy-nine', 80: 'eighty',
    81: 'eighty-one', 82: 'eighty-two', 83: 'eighty-three', 84: 'eighty-four', 85: 'eighty-five',
    86: 'eighty-six', 87: 'eighty-seven', 88: 'eighty-eight', 89: 'eighty-nine', 90: 'ninety',
    91: 'ninety-one', 92: 'ninety-two', 93: 'ninety-three', 94: 'ninety-four', 95: 'ninety-five',
    96: 'ninety-six', 97: 'ninety-seven', 98: 'ninety-eight', 99: 'ninety-nine', 100: 'one hundred'
};

let currentNumber = null;
let currentVoice = 'adam';
let score = 0;
let currentMode = 'basic';
let usedNumbers = [];
let droppedNumber = null;
let isShowingCelebration = false;

const dropZone = document.getElementById('dropZone');
const dropZonePlaceholder = document.getElementById('dropZonePlaceholder');
const numbersBank = document.getElementById('numbersBank');
const fireworksContainer = document.getElementById('fireworksContainer');

let audioUnlocked = false;

function unlockAudio() {
    if (!audioUnlocked) {
        audioUnlocked = true;
        console.log('Audio unlocked for mobile');
    }
}

function speakNumber(number) {
    unlockAudio();
    
    const audioFile = `/audio/${currentVoice}_${number}.mp3`;
    console.log('Trying to load:', audioFile);
    const audio = document.getElementById(`${currentVoice}Audio`);
    audio.src = audioFile;
    
    audio.play().catch(error => {
        console.log('Audio file not found, using speech synthesis');
        const utterance = new SpeechSynthesisUtterance(numbers[number]);
        utterance.rate = 0.7;
        utterance.pitch = 1.0;
        speechSynthesis.speak(utterance);
    });
}

function getNumberRange() {
    switch(currentMode) {
        case 'basic': return Array.from({length: 11}, (_, i) => i);
        case 'intermediate': return Array.from({length: 21}, (_, i) => i);
        case 'advanced': return [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90, 100];
        case 'expert': return Array.from({length: 100}, (_, i) => i + 1);
        default: return Array.from({length: 11}, (_, i) => i);
    }
}

function generateRandomNumber() {
    const range = getNumberRange();
    const available = range.filter(n => !usedNumbers.includes(n));
    
    if (available.length === 0) {
        usedNumbers = [];
        return range[Math.floor(Math.random() * range.length)];
    }
    
    const randomNum = available[Math.floor(Math.random() * available.length)];
    usedNumbers.push(randomNum);
    
    if (usedNumbers.length > 5) {
        usedNumbers = usedNumbers.slice(-5);
    }
    
    return randomNum;
}

function generateNumberOptions(correctNumber) {
    const range = getNumberRange();
    let filteredRange;
    
    if (currentMode === 'intermediate') {
        if (correctNumber <= 9) filteredRange = range.filter(n => n <= 9);
        else filteredRange = range.filter(n => n >= 10);
    } else if (currentMode === 'advanced') {
        if (correctNumber <= 20) filteredRange = range.filter(n => n <= 20);
        else filteredRange = range.filter(n => n >= 30);
    } else {
        filteredRange = range;
    }
    
    const options = [correctNumber];
    
    while (options.length < 4) {
        const randomChoice = filteredRange[Math.floor(Math.random() * filteredRange.length)];
        if (!options.includes(randomChoice)) {
            options.push(randomChoice);
        }
    }
    
    return options.sort(() => Math.random() - 0.5);
}

function createNumberBank() {
    numbersBank.innerHTML = '';
    const options = generateNumberOptions(currentNumber);
    
    options.forEach(num => {
        const tile = document.createElement('button');
        tile.className = 'number-tile';
        tile.textContent = num;
        tile.addEventListener('click', () => handleNumberClick(num, tile));
        numbersBank.appendChild(tile);
    });
}

function handleNumberClick(number, tile) {
    if (droppedNumber !== null) return;
    animateNumberToDropZone(number, tile);
}

function animateNumberToDropZone(number, originalTile) {
    const startRect = originalTile.getBoundingClientRect();
    const dropRect = dropZone.getBoundingClientRect();
    
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;
    const endX = dropRect.left + dropRect.width / 2;
    const endY = dropRect.top + dropRect.height / 2;
    
    const flyingNumber = document.createElement('div');
    flyingNumber.textContent = number;
    flyingNumber.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: 36px;
        font-weight: 900;
        color: white;
        background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
        padding: 20px;
        border-radius: 15px;
        z-index: 999;
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
    `;
    
    document.body.appendChild(flyingNumber);
    originalTile.style.opacity = '0.3';
    
    requestAnimationFrame(() => {
        flyingNumber.style.left = endX + 'px';
        flyingNumber.style.top = endY + 'px';
        flyingNumber.style.transform = 'translate(-50%, -50%) scale(1.2)';
    });
    
    setTimeout(() => {
        document.body.removeChild(flyingNumber);
        moveToDropZone(number, originalTile);
    }, 600);
}

function moveToDropZone(number, originalTile) {
    droppedNumber = number;
    dropZonePlaceholder.innerHTML = `<div class="dropped-number">${number}</div>`;
    originalTile.style.opacity = '1';
    
    setTimeout(() => {
        checkAnswer(number, originalTile);
    }, 300);
}

function checkAnswer(selectedNumber, originalTile) {
    if (selectedNumber === currentNumber) {
        handleCorrectAnswer();
    } else {
        handleIncorrectAnswer(originalTile);
    }
}

function handleCorrectAnswer() {
    score += 1;
    addPoints(1);
    isShowingCelebration = true;
    
    dropZone.classList.add('has-number', 'celebration');
    dropZonePlaceholder.innerHTML = `<div class="celebration-word">${numbers[currentNumber]}</div>`;
    
    createFireworks();

    setTimeout(() => {
        const numberTiles = document.querySelectorAll('.number-tile');
        numberTiles.forEach(tile => {
            if (parseInt(tile.textContent) === currentNumber) {
                tile.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                tile.style.animation = 'numberPulse 0.8s ease-in-out infinite';
            }
        });
    }, 100);
    
    setTimeout(() => {
        speakNumber(currentNumber);
    }, 500);
}

function handleIncorrectAnswer(originalTile) {
    const droppedNumberEl = dropZonePlaceholder.querySelector('.dropped-number');
    if (droppedNumberEl) {
        animateNumberFlyOut(droppedNumberEl.textContent, originalTile);
    }
}

function animateNumberFlyOut(numberText, originalTile) {
    const dropRect = dropZone.getBoundingClientRect();
    const startX = dropRect.left + dropRect.width / 2;
    const startY = dropRect.top + dropRect.height / 2;
    
    const flyingReject = document.createElement('div');
    flyingReject.textContent = numberText;
    flyingReject.style.cssText = `
        position: fixed;
        left: ${startX}px;
        top: ${startY}px;
        font-size: 72px;
        font-weight: 900;
        color: #ef4444;
        z-index: 999;
        pointer-events: none;
        transform: translate(-50%, -50%);
        transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
    `;
    
    document.body.appendChild(flyingReject);
    resetDropZone();
    
    setTimeout(() => {
        flyingReject.style.transform = 'translate(-200%, -200%) scale(0.3) rotate(720deg)';
        flyingReject.style.opacity = '0';
        flyingReject.style.color = '#dc2626';
    }, 100);
            
    setTimeout(() => {
        document.body.removeChild(flyingReject);
        originalTile.style.visibility = 'visible';
        originalTile.style.opacity = '1';
        speakNumber(currentNumber);
    }, 600);
}

function resetDropZone() {
    droppedNumber = null;
    dropZone.classList.remove('has-number', 'celebration');
    dropZonePlaceholder.innerHTML = '';
}

function createFireworks() {
    const fireworkColors = ['#FFD700', '#FF6B47', '#4ECDC4', '#45B7D1', '#FF69B4', '#32CD32', '#FF4500', '#9370DB', '#00CED1', '#FFB6C1'];
    const container = document.getElementById('fireworksContainer');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    const burstPoints = [
        { x: centerX - 150, y: centerY - 80 },
        { x: centerX + 150, y: centerY - 80 },
        { x: centerX, y: centerY - 100 },
        { x: centerX - 80, y: centerY + 40 },
        { x: centerX + 80, y: centerY + 40 }
    ];
    
    for (let wave = 0; wave < 1; wave++) {
        setTimeout(() => {
            burstPoints.forEach((point, burstIndex) => {
                setTimeout(() => {
                    for (let i = 0; i < 8; i++) {
                        setTimeout(() => {
                            const firework = createFirework(point.x, point.y);
                            container.appendChild(firework);
                            
                            requestAnimationFrame(() => {
                                firework.classList.add('firework-active');
                            });
                            
                            setTimeout(() => {
                                if (firework.parentNode) {
                                    firework.parentNode.removeChild(firework);
                                }
                            }, 1500);
                        }, i * 15);
                    }
                }, burstIndex * 100);
            });
        }, wave * 800);
    }
}

function createFirework(x, y) {
    const firework = document.createElement('div');
    firework.classList.add('firework');
    
    const fireworkColors = ['#FFD700', '#FF6B47', '#4ECDC4', '#45B7D1', '#FF69B4', '#32CD32', '#FF4500', '#9370DB', '#00CED1', '#FFB6C1'];
    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];
    firework.style.backgroundColor = color;
    firework.style.color = color;
    firework.style.borderRadius = '50%';
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;
    
    firework.style.setProperty('--dx', dx + 'px');
    firework.style.setProperty('--dy', dy + 'px');
    
    const size = Math.random() * 4 + 3;
    firework.style.width = size + 'px';
    firework.style.height = size + 'px';
    
    firework.style.left = x + 'px';
    firework.style.top = y + 'px';
    
    return firework;
}

function hideCelebration() {
    isShowingCelebration = false;
    const numberTiles = document.querySelectorAll('.number-tile');
    numberTiles.forEach(tile => {
        tile.style.animation = '';
        tile.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    });
    startNewQuestion();
}

function startNewQuestion() {
    currentNumber = generateRandomNumber();
    resetDropZone();
    createNumberBank();
    dropZonePlaceholder.innerHTML = ``;
    
    setTimeout(() => {
        speakNumber(currentNumber);
    }, 200);
}

function switchMode(mode) {
    currentMode = mode;
    usedNumbers = [];
    
    document.getElementById('basicMode').classList.toggle('active', mode === 'basic');
    document.getElementById('intermediateMode').classList.toggle('active', mode === 'intermediate');
    document.getElementById('advancedMode').classList.toggle('active', mode === 'advanced');
    document.getElementById('expertMode').classList.toggle('active', mode === 'expert');
    
    startNewQuestion();
}

document.getElementById('basicMode').addEventListener('click', () => switchMode('basic'));
document.getElementById('intermediateMode').addEventListener('click', () => switchMode('intermediate'));
document.getElementById('advancedMode').addEventListener('click', () => switchMode('advanced'));
document.getElementById('expertMode').addEventListener('click', () => switchMode('expert'));

document.getElementById('rachelAvatar').addEventListener('click', () => {
    if (isShowingCelebration) {
        currentVoice = 'rachel';
        setTimeout(() => {
            hideCelebration();
        }, 200);
    } else {
        currentVoice = 'rachel';
        if (currentNumber !== null && !isShowingCelebration) speakNumber(currentNumber);
    }
});

document.getElementById('adamAvatar').addEventListener('click', () => {
    if (isShowingCelebration) {
        currentVoice = 'adam';
        setTimeout(() => {
            hideCelebration();
        }, 200);
    } else {
        currentVoice = 'adam';
        if (currentNumber !== null && !isShowingCelebration) speakNumber(currentNumber);
    }
});

document.addEventListener('touchstart', unlockAudio, { once: true });
document.addEventListener('click', unlockAudio, { once: true });

let dailyPoints = 0;
let weeklyPoints = 0;
let lifetimePoints = 0;
let lastPlayDate = null;

function loadProgress() {
    const saved = localStorage.getItem('numbersProgress');
    if (saved) {
        const data = JSON.parse(saved);
        const today = new Date().toDateString();
        
        if (data.lastPlayDate !== today) {
            dailyPoints = 0;
        } else {
            dailyPoints = data.dailyPoints || 0;
        }
        
        weeklyPoints = data.weeklyPoints || 0;
        lifetimePoints = data.lifetimePoints || 0;
        lastPlayDate = today;
    } else {
        lastPlayDate = new Date().toDateString();
    }
    updateProgressDisplay();
}

function saveProgress() {
    const data = {
        dailyPoints,
        weeklyPoints,
        lifetimePoints,
        lastPlayDate
    };
    localStorage.setItem('numbersProgress', JSON.stringify(data));
}

function updateProgressDisplay() {
    document.getElementById('dailyPoints').textContent = dailyPoints;
    document.getElementById('weeklyPoints').textContent = weeklyPoints;
    document.getElementById('lifetimePoints').textContent = lifetimePoints;
}

function addPoints(points) {
    dailyPoints += points;
    weeklyPoints += points;
    lifetimePoints += points;
    saveProgress();
    updateProgressDisplay();
}

document.getElementById('progressButton').addEventListener('click', () => {
    document.getElementById('progressOverlay').classList.add('active');
});

document.getElementById('progressOverlay').addEventListener('click', () => {
    document.getElementById('progressOverlay').classList.remove('active');
});


loadProgress();
startNewQuestion();

navigator.serviceWorker.register('sw.js');
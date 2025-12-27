// Accessing HTML elements
const backgroundMusic = document.getElementById('backgroundMusic');
const playPauseBtn = document.getElementById('playPauseBtn');
const volumeSlider = document.getElementById('volume');
const autoplayMessage = document.getElementById('autoplayMessage');
const songTitle = document.getElementById('songTitle');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const themeToggle = document.getElementById('themeToggle');
const canvas = document.getElementById('equalizer');
const ctx = canvas.getContext('2d');

// Playlist setup
const songs = [
    { title: "Song Bird", src: "aud/KennyGSaxSongBird.mp3" },
    { title: "The Moment", src: "aud/KennyGTheMoment.mp3" },
    { title: "Forever in Love", src: "aud/GForeverInLove.mp3" }
];
let currentSongIndex = 0;

// Web Audio API setup
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(backgroundMusic);
source.connect(analyser);
analyser.connect(audioContext.destination);

// Set initial volume
backgroundMusic.volume = volumeSlider.value;

// Handle autoplay
window.onload = function () {
    const musicPromise = backgroundMusic.play();

    if (musicPromise !== undefined) {
        musicPromise.then(() => {
            autoplayMessage.style.display = 'none';
            playPauseBtn.innerHTML = '&#x23F8;';
        }).catch(() => {
            autoplayMessage.style.display = 'block';
            playPauseBtn.innerHTML = '&#x25B6;';
        });
    }
};

// Change song based on the current song index
function changeSong() {
    backgroundMusic.src = songs[currentSongIndex].src;
    songTitle.textContent = songs[currentSongIndex].title;
    backgroundMusic.play();
    playPauseBtn.innerHTML = '&#x23F8;';
}

// Previous song
prevBtn.addEventListener('click', function () {
    currentSongIndex = (currentSongIndex === 0) ? songs.length - 1 : currentSongIndex - 1;
    changeSong();
});

// Next song
nextBtn.addEventListener('click', function () {
    currentSongIndex = (currentSongIndex === songs.length - 1) ? 0 : currentSongIndex + 1;
    changeSong();
});

// Play/Pause button functionality
playPauseBtn.addEventListener('click', function () {
    if (backgroundMusic.paused) {
        backgroundMusic.play();
        playPauseBtn.innerHTML = '&#x23F8;';
        autoplayMessage.style.display = 'none';
    } else {
        backgroundMusic.pause();
        playPauseBtn.innerHTML = '&#x25B6;';
    }
});

// Volume control functionality
volumeSlider.addEventListener('input', function () {
    backgroundMusic.volume = volumeSlider.value;
});

// Web Audio API setup for visualization
analyser.fftSize = 512; // Increased for better frequency resolution
analyser.smoothingTimeConstant = 0.6; // Reduced for more dynamic response
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Peak hold tracking
const peakHolds = new Array(bufferLength).fill(0);
const peakHoldTimes = new Array(bufferLength).fill(0);
const PEAK_HOLD_DURATION = 800;
const PEAK_FALL_SPEED = 12;

// Smoothing array for more varied bar heights
const smoothedData = new Array(bufferLength).fill(0);
const SMOOTHING_FACTOR = 0.7;

// Draw the equalizer (visualization)
function drawEqualizer() {
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const visibleBars = 20; // Use fewer bars for better visibility
    const barGap = 2;
    const barWidth = (canvas.width - (visibleBars - 1) * barGap) / visibleBars;
    const boxHeight = 10; // Height of each stacked box
    const boxGap = 2; // Gap between boxes
    let x = 0;
    const currentTime = Date.now();
    const midY = canvas.height * 0.75;

    for (let i = 0; i < visibleBars; i++) {
        // Create symmetry: mirror frequencies around center
        // Bars 0-9 mirror bars 19-10
        const centerIndex = (visibleBars - 1) / 2; // 9.5
        let mirrorIndex;

        if (i <= centerIndex) {
            // Left side: map 0->9 to frequencies 9->0 (REVERSED)
            mirrorIndex = Math.floor(centerIndex) - i;
        } else {
            // Right side: map 10->19 to frequencies 0->9 (mirror left side)
            mirrorIndex = i - Math.ceil(centerIndex);
        }
        
        // Sample from frequency bins using mirrorIndex
        const start = Math.floor((mirrorIndex * bufferLength) / (visibleBars / 2));
        const end = Math.floor(((mirrorIndex + 1) * bufferLength) / (visibleBars / 2));

        let sum = 0;
        for (let j = start; j < end; j++) {
            sum += dataArray[j];
        }
        let rawValue = sum / (end - start);
        
        // Apply frequency-based scaling for more varied heights
        const frequencyMultiplier = 1 + (mirrorIndex / (visibleBars / 2)) * 0.5;
        rawValue = Math.min(255, rawValue * frequencyMultiplier);
        
        // Smooth the data for more natural movement
        smoothedData[i] = (SMOOTHING_FACTOR * smoothedData[i]) + ((1 - SMOOTHING_FACTOR) * rawValue);

        // Scale up the bar height (multiply by 1.0 for taller bars)
        const barHeight = smoothedData[i] * 1.6;
        const numBoxes = Math.floor(barHeight / (boxHeight + boxGap));
        
        // Update peak hold
        if (barHeight > peakHolds[i]) {
            peakHolds[i] = barHeight;
            peakHoldTimes[i] = currentTime;
        } else if (currentTime - peakHoldTimes[i] > PEAK_HOLD_DURATION) {
            peakHolds[i] = Math.max(peakHolds[i] - PEAK_FALL_SPEED, barHeight);
        }
        
        // Draw stacked boxes
        for (let j = 0; j < numBoxes; j++) {
            const boxY = midY - (j * (boxHeight + boxGap)) - boxHeight;
            const boxRatio = j / Math.max(numBoxes, 1);
            
            // Color gradient: green -> yellow -> red
            let r, g, b;
            if (boxRatio < 0.5) {
                // Green to yellow
                r = Math.floor(255 * (boxRatio * 2));
                g = 255;
                b = 0;
            } else {
                // Yellow to red
                r = 255;
                g = Math.floor(255 * (1 - (boxRatio - 0.5) * 2));
                b = 0;
            }
            
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, boxY, barWidth - 2, boxHeight);
        }
        
        // Draw red peak hold box at the top
        const peakBoxNum = Math.floor(peakHolds[i] / (boxHeight + boxGap));
        const peakY = midY - (peakBoxNum * (boxHeight + boxGap)) - boxHeight;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x, peakY, barWidth - 2, boxHeight);
        
        // Draw mirrored reflection below
        ctx.save();
        ctx.globalAlpha = 0.25;
        
        const reflectionHeight = barHeight * 0.5;
        const reflectionBoxes = Math.floor(reflectionHeight / (boxHeight + boxGap));
        
        for (let j = 0; j < reflectionBoxes; j++) {
            const boxY = midY + (j * (boxHeight + boxGap));

            // Correct ratio for reflection: 0 = center (green), 1 = bottom (red)
            const boxRatio = j / Math.max(reflectionBoxes - 1, 1);

            let r, g, b;
            if (boxRatio < 0.5) {
                r = Math.floor(255 * (boxRatio * 2));
                g = 255;
                b = 0;
            } else {
                r = 255;
                g = Math.floor(255 * (1 - (boxRatio - 0.5) * 2));
                b = 0;
            }

            const distanceFade = 1 - (j / reflectionBoxes);
            ctx.globalAlpha = 0.25 * distanceFade;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, boxY, barWidth - 2, boxHeight);
        }
        
        ctx.restore();

        x += barWidth + 1;
    }

    requestAnimationFrame(drawEqualizer);
}

// Initialize drawing of the equalizer once the music plays
backgroundMusic.addEventListener('play', function () {
    audioContext.resume().then(() => {
        drawEqualizer();
    });
});

// Theme toggle functionality (Day/Night Mode)
let isNightMode = true;

themeToggle.addEventListener('click', function () {
    isNightMode = !isNightMode;

    if (isNightMode) {
        document.body.style.backgroundColor = 'rgb(2, 0, 38)';
        document.body.style.color = '#fff';
        themeToggle.textContent = '🌙';
    } else {
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#000';
        themeToggle.textContent = '🌞';
    }
});

// Keyboard shortcuts for music control
document.addEventListener('keydown', function (event) {
    if (event.key === ' ') {
        event.preventDefault();
        playPauseBtn.click();
    } else if (event.key === 'ArrowLeft') {
        prevBtn.click();
    } else if (event.key === 'ArrowRight') {
        nextBtn.click();
    } else if (event.key === 'ArrowUp') {
        if (backgroundMusic.volume < 1) {
            backgroundMusic.volume = Math.min(1, backgroundMusic.volume + 0.1);
            volumeSlider.value = backgroundMusic.volume;
        }
    } else if (event.key === 'ArrowDown') {
        if (backgroundMusic.volume > 0) {
            backgroundMusic.volume = Math.max(0, backgroundMusic.volume - 0.1);
            volumeSlider.value = backgroundMusic.volume;
        }
    }
});

// Initially load the first song
changeSong();
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. TYPING EFFECT
    // ==========================================
    const typingTextElement = document.getElementById('typing-text');
    const messages = [
        "Wishing you a purr-fectly wonderful day! 🐾",
        "May your year be filled with endless joy! ✨",
        "Sending lots of warm hugs and cute meows! 🐱",
        "You deserve ALL the treats today! 🍰",
    ];
    let messageIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
        const currentMessage = messages[messageIndex];
        if (isDeleting) {
            typingTextElement.textContent = currentMessage.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentMessage.substring(0, charIndex + 1);
            charIndex++;
        }
        let typingSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === currentMessage.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
            typingSpeed = 500;
        }
        setTimeout(typeEffect, typingSpeed);
    }
    typeEffect();


    // // ==========================================
    // // 2. COUNTDOWN TIMER
    // // ==========================================
    // const birthdayDate = new Date();
    // birthdayDate.setDate(birthdayDate.getDate() + 1);
    // birthdayDate.setHours(0, 0, 0, 0);

    // function updateCountdown() {
    //     const now = new Date().getTime();
    //     const distance = birthdayDate.getTime() - now;
    //     const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    //     const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //     const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    //     const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    //     document.getElementById("countdown-days").textContent = days.toString().padStart(2, '0');
    //     document.getElementById("countdown-hours").textContent = hours.toString().padStart(2, '0');
    //     document.getElementById("countdown-minutes").textContent = minutes.toString().padStart(2, '0');
    //     document.getElementById("countdown-seconds").textContent = seconds.toString().padStart(2, '0');
    // }
    // setInterval(updateCountdown, 1000);
    // updateCountdown();

    // ==========================================
    // 2. COUNTDOWN TIMER (KSA TIMEZONE UTC+3)
    // ==========================================

    function getKSANow() {
        const now = new Date();

        // UTC time
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);

        // KSA = UTC+3
        return new Date(utc + (3 * 60 * 60 * 1000));
    }

    function getNextKSAMidnight() {
        const ksaNow = getKSANow();

        const nextMidnight = new Date(ksaNow);
        nextMidnight.setDate(nextMidnight.getDate() + 1);
        nextMidnight.setHours(0, 0, 0, 0);

        return nextMidnight;
    }

    const birthdayDate = getNextKSAMidnight();

    function updateCountdown() {
        const ksaNow = getKSANow().getTime();
        const distance = birthdayDate.getTime() - ksaNow;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown-days").textContent =
            days.toString().padStart(2, '0');
        document.getElementById("countdown-hours").textContent =
            hours.toString().padStart(2, '0');
        document.getElementById("countdown-minutes").textContent =
            minutes.toString().padStart(2, '0');
        document.getElementById("countdown-seconds").textContent =
            seconds.toString().padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();


    // ==========================================
    // 3. SYNTHESIZED CAT MEOW MUSIC (WEB AUDIO API)
    // ==========================================
    const musicToggle = document.getElementById('music-toggle');
    const musicIcon = document.getElementById('music-icon');

    let audioCtx = null;
    let isPlaying = false;
    let nextNoteTimeout = null;
    let currentNoteIndex = 0;

    const notes = [
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 1.2 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 293.66, d: 0.8 }, { f: 261.63, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.2 },
        { f: 261.63, d: 0.4 }, { f: 261.63, d: 0.4 }, { f: 523.25, d: 0.8 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 329.63, d: 0.8 }, { f: 293.66, d: 1.2 },
        { f: 466.16, d: 0.4 }, { f: 466.16, d: 0.4 }, { f: 440.00, d: 0.8 }, { f: 349.23, d: 0.8 }, { f: 392.00, d: 0.8 }, { f: 349.23, d: 1.5 }
    ];

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playMeowNote(frequency, duration) {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'triangle';
        const now = audioCtx.currentTime;
        osc.frequency.setValueAtTime(frequency * 0.75, now);
        osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.08);
        osc.frequency.setValueAtTime(frequency, now + duration - 0.05);
        osc.frequency.linearRampToValueAtTime(frequency * 0.85, now + duration);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05);
        gainNode.gain.setValueAtTime(0.2, now + duration - 0.08);
        gainNode.gain.linearRampToValueAtTime(0, now + duration);
        osc.start(now);
        osc.stop(now + duration);
    }

    function playSongLoop() {
        if (!isPlaying) return;
        const currentNote = notes[currentNoteIndex];
        playMeowNote(currentNote.f, currentNote.d);
        nextNoteTimeout = setTimeout(() => {
            currentNoteIndex = (currentNoteIndex + 1) % notes.length;
            playSongLoop();
        }, currentNote.d * 1000 + 80);
    }

    function startMusic() {
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        isPlaying = true;
        musicIcon.textContent = '🎵';
        musicIcon.classList.add('animate-bounce');
        playSongLoop();
    }

    function stopMusic() {
        isPlaying = false;
        clearTimeout(nextNoteTimeout);
        musicIcon.textContent = '🔈';
        musicIcon.classList.remove('animate-bounce');
    }

    musicToggle.addEventListener('click', () => {
        if (isPlaying) stopMusic();
        else startMusic();
    });


    // ==========================================
    // 4. FLOATING PAWS BACKGROUND
    // ==========================================
    const floatContainer = document.getElementById('floating-container');
    function createFloatingPaw() {
        const paw = document.createElement('div');
        paw.className = 'floating-paw';
        paw.textContent = ['🐾', '✨', '🌸', '💕'][Math.floor(Math.random() * 4)];
        paw.style.left = Math.random() * 100 + 'vw';
        paw.style.animationDuration = (Math.random() * 5 + 6) + 's';
        floatContainer.appendChild(paw);
        setTimeout(() => paw.remove(), 11000);
    }
    setInterval(createFloatingPaw, 1500);


    // ==========================================
    // 5. VSCODE-STYLE PET PLAYGROUND
    // ==========================================

    const giftBox = document.getElementById('gift-box');
    const giftStatus = document.getElementById('gift-status');
    const playground = document.getElementById('playground-scene');
    const emptyState = document.getElementById('playground-empty-state');

    let isBoxOpened = false;
    const activePets = [];

    // Mixed cats and dogs!
    const petTypes = [
        { emoji: '🐈', name: 'cat' },
        { emoji: '🐈‍⬛', name: 'blackcat' },
        { emoji: '🐱', name: 'kitty' },
        { emoji: '😸', name: 'happycat' },
        { emoji: '😻', name: 'lovecat' },
        { emoji: '😼', name: 'coolcat' },
        { emoji: '🐶', name: 'dog' },
        { emoji: '🐕', name: 'pup' },
        { emoji: '🐩', name: 'poodle' },
        { emoji: '🦮', name: 'guide-dog' },
        { emoji: '🐕‍🦺', name: 'servicepup' },
    ];

    // Birthday + cute random messages
    const petMessages = [
        "hello cutieee 🌸",
        "happy birthday!! 🎉",
        "u so cute omg 😻",
        "woof woof!! 🐾",
        "meow meow~ 🐱",
        "you're amazing! ✨",
        "stay purrfect 🐈",
        "much love!! 💕",
        "best day ever! 🎂",
        "arf arf! hi!! 🐶",
        "you deserve it all 🌟",
        "*tail wag* 🐕",
        "big hugs!! 🤗",
        "nom nom birthday cake 🍰",
        "you're my fav human 😽",
        "happy bday cloudninee! 🎈",
        "wishing u joy 🌈",
        "squeak!! love u! 💖",
        "pets for the birthday girl 🐾",
        "yip yip!! 🐩",
    ];

    const GROUND_Y_RATIO = 0.78; // fraction of scene height where ground is

    class Pet {
        constructor(container, startX = null, startY = null) {
            this.container = container;
            this.wrapper = document.createElement('div');
            this.wrapper.className = 'pet-entity spawn-ani';

            // Speech bubble
            this.bubble = document.createElement('div');
            this.bubble.className = 'speech-bubble';
            this.wrapper.appendChild(this.bubble);

            // Emoji body
            this.body = document.createElement('div');
            const type = petTypes[Math.floor(Math.random() * petTypes.length)];
            this.baseEmoji = type.emoji;
            this.petName = type.name;
            this.body.textContent = this.baseEmoji;
            this.wrapper.appendChild(this.body);

            this.container.appendChild(this.wrapper);
            this.updateBoundary();

            this.x = startX !== null ? Math.max(0, Math.min(startX, this.maxWidth)) : Math.random() * this.maxWidth;
            this.y = startY !== null ? startY : this.groundY;

            this.vx = (Math.random() - 0.5) * 2.5;
            this.vy = 0;
            this.gravity = 0.35;
            this.onGround = false;
            this.facingRight = this.vx > 0;

            this.bubbleTimeout = null;
            this.isJumping = false;

            // Idle timers
            this.idleTimer = Math.random() * 3000 + 2000;
            this.lastIdleTime = performance.now();

            this.wrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                this.interact();
            });

            this.updateElementPosition();

            // Say a greeting on spawn
            setTimeout(() => this.showMessage(petMessages[Math.floor(Math.random() * petMessages.length)]), 400 + Math.random() * 600);
        }

        showMessage(msg) {
            clearTimeout(this.bubbleTimeout);
            this.bubble.textContent = msg;
            this.bubble.classList.add('visible');
            this.bubbleTimeout = setTimeout(() => {
                this.bubble.classList.remove('visible');
            }, 2800);
        }

        interact() {
            this.vy = -(6 + Math.random() * 3);
            this.isJumping = true;
            this.body.textContent = this.petName.includes('dog') ? '🐕' : '🙀';

            const msg = petMessages[Math.floor(Math.random() * petMessages.length)];
            this.showMessage(msg);

            if (audioCtx) playMeowNote(380 + Math.random() * 220, 0.18);

            setTimeout(() => {
                this.body.textContent = this.baseEmoji;
                this.isJumping = false;
            }, 700);
        }

        updateBoundary() {
            const rect = this.container.getBoundingClientRect();
            this.maxWidth = rect.width - 40;
            this.groundY = rect.height * GROUND_Y_RATIO - 36;
            this.maxHeight = rect.height - 40;
        }

        move(now) {
            this.updateBoundary();

            // Idle behavior
            if (now - this.lastIdleTime > this.idleTimer) {
                this.lastIdleTime = now;
                this.idleTimer = Math.random() * 4000 + 2000;
                const roll = Math.random();
                if (roll < 0.3 && this.onGround) {
                    // Random direction change
                    this.vx = (Math.random() - 0.5) * 2.5;
                } else if (roll < 0.5 && this.onGround) {
                    // Small hop
                    this.vy = -(3 + Math.random() * 2);
                } else if (roll < 0.65) {
                    // Say something
                    this.showMessage(petMessages[Math.floor(Math.random() * petMessages.length)]);
                } else {
                    // Slow down / stop briefly
                    this.vx *= 0.2;
                }
            }

            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;

            // Ground collision
            if (this.y >= this.groundY) {
                this.y = this.groundY;
                this.vy = 0;
                this.onGround = true;
            } else {
                this.onGround = false;
            }

            // Wall bounce
            if (this.x <= 0) { this.x = 0; this.vx = Math.abs(this.vx); }
            else if (this.x >= this.maxWidth) { this.x = this.maxWidth; this.vx = -Math.abs(this.vx); }

            // Ceiling
            if (this.y <= 0) { this.y = 0; this.vy = Math.abs(this.vy) * 0.5; }

            if (this.vx > 0.15) this.facingRight = true;
            else if (this.vx < -0.15) this.facingRight = false;

            this.wrapper.style.transform = `scaleX(${this.facingRight ? 1 : -1})`;
            this.updateElementPosition();
        }

        updateElementPosition() {
            this.wrapper.style.left = `${this.x}px`;
            this.wrapper.style.top = `${this.y}px`;
        }
    }

    function animatePets(now) {
        activePets.forEach(pet => pet.move(now));
        requestAnimationFrame(animatePets);
    }
    requestAnimationFrame(animatePets);

    function spawnPets(amount, x = null, y = null) {
        if (emptyState) emptyState.style.display = 'none';
        for (let i = 0; i < amount; i++) {
            setTimeout(() => {
                activePets.push(new Pet(playground, x, y));
            }, i * 180);
        }
    }

    giftBox.addEventListener('click', () => {
        if (!isBoxOpened) {
            isBoxOpened = true;
            giftBox.classList.remove('gift-shake');
            giftBox.textContent = '📦✨';
            giftBox.classList.add('gift-opened-anim');
            giftStatus.textContent = "THE SQUAD IS HERE! CLICK THE GROUND TO SUMMON MORE!";
            giftStatus.classList.remove('animate-pulse');
            triggerConfetti();
            spawnPets(6);
            if (!isPlaying) startMusic();
        } else {
            spawnPets(2);
        }
    });

    playground.addEventListener('click', (e) => {
        if (!isBoxOpened) return;
        const rect = playground.getBoundingClientRect();
        const x = e.clientX - rect.left - 16;
        const y = e.clientY - rect.top - 32;
        spawnPets(1, x, y);
    });


    // ==========================================
    // 6. CONFETTI
    // ==========================================
    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#fbcfe8', '#f9a8d4', '#f472b6', '#fbbf24', '#fcd34d', '#c4b5fd', '#a78bfa'];

        for (let i = 0; i < 130; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 100,
                vx: (Math.random() - 0.5) * 22,
                vy: (Math.random() - 1.2) * 18,
                size: Math.random() * 9 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            pieces.forEach(p => {
                p.vy += 0.45;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                if (p.y < canvas.height) active = true;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                if (p.shape === 'circle') {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                }
                ctx.restore();
            });

            if (active) requestAnimationFrame(animateConfetti);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animateConfetti();
    }


    // ==========================================
    // 7. CAT RUNNER MINI GAME
    // ==========================================
    const runnerCanvas = document.getElementById('runner-canvas');
    const runnerCtx = runnerCanvas.getContext('2d');
    const runnerOverlay = document.getElementById('runner-overlay');
    const runnerStartBtn = document.getElementById('runner-start-btn');
    const runnerScoreEl = document.getElementById('runner-score');
    const runnerBestEl = document.getElementById('runner-best');
    const runnerOverlayTitle = document.getElementById('runner-overlay-title');
    const runnerOverlaySub = document.getElementById('runner-overlay-sub');
    const runnerOverlayEmoji = document.getElementById('runner-overlay-emoji');

    // Responsive canvas width
    function resizeRunnerCanvas() {
        const container = runnerCanvas.parentElement;
        runnerCanvas.width = container.offsetWidth;
    }
    resizeRunnerCanvas();
    window.addEventListener('resize', resizeRunnerCanvas);

    const RUNNER_H = 200;
    const GROUND = RUNNER_H - 38;
    const CAT_X = 60;
    const CAT_SIZE = 32;
    const GRAVITY_R = 0.7;
    const JUMP_FORCE = -13;

    let runnerState = 'idle'; // idle | running | dead
    let runnerScore = 0;
    let runnerBest = 0;
    let runnerSpeed = 5;
    let runnerFrame = 0;
    let runnerAnimId = null;
    let legToggle = false;
    let legTimer = 0;

    let cat = {
        y: GROUND - CAT_SIZE,
        vy: 0,
        jumpsLeft: 2,
        isOnGround: false,
    };

    let obstacles = [];
    let particles = [];
    let bgStars = [];
    let frameCount = 0;
    let nextObstacleIn = 80;
    let groundOffset = 0;

    // Pre-generate some background stars/dots
    for (let i = 0; i < 18; i++) {
        bgStars.push({
            x: Math.random() * 700,
            y: Math.random() * (GROUND - 20),
            r: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.4 + 0.1,
            emoji: Math.random() > 0.7 ? ['🌸', '✨', '💕'][Math.floor(Math.random() * 3)] : null,
            size: Math.random() * 10 + 8,
        });
    }

    // ---- Canvas shape drawing helpers ----

    // Draw a pixel-art style cute cat at (x, y), size s, facing right, isDead
    function drawCat(ctx, x, y, s, tilt, isDead) {
        ctx.save();
        ctx.translate(x + s / 2, y + s / 2);
        ctx.rotate(tilt);

        const c = s / 32; // scale factor

        // Body
        ctx.fillStyle = '#f9a8d4'; // pink
        roundRect(ctx, -14*c, 2*c, 28*c, 20*c, 7*c);
        ctx.fill();

        // Belly patch
        ctx.fillStyle = '#fce7f3';
        roundRect(ctx, -7*c, 8*c, 14*c, 12*c, 5*c);
        ctx.fill();

        // Head
        ctx.fillStyle = '#f9a8d4';
        roundRect(ctx, -11*c, -18*c, 22*c, 20*c, 8*c);
        ctx.fill();

        // Ears (triangles)
        ctx.fillStyle = '#f472b6';
        // left ear
        ctx.beginPath();
        ctx.moveTo(-11*c, -14*c);
        ctx.lineTo(-6*c,  -24*c);
        ctx.lineTo(-2*c,  -14*c);
        ctx.closePath();
        ctx.fill();
        // right ear
        ctx.beginPath();
        ctx.moveTo(2*c,  -14*c);
        ctx.lineTo(7*c,  -24*c);
        ctx.lineTo(11*c, -14*c);
        ctx.closePath();
        ctx.fill();

        // Inner ear
        ctx.fillStyle = '#fce7f3';
        ctx.beginPath();
        ctx.moveTo(-9*c, -15*c);
        ctx.lineTo(-6*c, -21*c);
        ctx.lineTo(-3*c, -15*c);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(3*c,  -15*c);
        ctx.lineTo(6*c,  -21*c);
        ctx.lineTo(9*c,  -15*c);
        ctx.closePath();
        ctx.fill();

        if (isDead) {
            // X eyes
            ctx.strokeStyle = '#9d174d';
            ctx.lineWidth = 2*c;
            ctx.lineCap = 'round';
            // left X
            ctx.beginPath(); ctx.moveTo(-8*c,-10*c); ctx.lineTo(-4*c,-6*c); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-4*c,-10*c); ctx.lineTo(-8*c,-6*c); ctx.stroke();
            // right X
            ctx.beginPath(); ctx.moveTo(4*c,-10*c); ctx.lineTo(8*c,-6*c); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(8*c,-10*c); ctx.lineTo(4*c,-6*c); ctx.stroke();
            // sad mouth
            ctx.strokeStyle = '#9d174d';
            ctx.lineWidth = 1.5*c;
            ctx.beginPath();
            ctx.arc(0, -2*c, 4*c, 0.2, Math.PI - 0.2);
            ctx.stroke();
        } else {
            // Eyes
            ctx.fillStyle = '#1e1b4b';
            ctx.beginPath(); ctx.ellipse(-6*c, -9*c, 3*c, 3.5*c, 0, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(6*c,  -9*c, 3*c, 3.5*c, 0, 0, Math.PI*2); ctx.fill();
            // Eye shine
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(-5*c, -10*c, 1.2*c, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(7*c,  -10*c, 1.2*c, 0, Math.PI*2); ctx.fill();
            // Nose
            ctx.fillStyle = '#f472b6';
            ctx.beginPath(); ctx.ellipse(0, -4*c, 2*c, 1.5*c, 0, 0, Math.PI*2); ctx.fill();
            // Mouth
            ctx.strokeStyle = '#9d174d';
            ctx.lineWidth = 1.2*c;
            ctx.lineCap = 'round';
            ctx.beginPath(); ctx.moveTo(0, -2.5*c); ctx.lineTo(-3*c, 0); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, -2.5*c); ctx.lineTo(3*c,  0); ctx.stroke();
            // Whiskers
            ctx.strokeStyle = '#9d174d';
            ctx.lineWidth = 0.8*c;
            ctx.globalAlpha = 0.5;
            ctx.beginPath(); ctx.moveTo(-11*c,-5*c); ctx.lineTo(-3*c,-4*c); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-11*c,-2*c); ctx.lineTo(-3*c,-2*c); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(3*c,-4*c); ctx.lineTo(11*c,-5*c); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(3*c,-2*c); ctx.lineTo(11*c,-2*c); ctx.stroke();
            ctx.globalAlpha = 1;
        }

        // Tail (curved to the right)
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 3.5*c;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(14*c, 8*c);
        ctx.quadraticCurveTo(22*c, 0, 18*c, -8*c);
        ctx.stroke();

        // Legs / paws
        ctx.fillStyle = '#f9a8d4';
        if (!isDead) {
            // Animated legs
            const legOff = tilt !== 0 ? 3*c : 0;
            roundRect(ctx, -12*c, 18*c, 8*c, 6*c + legOff, 3*c); ctx.fill();
            roundRect(ctx, 4*c,   18*c, 8*c, 6*c - legOff, 3*c); ctx.fill();
        } else {
            roundRect(ctx, -12*c, 18*c, 8*c, 5*c, 3*c); ctx.fill();
            roundRect(ctx, 4*c,   18*c, 8*c, 5*c, 3*c); ctx.fill();
        }

        ctx.restore();
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y, x + w, y + r, r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x, y + h, x, y + h - r, r);
        ctx.lineTo(x, y + r);
        ctx.arcTo(x, y, x + r, y, r);
        ctx.closePath();
    }

    // Draw a cactus obstacle
    function drawCactus(ctx, x, y, w, h) {
        ctx.fillStyle = '#4ade80';
        // main stem
        roundRect(ctx, x + w*0.3, y, w*0.4, h, 4);
        ctx.fill();
        // left arm
        ctx.fillStyle = '#4ade80';
        roundRect(ctx, x, y + h*0.3, w*0.35, h*0.22, 4);
        ctx.fill();
        roundRect(ctx, x, y + h*0.15, w*0.18, h*0.2, 4);
        ctx.fill();
        // right arm
        roundRect(ctx, x + w*0.65, y + h*0.4, w*0.35, h*0.22, 4);
        ctx.fill();
        roundRect(ctx, x + w*0.82, y + h*0.25, w*0.18, h*0.2, 4);
        ctx.fill();
        // spikes (dots on edge)
        ctx.fillStyle = '#166534';
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.arc(x + w*0.28, y + h*(0.15 + i*0.2), 2, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w*0.72, y + h*(0.15 + i*0.2), 2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    // Draw yarn ball
    function drawYarn(ctx, x, y, w, h) {
        const cx = x + w/2, cy = y + h/2, r = Math.min(w, h)/2;
        ctx.fillStyle = '#c084fc';
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
        // Cross-wrap lines
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.5;
        for (let a = 0; a < Math.PI; a += Math.PI/4) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(a);
            ctx.beginPath();
            ctx.ellipse(0, 0, r*0.9, r*0.3, 0, 0, Math.PI*2);
            ctx.stroke();
            ctx.restore();
        }
        ctx.globalAlpha = 1;
        // Highlight
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.arc(cx - r*0.3, cy - r*0.3, r*0.25, 0, Math.PI*2); ctx.fill();
    }

    // Draw mouse/rat
    function drawMouse(ctx, x, y, w, h) {
        // body
        ctx.fillStyle = '#94a3b8';
        roundRect(ctx, x + 4, y + h*0.4, w - 4, h*0.55, 6);
        ctx.fill();
        // head
        ctx.beginPath(); ctx.ellipse(x + w*0.75, y + h*0.45, w*0.28, h*0.28, 0, 0, Math.PI*2); ctx.fill();
        // ear
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath(); ctx.ellipse(x + w*0.82, y + h*0.22, w*0.14, h*0.18, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath(); ctx.ellipse(x + w*0.82, y + h*0.22, w*0.08, h*0.1, 0, 0, Math.PI*2); ctx.fill();
        // eye
        ctx.fillStyle = '#1e293b';
        ctx.beginPath(); ctx.arc(x + w*0.85, y + h*0.43, 2.5, 0, Math.PI*2); ctx.fill();
        // nose
        ctx.fillStyle = '#fca5a5';
        ctx.beginPath(); ctx.arc(x + w*0.98, y + h*0.48, 2, 0, Math.PI*2); ctx.fill();
        // tail
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x + 4, y + h*0.7);
        ctx.quadraticCurveTo(x - 8, y + h*0.5, x - 2, y + h*0.3);
        ctx.stroke();
    }

    // Draw bird (flying)
    function drawBird(ctx, x, y, w, h, frame) {
        const wingFlap = Math.sin(frame * 0.2) > 0;
        ctx.fillStyle = '#60a5fa';
        // Body
        ctx.beginPath(); ctx.ellipse(x + w*0.5, y + h*0.6, w*0.3, h*0.22, 0, 0, Math.PI*2); ctx.fill();
        // Head
        ctx.beginPath(); ctx.ellipse(x + w*0.78, y + h*0.48, w*0.2, h*0.2, 0, 0, Math.PI*2); ctx.fill();
        // Wings
        ctx.fillStyle = '#3b82f6';
        if (wingFlap) {
            ctx.beginPath();
            ctx.moveTo(x + w*0.5, y + h*0.55);
            ctx.quadraticCurveTo(x + w*0.25, y + h*0.1, x, y + h*0.3);
            ctx.quadraticCurveTo(x + w*0.2, y + h*0.55, x + w*0.5, y + h*0.55);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(x + w*0.5, y + h*0.6);
            ctx.quadraticCurveTo(x + w*0.2, y + h*0.75, x, y + h*0.65);
            ctx.quadraticCurveTo(x + w*0.2, y + h*0.6, x + w*0.5, y + h*0.6);
            ctx.fill();
        }
        // Beak
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(x + w*0.95, y + h*0.48);
        ctx.lineTo(x + w,     y + h*0.52);
        ctx.lineTo(x + w*0.95, y + h*0.56);
        ctx.closePath();
        ctx.fill();
        // Eye
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath(); ctx.arc(x + w*0.84, y + h*0.45, 2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(x + w*0.85, y + h*0.44, 0.8, 0, Math.PI*2); ctx.fill();
    }

    // Dispatch obstacle draw
    function drawObstacle(ctx, obs, frame) {
        if (obs.fly) {
            drawBird(ctx, obs.x, obs.y, obs.w, obs.h, frame);
        } else if (obs.kind === 'yarn') {
            drawYarn(ctx, obs.x, obs.y, obs.w, obs.h);
        } else if (obs.kind === 'mouse' || obs.kind === 'rat') {
            drawMouse(ctx, obs.x, obs.y, obs.w, obs.h);
        } else {
            drawCactus(ctx, obs.x, obs.y, obs.w, obs.h);
        }
    }

    // Obstacle types
    const obstacleTypes = [
        { w: 26, h: 40, kind: 'cactus' },
        { w: 32, h: 28, kind: 'mouse' },
        { w: 28, h: 28, kind: 'yarn' },
        { w: 26, h: 40, kind: 'cactus' },
        { w: 30, h: 26, kind: 'rat' },
    ];

    // Flying obstacle (bird)
    const flyingType = { w: 34, h: 26, kind: 'bird', fly: true, flyY: GROUND - 75 };

    function spawnObstacle() {
        const roll = Math.random();
        let type;
        if (runnerScore > 300 && roll < 0.2) {
            type = { ...flyingType };
        } else {
            type = { ...obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)] };
        }

        const doubleRoll = runnerScore > 500 && Math.random() < 0.25;
        obstacles.push({
            x: runnerCanvas.width + 10,
            y: type.fly ? type.flyY : GROUND - type.h,
            w: type.w,
            h: type.h,
            kind: type.kind,
            fly: type.fly || false,
        });

        // Double obstacle
        if (doubleRoll) {
            const gap = 30 + Math.random() * 20;
            const type2 = { ...obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)] };
            obstacles.push({
                x: runnerCanvas.width + 10 + type.w + gap,
                y: GROUND - type2.h,
                w: type2.w,
                h: type2.h,
                kind: type2.kind,
                fly: false,
            });
        }
    }

    function jump() {
        if (runnerState !== 'running') return;
        if (cat.jumpsLeft > 0) {
            cat.vy = JUMP_FORCE;
            cat.jumpsLeft--;
            // Particle poof on jump
            for (let i = 0; i < 6; i++) {
                particles.push({
                    x: CAT_X + CAT_SIZE / 2,
                    y: cat.y + CAT_SIZE,
                    vx: (Math.random() - 0.5) * 3,
                    vy: Math.random() * -2 - 1,
                    life: 1,
                    color: ['#f9a8d4', '#fbbf24', '#a78bfa'][Math.floor(Math.random() * 3)],
                    r: Math.random() * 4 + 2,
                });
            }
            if (audioCtx) playMeowNote(520 + Math.random() * 80, 0.12);
        }
    }

    function resetRunner() {
        cat.y = GROUND - CAT_SIZE;
        cat.vy = 0;
        cat.jumpsLeft = 2;
        cat.isOnGround = false;
        obstacles = [];
        particles = [];
        frameCount = 0;
        runnerScore = 0;
        runnerSpeed = 5;
        nextObstacleIn = 80;
        groundOffset = 0;
        legToggle = false;
        legTimer = 0;
        runnerScoreEl.textContent = '0';
    }

    function startRunner() {
        runnerOverlay.style.display = 'none';
        runnerState = 'running';
        resetRunner();
        if (runnerAnimId) cancelAnimationFrame(runnerAnimId);
        runnerLoop();
    }

    function gameOver() {
        runnerState = 'dead';
        if (runnerScore > runnerBest) {
            runnerBest = runnerScore;
            runnerBestEl.textContent = runnerBest;
        }
        // Death poof particles
        for (let i = 0; i < 18; i++) {
            particles.push({
                x: CAT_X + CAT_SIZE / 2,
                y: cat.y + CAT_SIZE / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                life: 1,
                color: ['#f9a8d4', '#fbbf24', '#f472b6'][Math.floor(Math.random() * 3)],
                r: Math.random() * 5 + 3,
            });
        }
        if (audioCtx) {
            playMeowNote(300, 0.3);
            setTimeout(() => playMeowNote(220, 0.4), 250);
        }
        setTimeout(() => showGameOverScreen(), 600);
    }

    function showGameOverScreen() {
        runnerOverlayTitle.textContent = 'Oh no! 😿';
        runnerOverlaySub.textContent = `You ran ${runnerScore} pts! Try again?`;
        runnerOverlayEmoji.textContent = '😿';
        runnerStartBtn.textContent = 'Run Again! 🐾';
        runnerOverlay.style.display = 'flex';
    }

    function runnerLoop() {
        if (runnerState === 'dead') return;
        runnerAnimId = requestAnimationFrame(runnerLoop);

        const W = runnerCanvas.width;
        runnerCtx.clearRect(0, 0, W, RUNNER_H);

        // Sky gradient bg
        const skyGrad = runnerCtx.createLinearGradient(0, 0, 0, RUNNER_H);
        skyGrad.addColorStop(0, '#FFF5FE');
        skyGrad.addColorStop(1, '#FDE8FF');
        runnerCtx.fillStyle = skyGrad;
        runnerCtx.fillRect(0, 0, W, RUNNER_H);

        frameCount++;

        // --- Score ---
        if (frameCount % 6 === 0) {
            runnerScore++;
            runnerScoreEl.textContent = runnerScore;
            // Speed up gradually
            if (runnerScore % 100 === 0) {
                runnerSpeed = Math.min(runnerSpeed + 0.4, 14);
            }
        }

        // --- Background decorations (parallax dots & stars) ---
        bgStars.forEach(s => {
            s.x -= s.speed * (runnerSpeed * 0.15);
            if (s.x < -20) s.x = W + 20;
            // Draw as small colored circles / stars (no emoji — avoids canvas rendering issues)
            const colors = ['rgba(244,114,182,0.2)', 'rgba(167,139,250,0.2)', 'rgba(251,191,36,0.15)', 'rgba(196,181,253,0.25)'];
            runnerCtx.fillStyle = colors[Math.floor(s.r * 2) % colors.length];
            if (s.r > 1.8) {
                // 4-point star shape
                runnerCtx.save();
                runnerCtx.translate(s.x, s.y);
                runnerCtx.beginPath();
                for (let p = 0; p < 4; p++) {
                    const angle = (p / 4) * Math.PI * 2 - Math.PI / 4;
                    const outer = s.r * 2.5;
                    const inner = s.r * 0.9;
                    runnerCtx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
                    runnerCtx.lineTo(Math.cos(angle + Math.PI / 4) * inner, Math.sin(angle + Math.PI / 4) * inner);
                }
                runnerCtx.closePath();
                runnerCtx.fill();
                runnerCtx.restore();
            } else {
                runnerCtx.beginPath();
                runnerCtx.arc(s.x, s.y, s.r * 1.5, 0, Math.PI * 2);
                runnerCtx.fill();
            }
        });

        // --- Ground ---
        groundOffset = (groundOffset + runnerSpeed) % 40;
        // Ground fill
        const groundGrad = runnerCtx.createLinearGradient(0, GROUND, 0, RUNNER_H);
        groundGrad.addColorStop(0, '#fce7f3');
        groundGrad.addColorStop(1, '#fbcfe8');
        runnerCtx.fillStyle = groundGrad;
        runnerCtx.fillRect(0, GROUND, W, RUNNER_H - GROUND);

        // Ground dashed line
        runnerCtx.strokeStyle = '#f9a8d4';
        runnerCtx.lineWidth = 2;
        runnerCtx.setLineDash([18, 10]);
        runnerCtx.lineDashOffset = -groundOffset;
        runnerCtx.beginPath();
        runnerCtx.moveTo(0, GROUND);
        runnerCtx.lineTo(W, GROUND);
        runnerCtx.stroke();
        runnerCtx.setLineDash([]);

        // Small ground detail dots
        for (let gx = (-groundOffset % 30); gx < W; gx += 30) {
            runnerCtx.fillStyle = '#f472b6';
            runnerCtx.globalAlpha = 0.2;
            runnerCtx.beginPath();
            runnerCtx.arc(gx, GROUND + 8, 2, 0, Math.PI * 2);
            runnerCtx.fill();
            runnerCtx.globalAlpha = 1;
        }

        // --- Physics ---
        cat.vy += GRAVITY_R;
        cat.y += cat.vy;

        if (cat.y >= GROUND - CAT_SIZE) {
            cat.y = GROUND - CAT_SIZE;
            cat.vy = 0;
            cat.isOnGround = true;
            cat.jumpsLeft = 2;
        } else {
            cat.isOnGround = false;
        }

        // --- Obstacles ---
        nextObstacleIn--;
        if (nextObstacleIn <= 0) {
            spawnObstacle();
            // Gaps scale with score
            nextObstacleIn = Math.floor(Math.random() * 40 + 55) - Math.min(runnerScore / 100, 20);
        }

        obstacles.forEach((obs, idx) => {
            obs.x -= runnerSpeed;
            if (obs.fly) obs.y = (flyingType.flyY) + Math.sin(frameCount * 0.06 + idx) * 12;

            // Draw obstacle with shapes
            drawObstacle(runnerCtx, obs, frameCount);

            // Collision (slightly forgiving hitbox)
            const pad = 6;
            if (
                CAT_X + CAT_SIZE - pad > obs.x + pad &&
                CAT_X + pad < obs.x + obs.w - pad &&
                cat.y + CAT_SIZE - pad > obs.y + pad &&
                cat.y + pad < obs.y + obs.h - pad
            ) {
                runnerState = 'dying';
                gameOver();
            }
        });
        obstacles = obstacles.filter(o => o.x > -50);

        // --- Particles ---
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.15;
            p.life -= 0.04;
            runnerCtx.globalAlpha = Math.max(0, p.life);
            runnerCtx.fillStyle = p.color;
            runnerCtx.beginPath();
            runnerCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            runnerCtx.fill();
            runnerCtx.globalAlpha = 1;
        });
        particles = particles.filter(p => p.life > 0);

        // --- Draw Cat ---

        // Shadow on ground
        runnerCtx.fillStyle = 'rgba(200,100,150,0.12)';
        runnerCtx.beginPath();
        const shadowScale = Math.max(0.3, 1 - (GROUND - CAT_SIZE - cat.y) / 120);
        runnerCtx.ellipse(CAT_X + CAT_SIZE / 2, GROUND + 5, CAT_SIZE * 0.55 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
        runnerCtx.fill();

        // Leg animation
        legTimer++;
        if (cat.isOnGround && legTimer % 7 === 0) legToggle = !legToggle;
        const tilt = cat.isOnGround ? (legToggle ? 0.1 : -0.1) : (cat.vy < 0 ? -0.15 : 0.1);
        const isDead = (runnerState === 'dying' || runnerState === 'dead');

        drawCat(runnerCtx, CAT_X, cat.y, CAT_SIZE, tilt, isDead);

        // Paw print trail on ground
        if (cat.isOnGround && legToggle) {
            runnerCtx.fillStyle = '#f9a8d4';
            runnerCtx.globalAlpha = 0.3;
            // little paw dot
            runnerCtx.beginPath();
            runnerCtx.arc(CAT_X - 6, GROUND + 3, 3, 0, Math.PI*2);
            runnerCtx.fill();
            runnerCtx.globalAlpha = 1;
        }

        // Speed lines when fast
        if (runnerSpeed > 8) {
            runnerCtx.strokeStyle = 'rgba(244,114,182,0.2)';
            runnerCtx.lineWidth = 1.5;
            for (let l = 0; l < 4; l++) {
                const ly = cat.y + 6 + l * 8;
                runnerCtx.beginPath();
                runnerCtx.moveTo(CAT_X - 8, ly);
                runnerCtx.lineTo(CAT_X - 8 - (runnerSpeed * 2.5), ly);
                runnerCtx.stroke();
            }
        }
    }

    // Controls
    runnerStartBtn.addEventListener('click', startRunner);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            e.preventDefault();
            if (runnerState === 'idle' || runnerState === 'dead') return;
            jump();
        }
    });

    runnerCanvas.addEventListener('click', () => jump());
    runnerCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });

});

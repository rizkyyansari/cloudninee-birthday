document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. TYPING EFFECT
    // ==========================================
    const typingTextElement = document.getElementById('typing-text');
    const messages = [
        "Wishing you a purr-fectly wonderful day! 🐾",
        "May your year be filled with endless joy! ✨",
        "Sending lots of warm hugs and cute meows! 🐱"
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


    // ==========================================
    // 2. COUNTDOWN TIMER
    // ==========================================
    const birthdayDate = new Date();
    birthdayDate.setDate(birthdayDate.getDate() + 3); // Set to 7 days from now
    birthdayDate.setHours(0, 0, 0, 0);

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = birthdayDate.getTime() - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown-days").textContent = days.toString().padStart(2, '0');
        document.getElementById("countdown-hours").textContent = hours.toString().padStart(2, '0');
        document.getElementById("countdown-minutes").textContent = minutes.toString().padStart(2, '0');
        document.getElementById("countdown-seconds").textContent = seconds.toString().padStart(2, '0');
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

    // Frequencies for Happy Birthday melody
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

    // Synthesizes a single "Meow" note using pitch & volume envelope bends
    function playMeowNote(frequency, duration) {
        if (!audioCtx || audioCtx.state === 'suspended') return;

        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Cute cat meow flavor uses a Triangle wave combined with a fast pitch glide
        osc.type = 'triangle';
        
        const now = audioCtx.currentTime;
        
        // Pitch Envelope: Rapid upward swoop at start to give the 'M-e-o-w' feel
        osc.frequency.setValueAtTime(frequency * 0.75, now);
        osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.08);
        osc.frequency.setValueAtTime(frequency, now + duration - 0.05);
        osc.frequency.linearRampToValueAtTime(frequency * 0.85, now + duration); // downward release tail

        // Volume Envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05); // Attack
        gainNode.gain.setValueAtTime(0.2, now + duration - 0.08); // Sustain level
        gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

        osc.start(now);
        osc.stop(now + duration);
    }

    function playSongLoop() {
        if (!isPlaying) return;
        
        const currentNote = notes[currentNoteIndex];
        playMeowNote(currentNote.f, currentNote.d);
        
        // Schedule next note slightly after duration for natural cadence
        nextNoteTimeout = setTimeout(() => {
            currentNoteIndex = (currentNoteIndex + 1) % notes.length;
            playSongLoop();
        }, currentNote.d * 1000 + 80);
    }

    function startMusic() {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
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
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });


    // ==========================================
    // 4. FLOATING PAWS BACKGROUND
    // ==========================================
    const floatContainer = document.getElementById('floating-container');
    function createFloatingPaw() {
        const paw = document.createElement('div');
        paw.className = 'floating-paw';
        paw.textContent = ['🐾', '✨', '🌸'][Math.floor(Math.random() * 3)];
        paw.style.left = Math.random() * 100 + 'vw';
        paw.style.animationDuration = Math.random() * 5 + 5 + 's';
        floatContainer.appendChild(paw);
        
        setTimeout(() => {
            paw.remove();
        }, 10000);
    }
    setInterval(createFloatingPaw, 1500);


    // ==========================================
    // 5. INTERACTIVE VSCODE PETS / GIFT BOX
    // ==========================================
    const giftBox = document.getElementById('gift-box');
    const giftStatus = document.getElementById('gift-status');
    const playground = document.getElementById('pet-playground');
    const emptyState = document.getElementById('playground-empty-state');
    
    let isBoxOpened = false;
    const activeCats = [];
    const catEmojis = ['🐈', '🐈‍⬛', '🐱', '😸', '😻', '😼', '😽'];

    class CatPet {
        constructor(container, startX = null, startY = null) {
            this.container = container;
            this.element = document.createElement('div');
            this.element.className = 'pet-cat spawn-ani';
            
            this.baseEmoji = catEmojis[Math.floor(Math.random() * catEmojis.length)];
            this.element.textContent = this.baseEmoji;
            
            this.container.appendChild(this.element);
            this.updateBoundary();
            
            this.x = startX !== null ? startX : this.maxWidth / 2;
            this.y = startY !== null ? startY : this.maxHeight / 2;
            
            this.vx = (Math.random() - 0.5) * 4;
            this.vy = (Math.random() - 0.5) * 2;
            this.gravity = 0.2;
            this.facingRight = this.vx > 0;
            
            this.element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.jump();
            });

            this.updateElementPosition();
        }

        jump() {
            this.vy = -6 - Math.random() * 3;
            this.element.textContent = '🙀';
            // Play an individual tiny custom meow tone when clicked
            if (audioCtx) {
                playMeowNote(400 + Math.random() * 200, 0.2);
            }
            setTimeout(() => {
                this.element.textContent = this.baseEmoji;
            }, 800);
        }

        updateBoundary() {
            const rect = this.container.getBoundingClientRect();
            this.maxWidth = rect.width - 32;
            this.maxHeight = rect.height - 32;
        }

        move() {
            this.updateBoundary();
            this.vy += this.gravity;
            
            this.x += this.vx;
            this.y += this.vy;

            if (this.x <= 0) {
                this.x = 0;
                this.vx *= -1;
            } else if (this.x >= this.maxWidth) {
                this.x = this.maxWidth;
                this.vx *= -1;
            }

            if (this.y <= 0) {
                this.y = 0;
                this.vy *= -1;
            } else if (this.y >= this.maxHeight) {
                this.y = this.maxHeight;
                this.vy = 0;
                
                if (Math.random() < 0.03) {
                    this.vy = -Math.random() * 4 - 2;
                }
                if (Math.random() < 0.02) {
                    this.vx = (Math.random() - 0.5) * 4;
                }
            }

            if (this.vx > 0.1) this.facingRight = true;
            else if (this.vx < -0.1) this.facingRight = false;

            this.element.style.transform = `scaleX(${this.facingRight ? 1 : -1})`;
            this.updateElementPosition();
        }

        updateElementPosition() {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
    }

    function animatePets() {
        activeCats.forEach(cat => cat.move());
        requestAnimationFrame(animatePets);
    }
    requestAnimationFrame(animatePets);

    function spawnCats(amount, x = null, y = null) {
        if (emptyState) emptyState.style.display = 'none';
        for (let i = 0; i < amount; i++) {
            setTimeout(() => {
                activeCats.push(new CatPet(playground, x, y));
            }, i * 150);
        }
    }

    // Gift Box Click Event
    giftBox.addEventListener('click', () => {
        if (!isBoxOpened) {
            isBoxOpened = true;
            giftBox.classList.remove('gift-shake');
            giftBox.textContent = '📦✨';
            giftBox.classList.add('gift-opened-anim');
            
            giftStatus.textContent = "THE BOX IS OPEN! CLICK INSIDE THE BOX BELOW!";
            giftStatus.classList.remove('animate-pulse');
            
            triggerConfetti();
            spawnCats(5);
            
            // Auto-trigger synthetic cat birthday music on interaction
            if (!isPlaying) {
                startMusic();
            }
        } else {
            spawnCats(2);
        }
    });

    playground.addEventListener('click', (e) => {
        if (!isBoxOpened) return;
        
        const rect = playground.getBoundingClientRect();
        const x = e.clientX - rect.left - 16;
        const y = e.clientY - rect.top - 16;
        
        spawnCats(1, x, y);
    });

    // ==========================================
    // 6. SIMPLE CONFETTI SYSTEM
    // ==========================================
    function triggerConfetti() {
        const canvas = document.getElementById('confetti-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const pieces = [];
        const colors = ['#fbcfe8', '#f9a8d4', '#f472b6', '#fbbf24', '#fcd34d'];

        for (let i = 0; i < 100; i++) {
            pieces.push({
                x: canvas.width / 2,
                y: canvas.height / 2 + 100,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 1) * 20,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }

        function animateConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            pieces.forEach(p => {
                p.vy += 0.5;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;

                if (p.y < canvas.height) active = true;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                ctx.restore();
            });

            if (active) requestAnimationFrame(animateConfetti);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        animateConfetti();
    }
});
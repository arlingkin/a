// --- 1. PROSES DEKRIPSI ANIMASI TEKS ---
const targetTextElement = document.querySelector('.decrypt-text');
const originalText = targetTextElement.getAttribute('data-target');
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*_+';
let frame = 0;

function decryptAnimation() {
    let output = '';
    let completeCount = 0;

    for (let i = 0; i < originalText.length; i++) {
        if (originalText[i] === ' ') {
            output += ' ';
            completeCount++;
            continue;
        }

        // Menghitung kapan setiap karakter harus berhenti berubah acak
        const triggerFrame = i * 2; 
        if (frame > triggerFrame) {
            output += originalText[i];
            completeCount++;
        } else {
            output += chars[Math.floor(Math.random() * chars.length)];
        }
    }

    targetTextElement.innerText = output;

    if (completeCount < originalText.length) {
        frame++;
        requestAnimationFrame(decryptAnimation);
    }
}

// Jalankan animasi dekripsi setelah halaman siap
setTimeout(decryptAnimation, 400);


// --- 2. LIGHTWEIGHT MATRIX NODES BACKGROUND ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

class Node {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
    }
}

const totalNodes = 35; // Sangat ringan, ramah RAM 3GB
const nodesArray = Array.from({ length: totalNodes }, () => new Node());

function renderNodes() {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.07)';
    ctx.fillStyle = 'rgba(0, 96, 255, 0.4)';

    for (let i = 0; i < totalNodes; i++) {
        nodesArray[i].update();
        ctx.beginPath();
        ctx.arc(nodesArray[i].x, nodesArray[i].y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < totalNodes; j++) {
            const dist = Math.hypot(nodesArray[i].x - nodesArray[j].x, nodesArray[i].y - nodesArray[j].y);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(nodesArray[i].x, nodesArray[i].y);
                ctx.lineTo(nodesArray[j].x, nodesArray[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(renderNodes);
}
renderNodes();

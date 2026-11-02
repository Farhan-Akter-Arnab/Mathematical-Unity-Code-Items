function removeLoader() {
    // Check if already removed to prevent double-firing
    if (document.body.classList.contains('loaded')) return;

    // Add 'loaded' class to body -> triggers CSS fade out
    document.body.classList.add('loaded');
    document.body.classList.remove('loading');
}

// 1. Standard Listener: Wait for page to fully load
window.addEventListener('load', () => {
    // Small delay (1000ms) so users can actually admire your animation
    setTimeout(removeLoader, 1000);
});

// 2. Safety Fallback: If page hangs for 4 seconds, force open
setTimeout(removeLoader, 3240);
let sidebarOpen = false;

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const content = document.getElementById("page-content");
    const isMobile = window.innerWidth <= 768;

    if (!sidebarOpen) {
        // OPEN
        sidebar.style.left = "0";

        if (!isMobile) {
            // Desktop → push
            content.classList.add("shift-desktop");
        } else {
            // Mobile → overlay + darken
            document.body.classList.add("sidebar-open");
        }

        sidebarOpen = true;
    } else {
        // CLOSE
        sidebar.style.left = isMobile ? "-40%" : "-24%";
        content.classList.remove("shift-desktop");
        document.body.classList.remove("sidebar-open");

        sidebarOpen = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', (e) => {
            e.preventDefault();

            // Directly invoke your toggle function if the sidebar is currently open
            if (typeof sidebarOpen !== 'undefined' && sidebarOpen) {
                toggleSidebar();
            }
        });
    }
});


function showTime() {
    var date = new Date();
    var h = date.getHours();
    var min = date.getMinutes();
    var s = date.getSeconds();
    var tar = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDay();
    var day_ord = "Sunday";
    var session = "AM";

    if (h == 0) {
        h = 12;
    }
    if (h > 12) {
        h = h - 12;
        session = "PM";
    }
    if (day == 0) {
        day_ord = "Sunday";
    }
    if (day == 1) {
        day_ord = "Monday";
    }
    if (day == 2) {
        day_ord = "Tuesday";
    }
    if (day == 3) {
        day_ord = "Wednesday";
    }
    if (day == 4) {
        day_ord = "Thursday";
    }
    if (day == 5) {
        day_ord = "Friday";
    }
    if (day == 6) {
        day_ord = "Saturday";
    }
    h = (h < 10) ? "0" + h : h;
    min = (min < 10) ? "0" + min : min;
    s = (s < 10) ? "0" + s : s;
    tar = (tar < 10) ? "0" + tar : tar;
    month = (month < 10) ? "0" + month : month;
    year = (year < 10) ? "0" + year : year;

    var tarihi = tar + "." + month + "." + year + " " + day_ord;

    var time = h + ":" + min + ":" + s + " " + session + ", " + tarihi;
    document.getElementById("Mathematical_Clock").innerText = time;
    setTimeout(showTime, 1000);
}
showTime();

(function initStarfield() {
    const canvas = document.getElementById('aw-starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Configuration Settings
    const CONFIG = {
        numStars: 700,         // Total number of active stars
        speed: 1,             // Speed of forward motion
        starColor: '#ffffff',  // Cyan color (or '#ffffff' for clean white)
        focalDistance: 300     // 3D perspective depth scale
    };

    let width = 0, height = 0;
    let cx = 0, cy = 0;

    // Resize canvas dynamically to match window dimensions
    function resize() {
        const pixelRatio = window.devicePixelRatio || 1;
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        cx = width / 2;
        cy = height / 2;
    }
    window.addEventListener('resize', resize);
    resize();

    // Star Object Class
    class Star {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            // Random 3D spatial positioning
            this.x = (Math.random() - 0.5) * width * 3;
            this.y = (Math.random() - 0.5) * height * 3;
            this.z = initial ? Math.random() * 1000 : 1000;
            this.pz = this.z; // Previous Z position for drawing motion trails
        }

        update() {
            this.pz = this.z;
            this.z -= CONFIG.speed;

            // Reset star when it flies past the viewer screen
            if (this.z <= 1) {
                this.reset(false);
                this.pz = this.z;
            }
        }

        draw() {
            // 3D Perspective Projection: X = cx + (x / z) * k, Y = cy + (y / z) * k
            const k = CONFIG.focalDistance;
            const px = cx + (this.x / this.z) * k;
            const py = cy + (this.y / this.z) * k;

            const prevPx = cx + (this.x / this.pz) * k;
            const prevPy = cy + (this.y / this.pz) * k;

            // Skip drawing if outside screen bounds
            if (px < 0 || px >= width || py < 0 || py >= height) return;

            // Calculate opacity and line thickness based on proximity
            const alpha = Math.min(1, Math.max(0, (1000 - this.z) / 800));
            const size = Math.max(0.5, (1 - this.z / 1000) * 2.5);

            // Draw forward-moving star streak line
            ctx.beginPath();
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.strokeStyle = CONFIG.starColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = size;
            ctx.lineCap = 'round';
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }
    }

    // Initialize Star Pool
    const stars = Array.from({ length: CONFIG.numStars }, () => new Star());

    // 60 FPS Render Animation Loop
    function animate() {
        // Clear screen with dark background (or adjust alpha for motion blur trails)
        ctx.fillStyle = '#030508';
        ctx.clearRect(0, 0, width, height);

        // Update and draw all stars
        for (let i = 0; i < stars.length; i++) {
            stars[i].update();
            stars[i].draw();
        }

        requestAnimationFrame(animate);
    }

    // Start animation on window load
    requestAnimationFrame(animate);
})();
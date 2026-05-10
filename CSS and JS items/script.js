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
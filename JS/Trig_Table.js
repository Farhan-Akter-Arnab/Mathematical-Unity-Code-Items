
document.addEventListener("click", function (e) {
    const sidebar = document.getElementById("sidebar");
    const isMobile = window.innerWidth <= 768;

    if (!isMobile || !sidebarOpen) return;

    // If click is outside sidebar
    if (!sidebar.contains(e.target)) {
        closeSidebar();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const tableCells = document.querySelectorAll(".real-choco-table td");

    tableCells.forEach((cell) => {
        const originalContent = cell.innerHTML.trim(); // Store the original LaTeX content
        const approxValue = cell.getAttribute("data"); // Get the approximate value

        // Create wrapper elements for the original and approximate values
        const originalDiv = document.createElement("div");
        originalDiv.classList.add("content", "original");
        originalDiv.innerHTML = originalContent;

        const approxDiv = document.createElement("div");
        approxDiv.classList.add("content", "approx");
        approxDiv.innerHTML = approxValue || "N/A"; // Show "N/A" if no approx value

        // Clear the cell and append the wrapper elements
        cell.innerHTML = "";
        cell.appendChild(originalDiv);
        cell.appendChild(approxDiv);

        // Add click event listener to toggle the values
        cell.addEventListener("click", function () {
            cell.classList.toggle("toggled"); // Toggle the "toggled" class
        });

        // No per-cell overflow needed; we rely on the table wrapper scroll.
    });

    const tableContainer = document.querySelector('.real-choco-table-container');
    if (tableContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        tableContainer.addEventListener('mousedown', (e) => {
            isDown = true;
            tableContainer.classList.add('active-drag');
            startX = e.pageX - tableContainer.offsetLeft;
            scrollLeft = tableContainer.scrollLeft;
        });

        tableContainer.addEventListener('mouseleave', () => {
            isDown = false;
            tableContainer.classList.remove('active-drag');
        });

        tableContainer.addEventListener('mouseup', () => {
            isDown = false;
            tableContainer.classList.remove('active-drag');
        });

        tableContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - tableContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            tableContainer.scrollLeft = scrollLeft - walk;
        });

        tableContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - tableContainer.offsetLeft;
            scrollLeft = tableContainer.scrollLeft;
        }, { passive: true });

        tableContainer.addEventListener('touchmove', (e) => {
            const x = e.touches[0].pageX - tableContainer.offsetLeft;
            const walk = (x - startX) * 1.2;
            tableContainer.scrollLeft = scrollLeft - walk;
            updateScrollThumb(tableContainer);
        }, { passive: true });

        const thumb = document.getElementById('table-scroll-thumb');
        const updateScrollThumb = (container) => {
            if (!thumb) return;
            const ratio = container.clientWidth / container.scrollWidth;
            const width = Math.max(Math.round(ratio * 100), 8);
            const left = Math.round((container.scrollLeft / container.scrollWidth) * 100);
            thumb.style.width = `${width}%`;
            thumb.style.transform = `translateX(${left}%)`;
        };

        if (thumb) {
            updateScrollThumb(tableContainer);
            tableContainer.addEventListener('scroll', () => updateScrollThumb(tableContainer));
            window.addEventListener('resize', () => updateScrollThumb(tableContainer));
        }
    }
});
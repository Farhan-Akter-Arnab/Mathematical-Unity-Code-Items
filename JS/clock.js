const numberHours = document.querySelector(".number-hours");
const barSeconds = document.querySelector(".bar-seconds");

const numberElement = [];
const barElement = [];

for (let i = 1; i <= 24; i++) {
    numberElement.push(
        `<span style="--index:${i};"><p>${i}</p></span>`
    );
    
}
numberHours.insertAdjacentHTML("afterbegin", numberElement.join(""));

for (let i = 1; i <= 60; i++) {
    barElement.push(
        `<span style="--index:${i};"><p></p></span>`
    );

}
barSeconds.insertAdjacentHTML("afterbegin", barElement.join(""));

const hoursHand = document.querySelector(".hand.hours");
const minutesHand = document.querySelector(".hand.minutes");
const secondsHand = document.querySelector(".hand.seconds");

function getCurrentTime() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ms = date.getMilliseconds();

    // 1. Rotate Analog Clock Hands (Safe element checks)
    if (typeof minutesHand !== 'undefined' && minutesHand) {
        minutesHand.style.transform = `rotate(${(minutes * 6) + (seconds * 0.1)}deg)`;
    }
    if (typeof hoursHand !== 'undefined' && hoursHand) {
        hoursHand.style.transform = `rotate(${(hours * 15) + (minutes * 0.25) + (seconds * (1 / 240))}deg)`;
    }
    if (typeof secondsHand !== 'undefined' && secondsHand) {
        secondsHand.style.transform = `rotate(${seconds * 6}deg)`;
    }

    // 2. 24-Hour Digital String
    const pad = (num) => String(num).padStart(2, '0');
    const time24 = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

    // 3. Hand Angles Math (24-Hour scale: 360° / 24 = 15° per hour)
    const exactMinutes = minutes + seconds / 60;
    const exactHours = hours + exactMinutes / 60;

    const hourAngle = exactHours * 15;
    const minuteAngle = exactMinutes * 6;

    // 4. Absolute Interior Angle between Hour & Minute Hands
    let diffAngle = Math.abs(hourAngle - minuteAngle) % 360;
    if (diffAngle > 180) {
        diffAngle = 360 - diffAngle;
    }

    // 5. Percentage of Day Passed
    const totalSecondsInDay = 86400;
    const currentSeconds = (hours * 3600) + (minutes * 60) + seconds + (ms / 1000);
    const dayPercentage = ((currentSeconds / totalSecondsInDay) * 100).toFixed(2);

    // 6. Update HTML Info Panel Elements Safely
    const el24 = document.getElementById('digital-24');
    const elAngle = document.getElementById('angle-hm');
    const elPercent = document.getElementById('day-percent');

    if (el24) el24.textContent = time24;
    if (elAngle) elAngle.textContent = `${diffAngle.toFixed(1)}°`;
    if (elPercent) elPercent.textContent = `${dayPercentage}%`;
}

// Run immediately on load, then update smoothly every 100ms
getCurrentTime();
setInterval(getCurrentTime, 1000);
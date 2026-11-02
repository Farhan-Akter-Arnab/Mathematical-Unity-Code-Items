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

    minutesHand.style.transform = `rotate(${(minutes * 6) + (seconds * 0.1)}deg)`;
    hoursHand.style.transform = `rotate(${(hours * 15) + (minutes * 0.25) + (seconds * (1/240))}deg)`;
    secondsHand.style.transform = `rotate(${seconds * 6}deg)`;
}

getCurrentTime();
setInterval(getCurrentTime, 1000);
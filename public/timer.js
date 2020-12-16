const Mousetrap = require('mousetrap');

let startTime, updatedTime, difference, tInterval, savedTime;
let paused = 0;
let running = 0;

// Set up hotkeys
document.addEventListener("DOMContentLoaded", () => {
    Mousetrap.bind('\\', () => {
        if (document.querySelector('input[name="middlebox"]:checked').value === 'racetime') return;
        if (!running){
            startTime = new Date().getTime();
            tInterval = setInterval(getShowTime, 1000);
            paused = 0;
            running = 1;
        } else if (!paused) {
            clearInterval(tInterval);
            savedTime = difference;
            paused = 1;
            running = 0;
        }
    }, 'keyup');
    
    Mousetrap.bind('`', () => {
        if (document.querySelector('input[name="middlebox"]:checked').value === 'racetime') return;
        reset();
    }, 'keyup');
});

// Change minutes/hours view on button change
const timerRadioCheck = () => {
    const timerRadio = document.querySelector('input[name="timer-length"]:checked');
    const currentConsole = set[document.getElementById('consoles').value];
    document.getElementById('timer').style.fontSize = timerRadio.value === 'minutes' ? currentConsole.timer.minutes : currentConsole.timer.hours;
    if (!running) {
        if (timerRadio.value === 'minutes') {
            document.getElementById("timer").innerHTML = '00:00'
        } else {
            document.getElementById("timer").innerHTML = '0:00:00';
        }
    }
}

// Start the timer
const start = () => {
    if (!running) {
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1000);
        paused = 0;
        running = 1;
    }
};

// Pause the timer
const pause = () => {
    if (!difference) {}
    else if (!paused) {
        clearInterval(tInterval);
        savedTime = difference;
        paused = 1;
        running = 0;
    } else {
    start();
    }
};

// Reset the timer
const reset = () => {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    if (document.querySelector('input[name="timer-length"]:checked').value === 'minutes') {
        document.getElementById("timer").innerHTML = '00:00'
    } else {
        document.getElementById("timer").innerHTML = '0:00:00';
    }
};

// Display time
const getShowTime = () => {
    updatedTime = new Date().getTime();
    if (savedTime) difference = (updatedTime - startTime) + savedTime;
    else difference =  updatedTime - startTime;
    var seconds = Math.floor(difference / 1000);
    /*if (seconds >= 3600) {
        
    }*/
    let time;
    if (document.querySelector('input[name="timer-length"]:checked').value === 'minutes') {
        time = ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + (seconds % 60)).slice(-2);
    } else {
        time = Math.floor(seconds / 3600) + ':' + ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + (seconds % 60)).slice(-2);
    }
    document.getElementById("timer").innerHTML = time;
}
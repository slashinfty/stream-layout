const mousetrap = require('mousetrap');

let startTime, updatedTime, difference, tInterval, savedTime;
let paused = 0;
let running = 0;

document.addEventListener("DOMContentLoaded", () => {
    Mousetrap.bind('\\', () => {
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
    
    Mousetrap.bind('`', reset, 'keyup');
});

const start = () => {
    if (!running) {
        startTime = new Date().getTime();
        tInterval = setInterval(getShowTime, 1000);
        paused = 0;
        running = 1;
    }
};

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

const reset = () => {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    paused = 0;
    running = 0;
    document.getElementById("timer").innerHTML = '00:00';
};

const getShowTime = () => {
    updatedTime = new Date().getTime();
    if (savedTime) difference = (updatedTime - startTime) + savedTime;
    else difference =  updatedTime - startTime;
    var seconds = Math.floor(difference / 1000);
    let time = (('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + (seconds % 60)).slice(-2));
    document.getElementById("timer").innerHTML = time;
}
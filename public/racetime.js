const iso = require('iso8601-duration');
const fetch = require('node-fetch');
const WebSocket = require('ws');
var currentRace;

// Determine if showing race info or Twitch chat
const middleRadioCheck = () => {
    const middleRadio = document.querySelector('input[name="middlebox"]:checked');

    // Stop monitoring race data
    if (middleRadio.value === 'twitch') {
        document.getElementById('startTimer').disabled = false;
        document.getElementById('pauseTimer').disabled = false;
        document.getElementById('resetTimer').disabled = false;
        if (currentRace !== undefined) currentRace.close();
    }
}

class RaceRoom {
    constructor (raceName, wsURL) {
        this.name = raceName;
        this.connection = new WebSocket(wsURL);
        this.timer;
        const room = this;

        this.connection.onopen = function() {
            console.log('connected to ' + room.name);
        }

        this.connection.onmessage = function(obj) {
            const data = JSON.parse(obj.data);
            console.log(data);
            if (data.type === 'error') {
                data.errors.forEach(e => console.error(e));
                return;
            }
            if (data.type === 'race.data') {
                const timerElement = document.getElementById("timer");
                const minutesView = document.querySelector('input[name="timer-length"]:checked').value === 'minutes';
                if (data.race.status.value !== 'in_progress') {
                    if (minutesView) timerElement.innerHTML = '00:00';
                    else timerElement.innerHTML = '0:00:00';
                    if (data.race.status.value === 'finished' || data.race.status.value === 'cancelled') {
                        clearInterval(this.timer);
                        room.connection.close();
                    }
                } else if (room.timer === undefined) room.timer = setInterval(room.updateTime, 1000, data.race.started_at);
                let leftInfo = '';
                let rightInfo = '';
                for (let i = 0; i < Math.min(data.race.entrants.length, 9); i++) {
                    const e = data.race.entrants[i];
                    let racerName = i === 0 ? e.user.name : '<br />' + e.user.name;
                    let racerProgress = i === 0 ? '' : '<br />';
                    switch (e.status.value) {
                        case 'ready':
                            racerProgress += 'Ready';
                            break;
                        case 'not_ready':
                            racerProgress += 'Not Ready';
                            break;
                        case 'in_progress':
                            racerProgress += 'In Progress';
                            break;
                        case 'dnf':
                            racerProgress += 'DNF';
                            break;
                        case 'done':
                            racerProgress += room.convert(iso.toSeconds(iso.parse(e.finish_time))) + ' (' + room.suffix(e.place) + ')';
                            break;
                        case 'invited':
                            racerProgress += 'Invited';
                            break;
                        case 'requested':
                            racerProgress += 'Requested';
                            break;
                        default:
                            racerProgress += 'N/A';
                            break;
                    }
                    leftInfo += racerName;
                    rightInfo += racerProgress;
                }
                document.getElementById('left-rtgg').innerHTML = leftInfo;
                document.getElementById('right-rtgg').innerHTML = rightInfo;
                console.log(room.startTime);
                console.log(room.timer);
            }
        }

        this.close = function() {
            clearInterval(this.timer);
            document.getElementById('left-rtgg').innerHTML = '';
            document.getElementById('right-rtgg').innerHTML = '';
            if (document.querySelector('input[name="timer-length"]:checked').value === 'minutes') {
                document.getElementById("timer").innerHTML = '00:00'
            } else {
                document.getElementById("timer").innerHTML = '0:00:00';
            }
            room.connection.close();
        }
    }
    convert(time) {
        let hr, min, sec, ms;
        let parts = time.toString().split('.');
        ms = parts.length > 1 ? parseInt((parts[1] + '00').substr(0,3)) : undefined;
        sec = parseInt(parts[0]);
        if (sec >= 60) {min = Math.floor(sec / 60); sec = ('0' + (sec % 60)).substr(-2, 2);}
        if (min >= 60) {hr = Math.floor(min / 60); min = ('0' + (min % 60)).substr(-2, 2);}
        if (ms !== undefined) ms = ('00' + ms).substr(-3, 3);
        if (min === undefined) return ms === undefined ? '0:' + sec.toString() : '0:' + sec.toString() + '.' + ms.toString();
        else if (hr === undefined) return ms === undefined ? min.toString() + ':' + sec.toString() : min.toString() + ':' + sec.toString() + '.' + ms.toString();
        else return ms === undefined ? hr.toString() + ':' + min.toString() + ':' + sec.toString() : hr.toString() + ':' + min.toString() + ':' + sec.toString() + '.' + ms.toString();
    }

    suffix(i) {
        let j = i % 10, k = i % 100;
        return j === 1 && k !== 11 ? i + 'st' : j === 2 && k !== 12 ? i + 'nd' : j === 3 && k !== 13 ? i + 'rd' : i + 'th';
    };

    updateTime(time) {
        const timerElement = document.getElementById("timer");
        const minutesView = document.querySelector('input[name="timer-length"]:checked').value === 'minutes';
        let seconds = Math.floor((new Date(Date.now()) - new Date(time)) / 1000);
        if (seconds >= 0) timerElement.innerHTML = minutesView ? ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + (seconds % 60)).slice(-2) : Math.floor(seconds / 3600) + ':' + ('0' + Math.floor(seconds / 60)).slice(-2) + ':' + ('0' + (seconds % 60)).slice(-2);
    }
}

const getRace = async () => {
    const raceUrl = document.getElementById('race').value;
    try {
        const racetimeResponse = await fetch('https://racetime.gg/' + raceUrl + '/data');
        const racetimeObject = await racetimeResponse.json();
        currentRace = new RaceRoom(racetimeObject.name, new URL(racetimeObject.websocket_url, 'wss://racetime.gg'));
    } catch (error) {
        console.error(error);
        return;
    }
    document.getElementById('startTimer').disabled = true;
    document.getElementById('pauseTimer').disabled = true;
    document.getElementById('resetTimer').disabled = true;
}

const closeRace = async () => {
    document.getElementById('startTimer').disabled = false;
    document.getElementById('pauseTimer').disabled = false;
    document.getElementById('resetTimer').disabled = false;
    if (currentRace !== undefined) currentRace.close();
}
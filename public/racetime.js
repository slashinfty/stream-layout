const iso = require('iso8601-duration');
const fetch = require('node-fetch');
var rtggInterval;

const middleRadioCheck = () => {
    const middleRadio = document.querySelector('input[name="middlebox"]:checked');
    if (middleRadio.value === 'racetime' && document.getElementById('race').value !== '') rtggInterval = setInterval(getRaceInfo, 10000);
    else if (middleRadio.value === 'twitch') {
        clearInterval(rtggInterval);
        document.getElementById('left-rtgg').innerHTML = '';
        document.getElementById('right-rtgg').innerHTML = '';
    }
}

const getRaceInfo = async () => {
    const convert = time => {
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
    const suffix = i => {
        let j = i % 10, k = i % 100;
        return j === 1 && k !== 11 ? i + 'st' : j === 2 && k !== 12 ? i + 'nd' : j === 3 && k !== 13 ? i + 'rd' : i + 'th';
    };
    
    const raceUrl = document.getElementById('race').value;
    let entrants;
    try {
        const racetimeResponse = await fetch('https://racetime.gg/' + raceUrl + '/data');
        const racetimeObject = await racetimeResponse.json();
        entrants = racetimeObject.entrants;
    } catch (error) {
        console.error(error);
        return;
    }
    document.getElementById('left-rtgg').innerHTML = '';
    document.getElementById('right-rtgg').innerHTML = '';
    entrants.forEach((e, i) => {
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
                racerProgress += convert(iso.toSeconds(iso.parse(e.finish_time))) + ' (' + suffix(e.place) + ')';
                break;
            default:
                racerProgress += 'N/A';
                break;
        }
        document.getElementById('left-rtgg').innerHTML += racerName;
        document.getElementById('right-rtgg').innerHTML += racerProgress;
    });
}
const skins = require('./skins.js');

const root = document.documentElement;

const set = { //add racetime font size
    "sgb2": {
        "timer": {
            "minutes": '9.2em',
            "hours": '7em',
            "height": 160
        },
        "twitch": {
            "font": '1.8em'
        },
        "racetime": {
            "font": '1.4em'
        },
        "nincid": {
            "scale": 472 / 1080
        },
        "gamefeed": {
            "height": 700,
            "width": 778
        }
    },
    "nes": {
        "timer": {
            "minutes": '9.2em',
            "hours": '7em',
            "height": 160
        },
        "twitch": {
            "font": '1.8em'
        },
        "racetime": {
            "font": '1.4em'
        },
        "nincid": {
            "scale": 450 / 1080
        },
        "gamefeed": {
            "height": 700,
            "width": 800
        }
    },
    "snes": {
        "timer": {
            "minutes": '9.2em',
            "hours": '7em',
            "height": 160
        },
        "twitch": {
            "font": '1.8em'
        },
        "racetime": {
            "font": '1.4em'
        },
        "nincid": {
             "scale": 450 / 981
        },
        "gamefeed": {
            "height": 700,
            "width": 800
        }
    },
    "n64": {
        "timer": {
            "minutes": '6.6em',
            "hours": '5em',
            "height": 130
        },
        "twitch": {
            "font": '1.3em'
        },
        "racetime": {
            "font": '0.9em'
        },
        "nincid": {
            "scale": 317 / 981
        },
        "gamefeed": {
            "height": 700,
            "width": 933
        }
    },
    "gcn": {
        "timer": {
            "minutes": '6.6em',
            "hours": '5em',
            "height": 130
        },
        "twitch": {
            "font": '1.3em'
        },
        "racetime": {
            "font": '0.9em'
        },
        "nincid": {
             "scale": 317 / 981
        },
        "gamefeed": {
            "height": 700,
            "width": 933
        }
    }
};

// Setting up the layout
const setLayout = async (console = null) => {
    if (console === null) console = document.getElementById('consoles').value;
    // Clearing everything out
    const allDivs = [...document.querySelectorAll('div:not(.keep)')];
    allDivs.forEach(d => d.innerHTML = d.id === 'timer' ? '00:00' : '');
    document.getElementById('background').style.display = 'block';
    
    // Placing game feed red block
    const gamefeed = document.getElementById('gamefeed');
    gamefeed.style.height = set[console].gamefeed.height + 'px';
    gamefeed.style.width = set[console].gamefeed.width + 'px';
    gamefeed.style.left = (1270 - set[console].gamefeed.width) + 'px';
    
    // Controller input display
    const nincid = document.getElementById('nincid');
    const scaleFactor = set[console].nincid.scale;
    root.style.setProperty('--scale-factor', scaleFactor);
    const skinobject = skins[console];
    nincid.style.height = (skinobject.height * scaleFactor) + 'px';
    root.style.setProperty('--left-width', (skinobject.width * scaleFactor) + 'px')
    const backPath = upath.toUnix(upath.join(__dirname, "../static/skins/", console, '/'));
    const backElement = document.createElement('img');
    backElement.setAttribute('src', backPath + 'back.png');
    nincid.appendChild(backElement);
    const buttons = new DocumentFragment();
    skinobject.buttons.forEach(button => {
        const buttonElement = document.createElement('img');
        const buttonID = button.name;
        buttonElement.setAttribute('id', buttonID);
        buttonElement.setAttribute('src', backPath + button.image);
        const dim = button.hasOwnProperty('width') ? 'height:' + (button.height * scaleFactor) + 'px;width:' + (button.width * scaleFactor) + 'px;' : '';
        const vis = button.hasOwnProperty('range') ? 'visibility:visible;' : 'visibility:hidden;';
        buttonElement.setAttribute('style', 'left:' + (button.x * scaleFactor) + 'px;top:' + (button.y * scaleFactor) + 'px;' + vis + dim);
        buttons.appendChild(buttonElement);
    });
    nincid.appendChild(buttons);
    
    // Timer
    const timer = document.getElementById('timer');
    timer.style.height = set[console].timer.height + 'px';
    timer.style.lineHeight = getComputedStyle(timer).height;
    timer.style.fontSize = document.querySelector('input[name="timer-length"]:checked').value === 'minutes' ? set[console].timer.minutes : set[console].timer.hours;

    // Info
    const info = document.getElementById('info');
    info.style.top = (10 + parseFloat(getComputedStyle(timer).height)) + 'px';
    
    // Twitch
    const twitch = document.getElementById('twitch');
    twitch.style.height = (680 - (parseFloat(getComputedStyle(nincid).height) + parseFloat(getComputedStyle(timer).height) + parseFloat(getComputedStyle(info).height))) + 'px';
    twitch.style.fontSize = set[console].twitch.font;

    // Racetime
    const racetime = document.getElementById('racetime');
    racetime.style.height = (680 - (parseFloat(getComputedStyle(nincid).height) + parseFloat(getComputedStyle(timer).height) + parseFloat(getComputedStyle(info).height))) + 'px';
    racetime.style.fontSize = set[console].racetime.font;
};
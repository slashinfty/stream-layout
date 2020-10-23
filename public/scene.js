const skins = require('./skins.js');

const root = document.documentElement;

const set = {
    "sgb2": {
        "timer": {
            "minutes": '9.2em',
            "hours": '7em'
        },
        "info": {
            "size": '1.3em'
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
            
        },
        "info": {
            
        },
        "twitch": {
            
        },
        "racetime": {
            
        },
        "nincid": {
            
        },
        "gamefeed": {
            
        }
    },
    "snes": {
        "timer": {
            
        },
        "info": {
            
        },
        "twitch": {
            
        },
        "racetime": {
            
        },
        "nincid": {
             
        },
        "gamefeed": {
            
        }
    },
    "n64": {
        "timer": {
            
        },
        "info": {
            
        },
        "twitch": {
            
        },
        "racetime": {
            
        },
        "nincid": {
            
        },
        "gamefeed": {
            
        }
    },
    "gcn": {
        "timer": {
            
        },
        "info": {
            
        },
        "twitch": {
            
        },
        "racetime": {
            
        },
        "nincid": {
             
        },
        "gamefeed": {
            
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
    timer.style.fontSize = set[console].timer.minutes; // depends
    
    // Info
    const info = document.getElementById('info');
    info.style.fontSize = set[console].info.size;
    
    // Twitch
    const twitch = document.getElementById('twitch');
    twitch.style.height = (680 - (parseFloat(getComputedStyle(nincid).height) + parseFloat(getComputedStyle(timer).height) + parseFloat(getComputedStyle(info).height))) + 'px';

    // Racetime
    const racetime = document.getElementById('racetime');
    racetime.style.height = (680 - (parseFloat(getComputedStyle(nincid).height) + parseFloat(getComputedStyle(timer).height) + parseFloat(getComputedStyle(info).height))) + 'px';
};
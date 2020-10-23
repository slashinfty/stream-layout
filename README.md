# Stream Layout
A Node.js-based Electron app to use as a stream layout

Contains an embedded controller input display (NinCID), fading Twitch chat, timer with local hotkeys, personal best and world record queries from speedrun.com, and a racetime.gg race info display.

Customizing the layout requires you to have some knowledge HTML, CSS, and JavaScript.

## Cloning

```
# Clone repository
git clone https://github.com/slashinfty/stream-layout.git && cd stream-layout

# Install
yarn install

# If permissions are not set on chrome-sandbox when attempting to start
sudo chown root node_modules/electron/dist/chrome-sandbox && sudo chmod 4755 node_modules/electron/dist/chrome-sandbox

# If there is an error about bindings and node versions after starting
rm yarn.lock && rm -rf node_modules/serialport node_modules/@serialport
yarn install
./node_modules/.bin/electron-rebuild # For Linux/Mac
# For Windows:
# .\node_modules\.bin\electron-rebuild.cmd 

# Start
yarn start
```
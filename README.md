# Control QLC+ via the Streamdeck

this stramdeck plugin is made to control [QLC+](https://github.com/mcallegari/qlcplus/) with the [Elgato stramdeck+](https://www.elgato.com/de/de/p/stream-deck-plus)

## Features

The plugin supports the dials to control faders, and buttons to control buttons.

## Setup

QLC+ only has a open websocket if you start it with the -w option via the commandline.
It is recormendet that you make a desktop shortcut like

```
  start "" "C:\Users\USERNAME\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Q Light Controller Plus\Q Light Controller Plus" --open "C:\Users\USERNAME\Documents\showfile.qxw" --operate -w -wp 2480
```

The plugin has to be compiled via the Stremdeck CLI and linked with software [Readmore](https://docs.elgato.com/streamdeck/cli/intro)

### Add a Button

1. Open the Stramdeck Software
2. Add a "Button" from the right sidebar menu to your streamdeck
3. Set a titel (if you whant, it isnt required for it to work, you could also set a backgroundimage, i recomend a solid color)
4. Set the Websocket URL (example: 127.0.0.1:2480)
   - 127.0.0.1 means it is localhost
   - :2480 is the portnumber which you set when starting QLC+
5. Set the ButtonID
   - The easiest way to get it is to open the url in the browser (127.0.0.1:2480), open the inspector and read the HTML element ID

### Add a Fader

Repeat step 1-5 the same way, only with the fader Option.
**Tip:** The id isn't on the <div> but on the input element inside. It also has to be a number and is NOT slv26 (The id here would be 26)

# ToDo:

## Add a selector for the buttons and faders, to select from a list of names

# License

Please feel feel free to use, and modify this code in arcordence with the MIT LICENSE

import context from "./context.js" 
import * as events from "./events.js"

class InputEvent extends events.Event{
    constructor(name, key){
        super(name);
        this.key = key;
    }
}

class KeydownEvent extends InputEvent{
}

class KeyupEvent extends InputEvent{
}

class InputManager{
    constructor(){
        this.keyboardState = new Map();

        this.keyboardMap = {
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            81: 'q',
            69: 'e',
            65: 'a',
            83: 's',
            68: 'd',
            87: 'w'
        };
    }

    getKeyState(key){
        return this.keyboardState.get(key);
    }

    subscribe() {
        document.body.addEventListener("keydown", (e)=> {
            var code = this.keyboardMap[e.keyCode];
            if (code) {
                var state = this.keyboardState.get(code);
                if (!state) {
                    this.keyboardState.set(code, true);
                    context.engine.eventsManager.pushEvent(new KeydownEvent('keydown', code));
                }
            }
        });
        document.body.addEventListener("keyup", (e)=> {
            var code = this.keyboardMap[e.keyCode];
            if (code) {
                var state = this.keyboardState.get(code);
                if (state) {
                    this.keyboardState.set(code, false);
                    context.engine.eventsManager.pushEvent(new KeyupEvent('keyup', code));
                }
            }
        });
    }

    unsubscribe(){
        //TODO: unsubscribe from events correctly
        //document.body.removeEventListener("keydown");
        //document.body.removeEventListener("keyup");
    }
}
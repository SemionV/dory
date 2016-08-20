define(['events', 'context'], function(events, context){
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
                40: "down"
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
            document.body.removeEventListener("keydown");
            document.body.removeEventListener("keyup");
        }
    }

    return {
        InputManager,
        KeydownEvent,
        KeyupEvent
    }
});
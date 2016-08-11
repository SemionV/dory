define(function(){
    class InputManager{
        constructor(){
            this.listeners = new Set();
            this.keyboardState = new Map();

            this.keyboardMap = {
                37: "left",
                38: "up",
                39: "right",
                40: "down"
            };
        }

        removeListener(listener) {
            this.listeners.delete(listener);
        }

        addListener(listener){
            this.listeners.add(listener);
        }

        notify(eventName, key) {
            for(let listener of this.listeners){
                listener(eventName, key);
            }
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
                        this.notify("keydown", code);
                    }
                }
            });
            document.body.addEventListener("keyup", (e)=> {
                var code = self.keyboardMap[e.keyCode];
                if (code) {
                    var state = this.keyboardState.get(code);
                    if (state) {
                        self.keyboardState.set(false);
                        self.notify("keyup", code);
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
        InputManager
    }
});
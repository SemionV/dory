import * as messages from "./messages.js"

export class InputSystem {
    constructor(messagePool) {
        this.deviceListeners = new Set();
        this.messagePool = messagePool;
    }

    addDeviceListener(listener) {
        this.deviceListeners.add(listener);
    }

    attach(context) {
        this.context = context;

        let deviceEventHandler = (deviceEvent) => {
            this.messagePool.pushMessage(new messages.DeviceInputMessage(deviceEvent));
        };

        for(let listener of this.deviceListeners) {
            listener.attach(deviceEventHandler);
        }
    }

    detach() {
        this.context = null;

        for(let listener of this.deviceListeners) {
            listener.detach();
        }
    }
}

export class CommandTrigger {
    checkTrigger(deviceEvent, context) {
    }
}

export class Command {
    execute(parameters, context) {        
    }
}

export class DeviceListener {
    attach(callback) {
    }

    detach() {        
    }
}

export class KeyboardKeys {
    static arrowLeft = "ArrowLeft";
    static arrowRight = "ArrowRight";
    static arrowUp = "ArrowUp";
    static arrowDown = "ArrowDown";
    static w = "w";
    static a = "a";
    static s = "s";
    static d = "d";
    
}

export class BrowserKeyboardListener extends DeviceListener { 
    constructor(htmlNode){
        super();
        this.htmlNode = htmlNode;
    }

    attach(callback) {
        if(!this.keydownHandler && !this.keyupHandler) {

            this.keydownHandler = (e)=> {
                let key = this.mapBrowserKey(e.key);
                if(!this.keyboardState[key]) {
                    this.keyboardState[key] = true;
                    callback(new KeyboardKeydownEvent(key, this.keyboardState));
                }
            }

            this.keyupHandler = (e)=> {
                let key = this.mapBrowserKey(e.key);
                if(this.keyboardState[key]) {
                    this.keyboardState[key] = false;
                    callback(new KeyboardKeyupEvent(key, this.keyboardState));
                }
            }

            this.keyboardState = new Map();

            this.htmlNode.addEventListener("keydown", this.keydownHandler);
            this.htmlNode.addEventListener("keyup", this.keyupHandler);
        }
    }

    detach() {
        if(this.keydownHandler && this.keyupHandler) {
            this.htmlNode.removeEventListener("keydown", this.keydownHandler);
            this.htmlNode.removeEventListener("keyup", this.keyupHandler);

            this.keydownHandler = null;
            this.keyupHandler = null;
        }
    }

    mapBrowserKey(browserKey) {
        return browserKey;
    }
}

export class DeviceEvent {
}

export class KeyboardKeyEvent extends DeviceEvent {
    constructor(key, keyboardState) {
        super();
        this.key = key;
        this.keyboardState = keyboardState;
    }
}

export class KeyboardKeydownEvent extends KeyboardKeyEvent {
    constructor(key, keyboardState) {
        super(key, keyboardState);
    }
}

export class KeyboardKeyupEvent extends KeyboardKeyEvent {
    constructor(key, keyboardState) {
        super(key, keyboardState);
    }
}
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

export class BrowserKeyboardListener extends DeviceListener { 
    constructor(htmlNode){
        super();
        this.htmlNode = htmlNode;
    }

    attach(callback) {
        if(!this.keydownHandler && !this.keyupHandler) {

            this.keydownHandler = (e)=> {
                callback(new KeyboardKeydownEvent(e.key));
            }

            this.keyupHandler = (e)=> {
                callback(new KeyboardKeyupEvent(e.key));
            }

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
}

export class DeviceEvent {
}

export class KeyboardKeyEvent extends DeviceEvent {
    constructor(key) {
        super();
        this.key = key;
    }
}

export class KeyboardKeydownEvent extends KeyboardKeyEvent {
    constructor(key) {
        super(key);
    }
}

export class KeyboardKeyupEvent extends KeyboardKeyEvent {
    constructor(key) {
        super(key);
    }
}
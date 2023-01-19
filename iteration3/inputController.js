export class InputController {
    constructor() {
        this.commandTriggers = new Map();
        this.deviceListeners = new Set();
    }

    addTrigger(trigger, command) {
        this.commandTriggers.set(trigger, command);
    }

    addDeviceListener(listener) {
        this.deviceListeners.add(listener);
    }

    attach() {
        let deviceEventHandler = (deviceEvent) => {
            for (let [key, value] of this.commandTriggers) {
                let commandParameters = key.check(deviceEvent);
                if(commandParameters !== undefined){
                    value.trigger(commandParameters);
                }
            }
        };

        for(let listener of this.deviceListeners) {
            listener.attach(deviceEventHandler);
        }
    }

    detach() {
        for(let listener of this.deviceListeners) {
            listener.detach();
        }
    }
}

export class CommandTrigger {
    check(deviceEvent) {
    }
}

export class Command {
    trigger(parameters) {        
    }
}

export class DeviceListener {
    attach(callback) {
    }

    detach(){        
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
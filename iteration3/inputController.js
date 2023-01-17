export class InputController {
    constructor() {
        this.commandTriggers = new Map();
    }

    onDeviceStateChange(deviceEvent) {
        for (let [key, value] of this.commandTriggers) {
            let commandParameters = key.check(deviceEvent);
            if(commandParameters !== undefined){
                value.trigger(commandParameters);
            }
        }
    }

    addTrigger(trigger, command) {
        this.commandTriggers.set(trigger, command);
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

export class DeviceController {
    constructor(inputController) {
        this.inputController = inputController;
    }
}

export class BrowserKeyboardController extends DeviceController { 
    constructor(inputController, htmlNode){
        super(inputController);
        this.subscribe(htmlNode);
    }

    subscribe(htmlNode) {
        htmlNode.addEventListener("keydown", (e)=> {
            this.inputController.onDeviceStateChange(new KeyboardKeydownEvent(e.key));
        });
        htmlNode.addEventListener("keyup", (e)=> {
            this.inputController.onDeviceStateChange(new KeyboardKeyupEvent(e.key));
        });
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
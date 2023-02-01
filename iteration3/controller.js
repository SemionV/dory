import * as messages from "./messages.js"

export class UpdateController {
    initialize(context) {
    }

    stop(context) {
    }

    update(timeStep, context) {
    }
}

export class InputController extends UpdateController {
    constructor(messagePool) {
        super();

        this.commandTriggers = new Map();
        this.messagePool = messagePool;
    }

    addTrigger(trigger, commands) {
        this.commandTriggers.set(trigger, commands);
    }

    update(timeStep, context) {
        context.messagePool.forEach((message) => {
            if(message instanceof messages.DeviceInputMessage) {
                let deviceEvent = message.deviceEvent;
                for (let [trigger, commands] of this.commandTriggers) {
                    let commandParameters = trigger.checkTrigger(deviceEvent, context);
                    if(commandParameters !== undefined){
                        let count = commands.length;
                        if(count) {
                            for(let i = 0; i < count; i++) {
                                commands[i].execute(commandParameters, context);
                            }
                        }
                        else {
                            commands.execute(commandParameters, context);
                        }
                    }
                }
            }
        });
    }
}
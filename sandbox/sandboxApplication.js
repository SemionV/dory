import UpdateController from "../iteration3/updateController.js"
import * as input from "../iteration3/inputSystem.js"

export class Message {
}

export class FpsUpdateMessage extends Message {
}

export class InputMessage extends Message {
}

export class MessagePoolController extends UpdateController {
    update(timeStep, context) {
        let messagePool = context.messagePool;
        //swap the buffers(if they are not empty)
        if(messagePool.backPool.length) {
            messagePool.frontPool = messagePool.backPool;
            messagePool.backPool = new Array(messagePool.poolSize);
        }
        else if(messagePool.frontPool.length) {
            messagePool.frontPool = new Array(messagePool.poolSize);
        }
    }
}

export class SceneRenderer extends UpdateController {
    update(timeStep, context) {
    }
}

export class FpsOutput extends UpdateController {
    constructor(htmlNode) {
        super();
        this.htmlNode = htmlNode;
    }

    update(timeStep, context) {
        context.messagePool.forEach((message) => {
            if(message instanceof FpsUpdateMessage) {
                this.htmlNode.innerText = context.fps;
                return true;
            }
        });
    }
}

export class FpsCounter extends UpdateController {
    constructor() {
        super();

        this.frameCount = 0;
        this.timePassedSinceFrameUpdate = 0;

        this.fpsUpdateMessage = new FpsUpdateMessage();
    }

    initialize(context) {
        context.fps = 0;
        context.messagePool.pushMessage(this.fpsUpdateMessage);
    }

    update(timeStep, context) {
        this.frameCount++;
        this.timePassedSinceFrameUpdate += timeStep;

        if (this.timePassedSinceFrameUpdate >= 1000) {
            context.fps = this.frameCount;
            this.frameCount = 0;
            this.timePassedSinceFrameUpdate = 0;

            context.messagePool.pushMessage(this.fpsUpdateMessage);
        }
    }
}

export class MoveCommandController extends UpdateController {
    constructor(htmlNode) {
        super();

        this.htmlNode = htmlNode;
    }

    initialize() {
        this.showDirection(MoveDirection.Stand);
    }

    update(timeStep, context) {
        context.messagePool.forEach(this.processMessage, this);
    }

    processMessage(message) {
        if(message instanceof MoveCommandMessage) {
            this.showDirection(message.moveDirection);
        }
    }

    showDirection(moveDirection) {
        let message;
            if(moveDirection == MoveDirection.East){
                message = "→";
            }
            if(moveDirection == MoveDirection.SouthEast){
                message = "↘";
            }
            else if(moveDirection == MoveDirection.South){
                message = "↓";
            }
            else if(moveDirection == MoveDirection.West){
                message = "←";
            }
            else if(moveDirection == MoveDirection.North){
                message = "↑";
            }
            if(moveDirection == MoveDirection.NorthEast){
                message = "↗";
            }
            if(moveDirection == MoveDirection.NortWest){
                message = "↖";
            }
            if(moveDirection == MoveDirection.SouthWest){
                message = "↙";
            }
            if(moveDirection == MoveDirection.Stand){
                message = "⚓";
            }

            this.htmlNode.innerText = "🧭:" + message;
    }
}

export class MoveDirection{
    static Stand = 0;
    static North = 1;
    static NortWest = 2;
    static NorthEast = 3;
    static East = 4;
    static SouthEast = 5;
    static South = 6;
    static SouthWest = 7;
    static West = 8;
}

export class MoveCommandMessage extends InputMessage {
    constructor(moveDirection) {
        super();
        this.moveDirection = moveDirection;
    }
}

export class MoveCommand extends input.Command {
    trigger(moveDirection, context) {    
        context.messagePool.pushMessage(new MoveCommandMessage(moveDirection));
    }
}

export class MoveCommandTrigger extends input.CommandTrigger {
    constructor() {
        super();
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
    }

    static arrowLeftKey = "ArrowLeft";
    static arrowRightKey = "ArrowRight";
    static arrowUpKey = "ArrowUp";
    static arrowDownKey = "ArrowDown";

    check(deviceEvent) {
        let moveDerectionCurrent = this.getMoveDirection();

        if(deviceEvent instanceof input.KeyboardKeydownEvent) {
            this.updateKeyState(deviceEvent.key, true);
        }
        else if(deviceEvent instanceof input.KeyboardKeyupEvent) {
            this.updateKeyState(deviceEvent.key, false);
        }

        let moveDirectionNew = this.getMoveDirection();
        if(moveDirectionNew != moveDerectionCurrent) {
            return moveDirectionNew;
        }
    }

    updateKeyState(key, state) {
        if(key == MoveCommandTrigger.arrowLeftKey) {
            this.left = state;
        }
        else if(key == MoveCommandTrigger.arrowRightKey) {
            this.right = state;
        }
        else if(key == MoveCommandTrigger.arrowUpKey) {
            this.up = state;
        }
        else if(key == MoveCommandTrigger.arrowDownKey) {
            this.down = state;
        }
    }

    getMoveDirection() {
        let moveDirection = MoveDirection.Stand;

        if (!this.left && !this.down && !this.right && this.up) {
            moveDirection = MoveDirection.North;
        }
        else if (this.left && !this.down && !this.right && !this.up) {
            moveDirection = MoveDirection.West;
        }
        else if (this.left && !this.down && !this.right && this.up) {
            moveDirection = MoveDirection.NortWest;
        }
        else if (this.left && this.down && !this.right && !this.up) {
            moveDirection = MoveDirection.SouthWest;
        }
        else if (!this.left && !this.down && this.right && this.up) {
            moveDirection = MoveDirection.NorthEast;
        }
        else if (!this.left && this.down && this.right && !this.up) {
            moveDirection = MoveDirection.SouthEast;
        }
        else if (!this.left && this.down && !this.right && !this.up) {
            moveDirection = MoveDirection.South;
        }
        else if (!this.left && !this.down && this.right && !this.tupp) {
            moveDirection = MoveDirection.East;
        }

        return moveDirection;
    }
}
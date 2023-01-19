import UpdateController from "../iteration3/updateController.js"
import * as input from "../iteration3/inputController.js"

export class SandboxApplication extends UpdateController{
    activeScene;

    constructor(sceneLoader) {
        super();
        this.sceneLoader = sceneLoader;
    }
}

export class Message {
}

export class FpsUpdateMessage extends Message {
    fps;
    constructor(fps) {
        super();
        this.fps = 0;
    }
}

export class InputMessage extends Message {
}

export class SceneLoader {
    loadScene() {
    }
}

export class SceneController extends UpdateController  {
    constructor(messagePoolController, inputController) {
        super();

        this.messagePoolController = messagePoolController;
        this.inputController = inputController;
    }

    start() {
        this.inputController.attach();
        super.start();
    }

    stop() {
        this.inputController.detach();
        super.start();
    }

    update(timeStep) {
        this.messagePoolController.swap();

        //message listeners(input, logic)
        //data updaters(physics, animation)
        //data output(render)
        
        super.update(timeStep);
    }
}

export class SceneRenderer extends UpdateController {
    update(timeStep) {
    }
}

export class FpsOutput extends UpdateController {
    constructor(messagePool, htmlNode) {
        super();

        this.htmlNode = htmlNode;
        this.messagePool = messagePool;
    }

    update(timeStep) {
        this.messagePool.forEach(this.processMessage, this);
    }

    processMessage(message) {
        if(message instanceof FpsUpdateMessage) {
            this.htmlNode.innerText = message.fps;
            return true;
        }
    }
}

export class FpsCounter extends UpdateController {
    constructor(messagePool) {
        super();

        this.frameCount = 0;
        this.timePassedSinceFrameUpdate = 0;
        this.messagePool = messagePool;

        this.fpsUpdateMessage = new FpsUpdateMessage();
    }

    start() {
        this.fpsUpdateMessage.fps = 0;
        this.messagePool.pushMessage(this.fpsUpdateMessage);
    }

    update(timeStep) {
        this.frameCount++;
        this.timePassedSinceFrameUpdate += timeStep;

        if (this.timePassedSinceFrameUpdate >= 1000) {
            this.fpsUpdateMessage.fps = this.frameCount;
            this.frameCount = 0;
            this.timePassedSinceFrameUpdate = 0;

            this.messagePool.pushMessage(this.fpsUpdateMessage);
        }
    }
}

export class MoveInputController extends UpdateController {
    constructor(messagePool, htmlNode) {
        super();

        this.messagePool = messagePool;
        this.htmlNode = htmlNode;
    }

    start() {
        this.showDirection(MoveDirection.Stand);
    }

    update(timeStep) {
        this.messagePool.forEach(this.processMessage, this);
    }

    processMessage(message) {
        if(message instanceof MoveInputMessage) {
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

export class MoveInputMessage extends InputMessage {
    constructor(moveDirection) {
        super();
        this.moveDirection = moveDirection;
    }
}

export class MoveCommand extends input.Command {
    constructor(messagePool) {
        super();
        this.messagePool = messagePool;
    }

    trigger(moveDirection) {    
        this.messagePool.pushMessage(new MoveInputMessage(moveDirection));
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
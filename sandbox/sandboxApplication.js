import Controller from "../iteration3/controller.js"
import {MessagePool, MessagePoolController} from "../iteration3/messagePool.js"
import * as input from "../iteration3/inputController.js"

export class SandboxApplication extends Controller{
    activeScene;

    constructor(messagePoolController, sceneLoader, messagePool) {
        super();

        this.scenes = new Map();
        this.sceneLoader = sceneLoader;
        this.messagePool = messagePool;
        this.messagePoolController = messagePoolController;
    }

    update(timeStep) {
        this.messagePoolController.update(timeStep);

        this.messagePool.forEach(this.processMessage, this);

        if(this.activeScene) {
            this.activeScene.update(timeStep);
        }
    }

    processMessage(message) {
        if(message instanceof BootstrapMessage) {
            //here comlicated asynchronous logic can be implemented, which is showing loading screen, showing loading progress, etc
            this.activeScene = this.sceneLoader.loadScene();
            return true;
        }
    }
}

export class Message {
}

export class BootstrapMessage extends Message {
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
        let renderer = new SceneRenderer();
        let messagePool = new MessagePool();
        let fpsCounter = new FpsCounter(messagePool);
        let fpsOutput = new FpsOutput(messagePool, document.getElementById("framesPerSecond"));
        let moveInputController = new MoveInputController(messagePool, document.getElementById("moveDirection"));
        let messagePoolController = new MessagePoolController(messagePool);

        let inputController = new input.InputController();
        let keyboardController = new input.BrowserKeyboardController(inputController, document.body);
        let moveTrigger = new MoveCommandTrigger();
        let moveCommand = new MoveCommand(messagePool);
        inputController.addTrigger(moveTrigger, moveCommand);

        messagePool.pushMessage(new FpsUpdateMessage(0));
        messagePool.pushMessage(new MoveInputMessage(MoveDirection.Stand));

        let scene = new Scene(renderer, messagePoolController, fpsCounter, fpsOutput, moveInputController);

        return scene;
    }
}

export class Scene extends Controller  {
    constructor(sceneRenderer, messagePoolController, fpsCounter, fpsOutput, moveInputController) {
        super();

        this.sceneRenderer = sceneRenderer;
        this.fpsOutput = fpsOutput;
        this.fpsCounter = fpsCounter;
        this.moveInputController = moveInputController;
        this.messagePoolController = messagePoolController;
    }

    update(timeStep) {
        this.messagePoolController.update(timeStep);
        this.fpsCounter.update(timeStep);
        this.sceneRenderer.update(timeStep);
        this.fpsOutput.update(timeStep);
        this.moveInputController.update(timeStep);
    }
}

export class SceneRenderer extends Controller {
    update(timeStep) {
    }
}

export class FpsOutput extends Controller {
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

export class FpsCounter extends Controller {
    constructor(messagePool) {
        super();

        this.frameCount = 0;
        this.timePassedSinceFrameUpdate = 0;
        this.messagePool = messagePool;

        this.fpsUpdateMessage = new FpsUpdateMessage();
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

export class MoveInputController extends Controller {
    constructor(messagePool, htmlNode) {
        super();

        this.messagePool = messagePool;
        this.htmlNode = htmlNode;
    }

    update(timeStep) {
        this.messagePool.forEach(this.processMessage, this);
    }

    processMessage(message) {
        if(message instanceof MoveInputMessage) {
            let direction;
            if(message.moveDirection == MoveDirection.East){
                direction = "→";
            }
            if(message.moveDirection == MoveDirection.SouthEast){
                direction = "↘";
            }
            else if(message.moveDirection == MoveDirection.South){
                direction = "↓";
            }
            else if(message.moveDirection == MoveDirection.West){
                direction = "←";
            }
            else if(message.moveDirection == MoveDirection.North){
                direction = "↑";
            }
            if(message.moveDirection == MoveDirection.NorthEast){
                direction = "↗";
            }
            if(message.moveDirection == MoveDirection.NortWest){
                direction = "↖";
            }
            if(message.moveDirection == MoveDirection.SouthWest){
                direction = "↙";
            }
            if(message.moveDirection == MoveDirection.Stand){
                direction = "⚓";
            }


            this.htmlNode.innerText = "🧭:" + direction;
        }
    }
}

class MoveDirection{
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

class MoveCommand extends input.Command {
    constructor(messagePool) {
        super();
        this.messagePool = messagePool;
    }

    trigger(moveDirection) {    
        this.messagePool.pushMessage(new MoveInputMessage(moveDirection));
    }
}

class MoveCommandTrigger extends input.CommandTrigger {
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
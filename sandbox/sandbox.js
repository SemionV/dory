import UpdateController from "../iteration3/updateController.js"
import * as input from "../iteration3/inputSystem.js"
import * as transformations from "../iteration3/transformation.js"
import * as math from "../iteration3/math.js"
import * as primitives from "../iteration3/primitives.js"

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
    constructor(camera, speed) {
        super();
        this.camera = camera;
        this.speed = speed;
    }

    initialize(context) {
        this.setVelocity(context, MoveDirection.Stand);
    }

    update(timeStep, context) {
        context.messagePool.forEach((message) => {
            if(message instanceof MoveCommandMessage) {
                this.setVelocity(context, message.moveDirection);
            }
        });
    }

    setVelocity(context, moveDirection) {
        let camera = this.camera;
        let velocity = new primitives.Point3D();


        if(camera) {
            let cameraDirection = camera.direction;

            if(moveDirection == MoveDirection.East){
                cameraDirection.rotateUnit(270, velocity);
            }
            if(moveDirection == MoveDirection.SouthEast){
                cameraDirection.rotateUnit(225, velocity);
            }
            else if(moveDirection == MoveDirection.South){
                cameraDirection.rotateUnit(180, velocity);
            }
            else if(moveDirection == MoveDirection.West){
                cameraDirection.rotateUnit(90, velocity);
            }
            else if(moveDirection == MoveDirection.North){
                velocity.x = cameraDirection.x;
                velocity.y = cameraDirection.y;
            }
            if(moveDirection == MoveDirection.NorthEast){
                cameraDirection.rotateUnit(315, velocity);
            }
            if(moveDirection == MoveDirection.NortWest){
                cameraDirection.rotateUnit(45, velocity);
            }
            if(moveDirection == MoveDirection.SouthWest){
                cameraDirection.rotateUnit(135, velocity);
            }
            if(moveDirection == MoveDirection.Stand){
                velocity.x = 0;
                velocity.y = 0;
            }

            velocity.x = velocity.x * this.speed;
            velocity.y = velocity.y * this.speed;

            camera.velocity = velocity;
        }
    }
}

export class MoveCommandOutput extends UpdateController {
    constructor(htmlNode) {
        super();
        this.htmlNode = htmlNode;
    }

    initialize(context) {
        this.showDirection(MoveDirection.Stand);
    }

    update(timeStep, context) {
        context.messagePool.forEach((message) => {
            if(message instanceof MoveCommandMessage) {
                this.showDirection(message.moveDirection);
            }
        });
    }

    showDirection(moveDirection) {
        let messageTip;

        if(moveDirection == MoveDirection.East){
            messageTip = "→";
        }
        if(moveDirection == MoveDirection.SouthEast){
            messageTip = "↘";
        }
        else if(moveDirection == MoveDirection.South){
            messageTip = "↓";
        }
        else if(moveDirection == MoveDirection.West){
            messageTip = "←";
        }
        else if(moveDirection == MoveDirection.North){
            messageTip = "↑";
        }
        if(moveDirection == MoveDirection.NorthEast){
            messageTip = "↗";
        }
        if(moveDirection == MoveDirection.NortWest){
            messageTip = "↖";
        }
        if(moveDirection == MoveDirection.SouthWest){
            messageTip = "↙";
        }
        if(moveDirection == MoveDirection.Stand){
            messageTip = "⚓";
        }

        if(this.htmlNode) {
            this.htmlNode.innerText = "🧭:" + messageTip;
        }
    }
}

export class CameraController extends UpdateController {
    constructor(camera) {
        super();
        this.camera = camera;
    }

    update(timeStep, context) {
        let camera = this.camera;
        let velocity;

        if(camera) {
            velocity = camera.velocity;

            if(velocity && (velocity.x || velocity.y || velocity.z)) {
                let timeStepSeconds = timeStep / 1000;

                let dx = velocity.x * timeStepSeconds;
                let dy = velocity.y * timeStepSeconds;
                let dz = velocity.z * timeStepSeconds;
    
                if(camera.transformation.matrix) {
                    camera.transformation.matrix.addTranslation(dx, dy, dz);
                }
                else {
                    let matrix = math.Matrix3D.translate(dx, dy, dz);
                    camera.transformation = new transformations.MatrixTransformation(matrix)
                }
            }
        }
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
    static aKey = "a";
    static arrowRightKey = "ArrowRight";
    static dKey = "d";
    static arrowUpKey = "ArrowUp";
    static wKey = "w";
    static arrowDownKey = "ArrowDown";
    static sKey = "s";

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
        if(key == MoveCommandTrigger.arrowLeftKey || key == MoveCommandTrigger.aKey) {
            this.left = state;
        }
        else if(key == MoveCommandTrigger.arrowRightKey || key == MoveCommandTrigger.dKey) {
            this.right = state;
        }
        else if(key == MoveCommandTrigger.arrowUpKey || key == MoveCommandTrigger.wKey) {
            this.up = state;
        }
        else if(key == MoveCommandTrigger.arrowDownKey || key == MoveCommandTrigger.sKey) {
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

export class InputSystem extends input.InputSystem{
    constructor() {
        super();

        let keyboardController = new input.BrowserKeyboardListener(document.body);
        this.addDeviceListener(keyboardController);
        this.addTrigger(new MoveCommandTrigger(), new MoveCommand());
    }
}
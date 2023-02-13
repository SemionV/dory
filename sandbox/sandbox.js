import * as controllers from "../iteration3/controller.js"
import * as input from "../iteration3/inputSystem.js"
import * as transformations from "../iteration3/transformation.js"
import * as math from "../iteration3/math.js"
import * as primitives from "../iteration3/primitives.js"
import * as messages from "../iteration3/messages.js"

export class FpsUpdateMessage extends messages.Message {
}

export class CameraUpdateMessage extends messages.Message {
}

export class MessagePoolSwapController extends controllers.UpdateController {
    constructor(messagePools) {
        super();
        this.messagePools = messagePools;
    }

    update(timeStep, context) {
        let count = this.messagePools.length;
        
        if(count) {
            for(let i = 0; i < count; ++i) {
                this.swapBuffers(this.messagePools[i]);
            }
        }
        else {
            this.swapBuffers(this.messagePools);
        }
    }

    swapBuffers(messagePool) {
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

export class FpsOutput extends controllers.UpdateController {
    constructor(messagePool, htmlNode) {
        super();
        this.htmlNode = htmlNode;
        this.messagePool = messagePool;
    }

    update(timeStep, context) {
        this.messagePool.forEach((message) => {
            if(message instanceof FpsUpdateMessage) {
                this.htmlNode.innerText = context.fps;
                return true;
            }
        });
    }
}

export class FpsCounter extends controllers.UpdateController {
    constructor(messagePool) {
        super();

        this.messagePool = messagePool;

        this.frameCount = 0;
        this.timePassedSinceFrameUpdate = 0;

        this.fpsUpdateMessage = new FpsUpdateMessage();
    }

    initialize(context) {
        context.fps = 0;
        this.messagePool.pushMessage(this.fpsUpdateMessage);
    }

    update(timeStep, context) {
        this.frameCount++;
        this.timePassedSinceFrameUpdate += timeStep;

        if (this.timePassedSinceFrameUpdate >= 1000) {
            context.fps = this.frameCount;
            this.frameCount = 0;
            this.timePassedSinceFrameUpdate = 0;

            this.messagePool.pushMessage(this.fpsUpdateMessage);
        }
    }
}

export class CameraController extends controllers.UpdateController {
    constructor(camera, messagePool) {
        super();
        this.camera = camera;
        this.messagePool = messagePool;
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

                if(this.messagePool) {
                    this.messagePool.pushMessage(new CameraUpdateMessage());
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

export class MoveCameraCommand extends input.Command {
    constructor(camera, speed) {
        super();
        this.camera = camera;
        this.speed = speed;
    }

    execute(moveDirection, context) {    
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

export class MoveCommandTrigger extends input.CommandTrigger {
    checkTrigger(deviceEvent, context) {
        if(deviceEvent instanceof input.KeyboardKeydownEvent || deviceEvent instanceof input.KeyboardKeyupEvent) {
            return this.getMoveDirection(deviceEvent.keyboardState);
        }
    }

    getMoveDirection(keyboarState) {
        let moveDirection = MoveDirection.Stand;

        let left = keyboarState[input.KeyboardKeys.arrowLeft] || keyboarState[input.KeyboardKeys.a];
        let right = keyboarState[input.KeyboardKeys.arrowRight] || keyboarState[input.KeyboardKeys.d];
        let up = keyboarState[input.KeyboardKeys.arrowUp] || keyboarState[input.KeyboardKeys.w];
        let down = keyboarState[input.KeyboardKeys.arrowDown] || keyboarState[input.KeyboardKeys.s];

        if (!left && !down && !right && up) {
            moveDirection = MoveDirection.North;
        }
        else if (left && !down && !right && !up) {
            moveDirection = MoveDirection.West;
        }
        else if (left && !down && !right && up) {
            moveDirection = MoveDirection.NortWest;
        }
        else if (left && down && !right && !up) {
            moveDirection = MoveDirection.SouthWest;
        }
        else if (!left && !down && right && up) {
            moveDirection = MoveDirection.NorthEast;
        }
        else if (!left && down && right && !up) {
            moveDirection = MoveDirection.SouthEast;
        }
        else if (!left && down && !right && !up) {
            moveDirection = MoveDirection.South;
        }
        else if (!left && !down && right && !up) {
            moveDirection = MoveDirection.East;
        }

        return moveDirection;
    }
}

export class InputSystem extends input.InputSystem{
    constructor(messagePool) {
        super(messagePool);

        let keyboardController = new input.BrowserKeyboardListener(document.body);
        this.addDeviceListener(keyboardController);
    }
}

export class DebugOutput extends controllers.UpdateController {
    constructor(mainMessagePool, debugMessagePool, htmlNode) {
        super();

        this.htmlNode = htmlNode;
        this.debugMessagePool = debugMessagePool;
        this.mainMessagePool = mainMessagePool;
    }

    update(timeStep, context) {
        let cameraUpdated;
        this.mainMessagePool.forEach((message) => {
            if(message instanceof CameraUpdateMessage) {
                cameraUpdated = true;
                return true;
            }
        });

        if(cameraUpdated || !this.htmlNode.childNodes.length) {
            let html = "";
            this.debugMessagePool.forEach((message) => {
                if(message instanceof messages.DebugMessage) {
                    let messageNode = `<div><span>${message.message}</span></div>`;
                    html += messageNode;
                }
            });

            if(html.length) {
                this.htmlNode.innerHTML = html;
            }
        }
    }
}
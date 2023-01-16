import Controller from "../iteration3/controller.js"
import MessagePool from "../iteration3/messagePool.js"

export class SandboxApplication extends Controller{
    activeScene;

    constructor(sceneLoader, messagePool) {
        super();

        this.scenes = new Map();
        this.sceneLoader = sceneLoader;
        this.messagePool = messagePool;
    }

    update(timeStep) {
        this.messagePool.update(timeStep);

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
}

export class SceneLoader {
    loadScene() {
        let renderer = new SceneRenderer();
        let messagePool = new MessagePool();
        let fpsCounter = new FpsCounter(messagePool);
        let fpsOutput = new FpsOutput(messagePool, document.getElementById("framesPerSecond"));

        let scene = new Scene(renderer, messagePool, fpsCounter, fpsOutput);

        return scene;
    }
}

export class Scene extends Controller  {
    constructor(sceneRenderer, messagePool, fpsCounter, fpsOutput) {
        super();

        this.sceneRenderer = sceneRenderer;
        this.messagePool = messagePool;
        this.fpsOutput = fpsOutput;
        this.fpsCounter = fpsCounter;
    }

    update(timeStep) {
        this.messagePool.update(timeStep);
        this.fpsCounter.update(timeStep);
        this.sceneRenderer.update(timeStep);
        this.fpsOutput.update(timeStep);
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
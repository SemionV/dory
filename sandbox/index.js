import * as sandbox from "./sandboxApplication.js"
import Engine from "../iteration3/engine.js"
import {MessagePool, MessagePoolController} from "../iteration3/messagePool.js"
import * as input from "../iteration3/inputController.js"

let sceneLoader = new sandbox.SceneLoader();
let application = new sandbox.SandboxApplication(sceneLoader);

//build scene controller
{
    let renderer = new sandbox.SceneRenderer();
    let messagePool = new MessagePool();
    let fpsCounter = new sandbox.FpsCounter(messagePool);
    let fpsOutput = new sandbox.FpsOutput(messagePool, document.getElementById("framesPerSecond"));
    let moveController = new sandbox.MoveInputController(messagePool, document.getElementById("moveDirection"));

    let messagePoolController = new MessagePoolController(messagePool);

    let inputController = new input.InputController();
    let keyboardController = new input.BrowserKeyboardListener(document.body);
    inputController.addDeviceListener(keyboardController);
    let moveTrigger = new sandbox.MoveCommandTrigger();
    let moveCommand = new sandbox.MoveCommand(messagePool);
    inputController.addTrigger(moveTrigger, moveCommand);

    let sceneController = new sandbox.SceneController(messagePoolController, inputController);
    sceneController.addChildController(moveController);
    sceneController.addChildController(fpsCounter);
    sceneController.addChildController(renderer);
    sceneController.addChildController(fpsOutput);

    application.addChildController(sceneController);
}

application.start();

let engine = new Engine(application);
engine.run();
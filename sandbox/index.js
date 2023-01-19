import * as sandbox from "./sandboxApplication.js"
import Engine from "../iteration3/engine.js"
import MessagePool from "../iteration3/messagePool.js"
import * as input from "../iteration3/inputSystem.js"

let applicationData = {
    messagePool: new MessagePool()
}

let inputSystem = new input.InputSystem();
let keyboardController = new input.BrowserKeyboardListener(document.body);
inputSystem.addDeviceListener(keyboardController);
inputSystem.addTrigger(new sandbox.MoveCommandTrigger(), new sandbox.MoveCommand());

let engine = new Engine(inputSystem);

engine.addController(new sandbox.MessagePoolController());
engine.addController(new sandbox.MoveCommandController(document.getElementById("moveDirection")));
engine.addController(new sandbox.FpsCounter());
engine.addController(new sandbox.SceneRenderer());
engine.addController(new sandbox.FpsOutput(document.getElementById("framesPerSecond")));

engine.run(applicationData);
import * as sandbox from "./sandbox.js"
import * as scene from "./scene.js"
import Engine from "../iteration3/engine.js"
import MessagePool from "../iteration3/messagePool.js"
import * as input from "../iteration3/inputSystem.js"
import ComponentStorage from "../iteration3/componentStorage/componentStorage.js"

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let scene = {
    messagePool: new MessagePool(),
    viewport: {
        width: canvas.width,
        height: canvas.height
    },
    points: new ComponentStorage(5, scene.pointSchema),
    dataLayer: {
        transformation: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        children:[
            {
                transformation: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
                sprites: [1, 2, 3, 4, 5],
                meshes: [2, 3, 4, 6, 7]
            }
        ]
    }
}

scene.points.saveComponent({x: 0, y: 0, z: 0});

let inputSystem = new input.InputSystem();
let keyboardController = new input.BrowserKeyboardListener(document.body);
inputSystem.addDeviceListener(keyboardController);
inputSystem.addTrigger(new sandbox.MoveCommandTrigger(), new sandbox.MoveCommand());

let engine = new Engine(inputSystem);

engine.addController(new sandbox.MessagePoolController());
engine.addController(new sandbox.MoveCommandController(document.getElementById("moveDirection")));
engine.addController(new sandbox.FpsCounter());
engine.addController(new sandbox.CanvasSceneRenderer(canvasContext));
engine.addController(new sandbox.FpsOutput(document.getElementById("framesPerSecond")));

engine.run(scene);
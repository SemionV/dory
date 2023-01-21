import * as sandbox from "./sandbox.js"
import * as scene from "./scene.js"
import Engine from "../iteration3/engine.js"
import MessagePool from "../iteration3/messagePool.js"
import * as input from "../iteration3/inputSystem.js"
import * as transformations from "../iteration3/transformation.js"
import * as math from "../iteration3/math.js"
import ComponentStorage from "../iteration3/componentStorage/componentStorage.js"
import * as renderingSystem from "../iteration3/rendering/renderyngSystem.js"
import CanvasSceneRenderer from "../iteration3/rendering/canvas2d/sceneRenderer.js"

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let pointsStorage = new ComponentStorage(4, scene.pointSchema);
pointsStorage.saveComponent({x: -50, y: -50, z: 0});
pointsStorage.saveComponent({x: 50, y: -50, z: 0});
pointsStorage.saveComponent({x: 50, y: 50, z: 0});
pointsStorage.saveComponent({x: -50, y: 50, z: 0});

let transformationsStorage = new Map();

let sceneContext = {
    messagePool: new MessagePool(),
    viewport: {
        width: canvas.width,
        height: canvas.height
    },
    points: pointsStorage,
    transformations: transformationsStorage,
    cameraTransformation: new transformations.IdentityTransformation()
}

let view = {
    viewport: new renderingSystem.Viewport(canvas.width, canvas.height , 0, 0),
    projectionTransformation: new transformations.IsometricProjection()//matrix form: [1, -1, 0, 0,  0.5, 0.5, 1, 0,  0, 0, 0, 0,  0, 0, 0, 0]
}

let inputSystem = new input.InputSystem();
let keyboardController = new input.BrowserKeyboardListener(document.body);
inputSystem.addDeviceListener(keyboardController);
inputSystem.addTrigger(new sandbox.MoveCommandTrigger(), new sandbox.MoveCommand());

let engine = new Engine(inputSystem);

engine.addController(new sandbox.MessagePoolController());

engine.addController(new sandbox.MoveCommandController(document.getElementById("moveDirection")));
engine.addController(new sandbox.FpsCounter());

engine.addController(new CanvasSceneRenderer(canvasContext, view));
engine.addController(new sandbox.FpsOutput(document.getElementById("framesPerSecond")));

engine.run(sceneContext);
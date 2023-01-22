import * as sandbox from "./sandbox.js"
import * as scene from "./scene.js"
import Engine from "../iteration3/engine.js"
import MessagePool from "../iteration3/messagePool.js"
import * as input from "../iteration3/inputSystem.js"
import * as transformations from "../iteration3/transformation.js"
import * as primitives from "../iteration3/primitives.js"
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
let camerasStorage = new Map();

let mainCameraId = 1;
camerasStorage.set(mainCameraId, {
    transformation: new transformations.MatrixTransformation(new math.Matrix3D()),
    velocity: new primitives.Point3D(),
    direction: new primitives.Point2D(0, 1).rotate45Degrees(),
    projection: new transformations.IsometricProjection()//matrix form: [1, -1, 0, 0,  0.5, 0.5, 1, 0,  0, 0, 0, 0,  0, 0, 0, 0]
});

let sceneContext = {
    messagePool: new MessagePool(),
    viewport: {
        width: canvas.width,
        height: canvas.height
    },
    points: pointsStorage,
    transformations: transformationsStorage,
    cameras: camerasStorage
}

let viewportWidth = canvas.width;
let viewportHeight = canvas.height;
let viewportX = 0;
let viewportY = 0;
let viewportTransformation = new transformations.MatrixTransformation(new math.Matrix3D(1, 0, 0, 0,  0, -1, 0, 0,  0, 0, 1, 0,  viewportWidth / 2 + viewportX, viewportHeight / 2 + viewportY, 0, 1))
let viewport = new renderingSystem.Viewport(viewportWidth, viewportHeight, viewportX, viewportY, viewportTransformation);

let view = new renderingSystem.View(viewport, mainCameraId);

let inputSystem = new input.InputSystem();
let keyboardController = new input.BrowserKeyboardListener(document.body);
inputSystem.addDeviceListener(keyboardController);
inputSystem.addTrigger(new sandbox.MoveCommandTrigger(), new sandbox.MoveCommand());

let engine = new Engine(inputSystem);

engine.addController(new sandbox.MessagePoolController());

engine.addController(new sandbox.MoveCommandController(mainCameraId, document.getElementById("moveDirection")));
engine.addController(new sandbox.CameraController(mainCameraId));
engine.addController(new sandbox.FpsCounter());

engine.addController(new CanvasSceneRenderer(canvasContext, view));
engine.addController(new sandbox.FpsOutput(document.getElementById("framesPerSecond")));

engine.run(sceneContext);
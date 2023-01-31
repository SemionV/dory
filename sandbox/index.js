import * as sandbox from "./sandbox.js"
import * as scene from "./scene.js"
import Engine from "../iteration3/engine.js"
import MessagePool from "../iteration3/messagePool.js"
import * as transformations from "../iteration3/transformation.js"
import * as primitives from "../iteration3/primitives.js"
import * as math from "../iteration3/math.js"
import * as renderingSystem from "../iteration3/rendering/renderyngSystem.js"
import * as canvasRendering from "../iteration3/rendering/canvas2d/sceneRenderer.js"

let cameraMovementSpeed = 50;//pixels per second

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let canvasTop = document.getElementById('canvasTopProjection');
let canvasContextTop = canvasTop.getContext('2d');

let isoViewCamera = new renderingSystem.Camera(1, 
    new transformations.MatrixTransformation(),
    new transformations.IsometricProjection(),
    new primitives.Point3D(),
    new primitives.Point2D(1, 0).rotateUnit(45));

let zRotation = new transformations.MatrixTransformation(math.Matrix3D.rotateZ(math.Angle.toRadian(-45)));
let xRotation = new transformations.MatrixTransformation(math.Matrix3D.rotateX(math.Angle.toRadian(60)));
let topProjection = new transformations.CombinedTransformation(zRotation, xRotation);

let topViewCamera = new renderingSystem.Camera(2, 
    new transformations.MatrixTransformation(),
    /*new transformations.IdentityTransformation()*/
    topProjection,
    new primitives.Point3D(),
    new primitives.Point2D(0, 1));

let isoView = new canvasRendering.CanvasView(canvas, isoViewCamera);
let topView = new canvasRendering.CanvasView(canvasTop, topViewCamera);

let worldLayer = new scene.Layer(new transformations.IdentityTransformation);
worldLayer.addPoint({x: -50, y: -50, z: 0, r: 255, g: 0, b: 0});
worldLayer.addPoint({x: 50, y: -50, z: 0, r: 0, g: 150, b: 0});
worldLayer.addPoint({x: 50, y: 50, z: 0, r: 0, g: 0, b: 255});
worldLayer.addPoint({x: -50, y: 50, z: 0, r: 150, g: 150, b: 0});


let sceneContext = {
    messagePool: new MessagePool(),
    worldLayer: worldLayer
}

let inputSystem = new sandbox.InputSystem();

let engine = new Engine(inputSystem);

engine.addController(new sandbox.MessagePoolController());

engine.addController(new sandbox.FpsCounter());

engine.addController(new sandbox.MoveCommandController(isoViewCamera, cameraMovementSpeed));
engine.addController(new sandbox.CameraController(isoViewCamera));

engine.addController(new sandbox.MoveCommandController(topViewCamera, cameraMovementSpeed));
engine.addController(new sandbox.CameraController(topViewCamera));

engine.addController(new canvasRendering.CanvasSceneRenderer(canvasContext, isoView));
engine.addController(new canvasRendering.CanvasSceneRenderer(canvasContextTop, topView));

engine.addController(new sandbox.FpsOutput(document.getElementById("framesPerSecond")));
engine.addController(new sandbox.MoveCommandOutput(document.getElementById("moveDirection")));

engine.run(sceneContext);
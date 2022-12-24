import * as primitives from "../js2/primitives.js";
import * as canvas2dRenderSystem from "../js2/render/2d/canvas2dRenderSystem.js"
import * as graphicalPrimitives from "../js2/render/graphicalPrimitive.js"
import * as renderingSystem from "../js2/render/renderingSystem.js"

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');
let viewport = new renderingSystem.Viewport(canvas.width, canvas.height);

let renderer = new canvas2dRenderSystem.Canvas2dRenderingSystem(viewport, canvasContext);

let clearCanvasModifier = new canvas2dRenderSystem.ClearViewportModifier();
renderer.addModifier(clearCanvasModifier);

let centerModifier = new canvas2dRenderSystem.MoveOriginToCenterModifier();
renderer.addModifier(centerModifier);

let projectionMatrix = new primitives.Matrix3D(1, 0, 0, 0,
                                               0, -1, 0, 0,
                                               0, 0, 1, 0,
                                               0, 0, 0, 1);
renderer.pushTransformation(new primitives.MatrixTransformation(projectionMatrix));

let scale = 100;
var matrixR = primitives.Matrix3D.rotateZ(primitives.Angle.toRadian(90));

let x1 = (matrixR[0] * scale);
let y1 = (matrixR[4] * scale);
let x2 = (matrixR[1] * scale);
let y2 = (matrixR[5] * scale);

renderer.addPoint(new graphicalPrimitives.Point(new primitives.Point2D(x1, y1), new primitives.Color(255, 0, 0)));
renderer.addPoint(new graphicalPrimitives.Point(new primitives.Point2D(0, 0), new primitives.Color(0, 0, 0)));
renderer.addPoint(new graphicalPrimitives.Point(new primitives.Point2D(x2, y2), new primitives.Color(0, 255, 0)));

let point = new primitives.Point2D(30, 20);
let tPoint = matrixR.transform(point);
renderer.addPoint(new graphicalPrimitives.Point(point, new primitives.Color(0, 0, 255)));
renderer.addPoint(new graphicalPrimitives.Point(tPoint, new primitives.Color(0, 0, 255)));

renderer.render();

/////////////////////////////////////////

import * as doryEngine from "../js2/engine.js"
import * as scene from "../js2/scene.js"

let engine = new doryEngine.Engine(new doryEngine.EngineConfig(60, false));
window.engine = engine;

let sceneManager = new scene.SceneManager();

//setup scene
{
    //setup camera
    {
        
    }

    //setup visible objects
    {

    }
}

sceneManager.addEventHandler(doryEngine.FpsUpdatedEvent, (e)=>{
    document.getElementById('FPS').innerText = e.fps;
});

engine.setActiveScene(sceneManager);
engine.run();

window.primitives = primitives;

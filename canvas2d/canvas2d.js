import * as primitives from "../js2/primitives.js";
import * as canvas2dRenderSystem from "../js2/render/2d/canvas2dRenderSystem.js"
import * as graphicalPrimitives from "../js2/render/graphicalPrimitive.js"
import * as renderingSystem from "../js2/render/renderingSystem.js"

import * as bitecs from "../js2/bitecs/index.js"

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');
let viewport = new renderingSystem.Viewport(canvas.width, canvas.height);
let renderingContext = new canvas2dRenderSystem.Canvas2dRenderingContext(viewport, canvasContext);
let renderer = new canvas2dRenderSystem.Canvas2dRenderingSystem();

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

renderer.render(renderingContext);

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


const Point2 = { x: bitecs.Types.f32, y: bitecs.Types.f32};

const Position = bitecs.defineComponent(Point2);

let world  = bitecs.createWorld();

let entity = bitecs.addEntity(world);
let entity2 = bitecs.addEntity(world);

bitecs.addComponent(world, Position, entity);
bitecs.addComponent(world, Position, entity2);

Position.x[entity] = 2;
Position.y[entity] = 3;

Position.x[entity2] = 5;
Position.y[entity2] = 1;

const positionQuery = bitecs.defineQuery([Position]);

var entities = positionQuery(world);

for (let i = 0; i < entities.length; i++) {
    const entityId = entities[i];
    console.log(`${entityId}.x: ${Position.x[entityId]}`);
    console.log(`${entityId}.y: ${Position.y[entityId]}`);
}
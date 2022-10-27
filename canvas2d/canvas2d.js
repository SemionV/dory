import * as primitives from "../js2/primitives.js";
import * as canvas2dRenderSystem from "../js2/render/2d/canvas2dRenderSystem.js"
import * as graphicalPrimitives from "../js2/render/graphicalPrimitive.js"
import * as renderingSystem from "../js2/render/renderingSystem.js"

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let renderItemFactory = new canvas2dRenderSystem.Canvas2dRenderingItemFactory();
let viewport = new renderingSystem.Viewport(canvas.width, canvas.height);
let renderContext = new canvas2dRenderSystem.Canvas2dRenderingContext(viewport, canvasContext);
let renderer = new canvas2dRenderSystem.Canvas2dRenderingSystem(renderItemFactory, renderContext);

let centerModifier = new canvas2dRenderSystem.MoveOriginToCenterModifier();
renderer.addModifier(centerModifier);

var translation = new primitives.Translation(50, 50);
renderer.pushTransformation(translation);

var matrix = new primitives.Matrix3D();
primitives.Matrix3D.rotateZ(45, matrix);
renderer.pushTransformation(new primitives.MatrixTransformation(matrix));

renderer.addPrimitive(new graphicalPrimitives.Point(new primitives.Point2D(-20, 0)));
renderer.addPrimitive(new graphicalPrimitives.Point(new primitives.Point2D(0, 0)));
renderer.addPrimitive(new graphicalPrimitives.Point(new primitives.Point2D(20, 0)));

renderer.popTransformation();
renderer.popTransformation();

renderer.render();
import * as primitives from "../js2/primitives.js";
import * as canvas2dRenderSystem from "../js2/render/2d/canvas2dRenderSystem.js"
import * as graphicalPrimitives from "../js2/render/graphicalPrimitive.js"

let canvas = document.getElementById('canvas');
let canvasContext = canvas.getContext('2d');

let renderItemFactory = new canvas2dRenderSystem.Canvas2dRenderingItemFactory();
let renderContext = new canvas2dRenderSystem.Canvas2dRenderingContext(canvasContext);
let renderer = new canvas2dRenderSystem.Canvas2dRenderingSystem(renderItemFactory, renderContext);

var translation = new primitives.Translation(300, 300);
renderer.pushTransformation(translation);

var translation = new primitives.Translation(0, -300);
renderer.pushTransformation(translation);

renderer.addPrimitive(new graphicalPrimitives.Point(new primitives.Point2D(50, 50)));
renderer.addPrimitive(new graphicalPrimitives.Point(new primitives.Point2D(60, 50)));
renderer.addPrimitive(new graphicalPrimitives.Point(new primitives.Point2D(70, 50)));

renderer.popTransformation();
renderer.popTransformation();

renderer.render();
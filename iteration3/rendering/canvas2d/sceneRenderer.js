import * as drawers from "./drawers.js"
import * as renderingSystem from "../renderyngSystem.js"
import * as graphicalPrimitives from "../graphicalPrimitive.js"
import UpdateController from "../../updateController.js"
import * as primitives from "../../primitives.js"
import * as transformations from "../../transformation.js"
import * as math from "../../math.js"

export class CanvasSceneRenderer extends UpdateController {
    constructor(canvas, view) {        
        super();

        this.canvas = canvas;
        this.view = view;

        this.renderingContext = new Canvas2dRenderingContext(this.view.viewport, this.canvas);

        this.pointDrawer = new drawers.PointDrawer();
    }

    update(timeStep, context) {
        let viewport = this.view.viewport;
        let camera = this.view.camera;
        let cameraTransformation;
        let viewportTransformation = viewport.transformation;

        if(camera) {
            cameraTransformation = camera.getTransformation();
        }

        if(viewportTransformation) {
            this.renderingContext.stackTransformation(viewportTransformation);
        }

        if(cameraTransformation) {
            this.renderingContext.stackTransformation(cameraTransformation);
        }

        this.canvas.clearRect(viewport.x, viewport.y , viewport.width, viewport.height);

        if(context.worldLayer) {
            this.drawLayer(context.worldLayer);
        }

        if(cameraTransformation) {
            this.renderingContext.unstackTransformation();
        }

        if(viewportTransformation) {
            this.renderingContext.unstackTransformation();
        }
    }

    drawLayer(layer) {
        if(layer.transformation) {
            this.renderingContext.stackTransformation(layer.transformation);
        }

        let renderingPrimitive = new graphicalPrimitives.Point(new primitives.Point3D(), new primitives.Color());

        let pointsCount = layer.points.length;
        for(let i = 0; i < pointsCount; ++i) {
            let point = layer.points[i];

            renderingPrimitive.position.x = point.x;
            renderingPrimitive.position.y = point.y;
            renderingPrimitive.position.z = point.z;

            renderingPrimitive.color.r = point.r;
            renderingPrimitive.color.g = point.g;
            renderingPrimitive.color.b = point.b;

            this.pointDrawer.draw(this.renderingContext, renderingPrimitive);
        }

        let childLayers = layer.childLayers;
        let childrenCount = childLayers.length;
        for(let i = 0; i < childrenCount; ++i) {
            this.drawLayer(childLayers[i]);
        }

        if(layer.transformation) {
            this.renderingContext.unstackTransformation();
        }
    }
}

class Canvas2dRenderingContext extends renderingSystem.RenderingContext {
    constructor(viewport, canvasContext) {
        super(viewport);
        this.canvas = canvasContext;
        this.transformationStack = new Array();
    }

    stackTransformation(transformation) {
        let parentTransformation = this.currentTransformation;

        let combinedTransformation = transformation;
        if(parentTransformation) {
            combinedTransformation = parentTransformation.combine(transformation);
        }

        this.transformationStack.push(combinedTransformation);
    }

    unstackTransformation() {
        if(this.transformationStack.length > 0) {
            this.transformationStack.pop();
        }
    }

    get currentTransformation() {
        let currentTransformation = null;
        if(this.transformationStack.length > 0) {
            currentTransformation = this.transformationStack[this.transformationStack.length - 1]
        }

        return currentTransformation;
    }
}

export class CanvasView extends renderingSystem.View {
    constructor(canvasNode, camera) {
        let viewportWidth = canvasNode.width;
        let viewportHeight = canvasNode.height;
        let viewportX = 0;
        let viewportY = 0;
        let deviceTransformation = new transformations.MatrixTransformation(new math.Matrix3D(1, 0, 0, 0,  0, -1, 0, 0,  0, 0, 1, 0,  viewportWidth / 2 + viewportX, viewportHeight / 2 + viewportY, 0, 1))
        let viewport = new renderingSystem.Viewport(viewportWidth, viewportHeight, viewportX, viewportY, deviceTransformation);

        super(viewport, camera);
    }
}
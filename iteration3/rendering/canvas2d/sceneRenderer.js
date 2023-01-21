import * as drawers from "./drawers.js"
import * as renderingSystem from "../renderyngSystem.js"
import * as graphicalPrimitives from "../graphicalPrimitive.js"
import UpdateController from "../../updateController.js"
import * as primitives from "../../primitives.js"
import * as transformations from "../../transformation.js"
import * as math from "../../math.js"

export default class CanvasSceneRenderer extends UpdateController {
    constructor(canvas, view) {        
        super();

        this.canvas = canvas;
        this.view = view;

        this.renderingContext = new Canvas2dRenderingContext(this.view.viewport, this.canvas);

        this.pointDrawer = new drawers.PointDrawer();

        let viewportHalfWidth = view.viewport.width / 2;
        let viewportHalfHeight = view.viewport.height / 2;
        this.viewportTransformation = new transformations.MatrixTransformation(new math.Matrix3D(1, 0, 0, 0,  0, -1, 0, 0,  0, 0, 1, 0,  viewportHalfWidth, viewportHalfHeight, 0, 1));
    }

    update(timeStep, context) {
        let projectionTransformation = this.view.projectionTransformation;
        let cameraTransformation = context.cameraTransformation;

        this.renderingContext.stackTransformation(this.viewportTransformation);

        if(projectionTransformation) {
            this.renderingContext.stackTransformation(projectionTransformation);
        }

        if(cameraTransformation) {
            this.renderingContext.stackTransformation(cameraTransformation);
        }

        let points = context.points;
        if(points) {
            let point = new primitives.Point3D();
            let renderingPrimitive = new graphicalPrimitives.Point(point);

            points.forEach(() => {
                this.pointDrawer.draw(this.renderingContext, renderingPrimitive);
            }, point);
        }

        if(cameraTransformation) {
            this.renderingContext.unstackTransformation();
        }

        if(projectionTransformation) {
            this.renderingContext.unstackTransformation();
        }

        this.renderingContext.unstackTransformation();
    }
}

export class Canvas2dRenderingContext extends renderingSystem.RenderingContext {
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
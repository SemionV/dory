import * as rendering from "../renderingSystem.js"
import * as primitives from "../../primitives.js";

export class Canvas2dRenderingSystem extends rendering.RenderingSystem {
    constructor() {
        super();
        this.#registerDrawers();
    }

    #registerDrawers() {
        PointDrawer.instance = new PointDrawer();
    }

    addPoint(pointPrimitive) {
        this.addPrimitive(pointPrimitive, PointDrawer.instance)
    }
}

export class Canvas2dRenderingContext extends rendering.RenderingContext {
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

export class MoveOriginToCenterModifier extends rendering.Modifier {
    process(renderingContext) {
        const viewport = renderingContext.viewport;
        let xCenter = viewport.width/2 + viewport.x;
        let yCenter = viewport.height/2 + viewport.y;
        renderingContext.canvas.translate(xCenter, yCenter);
    }
}

export class ClearViewportModifier extends rendering.Modifier {
    process(renderingContext) {
        const viewport = renderingContext.viewport;
        renderingContext.canvas.clearRect(viewport.x, viewport.y , viewport.width, viewport.height);
    }
}

export class PointDrawer extends rendering.Drawer {
    constructor() {
        super();
        this.defaultColor = new  primitives.Color(250, 0, 0);
        this.transformedPostionCache = new primitives.Point3D();
    }

    draw(renderingContext, graphicalPrimitive) {
        var color = graphicalPrimitive.color ?? this.defaultColor;
        var canvas = renderingContext.canvas;
        var position = graphicalPrimitive.position;
        var transformation = renderingContext.currentTransformation;

        if(transformation) {
            transformation.apply(position, this.transformedPostionCache);
            position = this.transformedPostionCache;
        }

        canvas.fillStyle = color.toCanvasColor();
        canvas.fillRect(position.x - 1, position.y - 1, 2, 2);
    }
}
import * as rendering from "../renderingSystem.js"
import * as primitives from "../../primitives.js";

export class Canvas2dRenderingSystem extends rendering.RenderingSystem {
    constructor(viewport, canvasContext) {
        super();
        this.viewport = viewport;
        this.canvasContext = canvasContext;

        this.#registerDrawers();
    }

    #registerDrawers() {
        PointDrawer.instance = new PointDrawer();
    }

    getRenderingContext() {
        return new Canvas2dRenderingContext(this.viewport, this.canvasContext);
    }

    addPoint(pointPrimitive) {
        this.addPrimitive(pointPrimitive, PointDrawer.instance)
    }
}

export class Canvas2dRenderingContext extends rendering.RenderingContext {
    constructor(viewport, canvasContext) {
        super(viewport);
        this.canvas = canvasContext;
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

    draw(renderingContext, graphicalPrimitive, transformation) {
        var color = graphicalPrimitive.color ?? this.defaultColor;
        var canvas = renderingContext.canvas;
        var position = graphicalPrimitive.position;

        if(transformation) {
            transformation.apply(position, this.transformedPostionCache);
            position = this.transformedPostionCache;
        }

        canvas.fillStyle = color.toCanvasColor();
        canvas.fillRect(position.x - 1, position.y - 1, 2, 2);
    }
}
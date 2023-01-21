import * as primitives from "../../primitives.js"
import * as renderingSystem from "../renderyngSystem.js"

export class PointDrawer extends renderingSystem.Drawer {
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
import * as rendering from "../renderingSystem.js"
import * as graphicalPrimitives from "../graphicalPrimitive.js"
import * as primitives from "../../primitives.js";

export class Canvas2dRenderingSystem extends rendering.RenderingSystem {
    constructor(itemFactory, renderingContext) {
        super();
        this.itemFactory = itemFactory;
        this.renderingContext = renderingContext;
    }

    getRenderingContext() {
        return this.renderingContext;
    }

    getRenderingItemsFactory() {
        return this.itemFactory;
    }
}

export class Canvas2dRenderingContext extends rendering.RenderingContext {
    constructor(canvasContext) {
        super();
        this.canvas = canvasContext;
    }    
}

export class Canvas2dRenderingItemFactory extends rendering.RenderingItemsFactory {
    constructor() {
        super();
        this.#registerDrawers();
    }

    #registerDrawers() {
        this.setDrawer(graphicalPrimitives.Point, new PointDrawer());
    }

    #getDrawer(graphicalPrimitive) {
        return this.drawers.get(graphicalPrimitive.constructor);
    }

    createRenderingItem(graphicalPrimitive, transformationNode) {
        let drawer = this.#getDrawer(graphicalPrimitive);
        return new rendering.RenderingItem(graphicalPrimitive, transformationNode, drawer);
    }
}

export class PointDrawer extends rendering.Drawer {
    constructor() {
        super();
        this.defaultColor = new  primitives.Color(250, 0, 0);
    }

    draw(renderingContext, renderingItem) {
        var gPrimitive = renderingItem.primitive;
        var color = gPrimitive.color ?? this.defaultColor;
        var canvas = renderingContext.canvas;
        var position = gPrimitive.position;

        canvas.fillStyle = color.toCanvasColor();
        canvas.fillRect(position.x - 1, position.y - 1, 2, 2);
    }
}
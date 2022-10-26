import * as rendering from "../renderingSystem.js"
import * as graphicalPrimitives from "../graphicalPrimitive.js"

export class Canvas2dRenderingSystem extends rendering.RenderingSystem {
    constructor(canvasContext) {
        super();
        this.itemFactory = new Canvas2dRenderingItemFactory();
        this.renderingContext = new Canvas2dRenderingContext();

        this.#registerDrawers();
    }

    #registerDrawers() {

    }

    getRenderingContext() {
        return this.renderingContext;
    }

    getRenderingItemsFactory() {
        return this.itemFactory;
    }
}

export class Canvas2dRenderingContext extends rendering.RenderingContext {
    
}

export class Canvas2dRenderingItemFactory extends rendering.RenderingItemsFactory {
    create(graphicalPrimitive, transformationNode) {
        return new rendering.RenderingItem(graphicalPrimitive, transformationNode);
    }
}

export class CanvasDrawer extends rendering.Drawer {
    constructor(canvasContext) {
        super();
        this.canvasContext = canvasContext;
    }
}

export class LineDrawer extends rendering.Drawer {
    constructor(canvasContext) {
        super(canvasContext);
    }

    draw(renderingItem) {
        
    }
}
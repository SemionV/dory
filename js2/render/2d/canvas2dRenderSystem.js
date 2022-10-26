import * as rendering from "../renderingSystem.js"
import * as graphicalPrimitives from "../graphicalPrimitive.js"

export class Canvas2dRenderingSystem extends rendering.RenderingSystem {
    constructor(canvasContext) {
        super();
        this.itemFactory = new Canvas2dRenderingItemFactory();
        this.renderingContext = new Canvas2dRenderingContext();
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
    constructor() {
        super();
        this.#registerDrawers();
    }

    #registerDrawers() {

    }

    #getDrawer(graphicalPrimitive) {

    }

    createRenderingItem(graphicalPrimitive, transformationNode) {
        let drawer = this.#getDrawer(graphicalPrimitive);
        return new rendering.RenderingItem(graphicalPrimitive, transformationNode, drawer);
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
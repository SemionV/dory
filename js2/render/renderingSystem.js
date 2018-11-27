//convert generic praphical primitive to render specific
export class RenderingItemsFactory {
    create(graphicalPrimitive, transformationNode) {

    }
}

//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    draw(renderingItem) {
    }
}

export class RenderingItem {
    constructor(graphicalPrimitive, transformationNode) {
        this.primitive = graphicalPrimitive;
        this.transformationNode = transformationNode;
    }
}

//contains set of data specific for rendering(rendering queue)
export class RenderingContext {
    constructor() {
        this.queue = new Set();
    }

    findInQueue(predicate) {
        for(let x of this.queue){
            if(predicate(x)){
                return x;
            }
        }

        return null;
    }
}

//step of rendering context modification pipeline(ordering of rendering queue, optimization, etc)
export class Modifier {
    process(renderingContext) {

    }
}

// transformation layer. Root node is usually the camera transformation, then Nodes of scene objects with their transformations, their children and so on.
export class TransformationNode {
    constructor(transformation) {
        this.transformation = transformation;
        this.parentNode = null;
    }
}

//generic rendering logic(building, optimization and drawing of rendering queue logic)
export class RenderingSystem {
    constructor() {
        this.drawers = new Map();
        this.modifiers = new Set();
        this.currentNode = null;//current TransformationNode
        this.renderingItems = new Set();
    }

    getRenderingContext() {
        //should be implemented in a specific renderer
    }

    getRenderingItemsFactory() {
        //should be implemented in a specific renderer
    }

    pushTransformation(transformation) {
        let node = new TransformationNode(transformation);
        node.parentNode = this.currentNode;

        this.currentNode = node;
    }

    popTransformation() {
        if(this.currentNode) {
            this.currentNode = this.currentNode.parentNode;
        }
    }

    addPrimitive(graphicalPrimitive) {
        let itemsFactory = this.getRenderingItemsFactory();
        let renderingItem = itemsFactory.create(graphicalPrimitive, this.currentNode);
        this.renderingItems.add(renderingItem);
    }

    render() {
        let context = this.getRenderingContext();

        this.updateRenderingQueue(context);
        this.modificationPipeline(context);
        this.drawQueue(context);
        this.cleanup();
    }

    //go through generic primitives and remove/add specific primitives to context
    updateRenderingQueue(renderingContext) {
        let itemsFactory = this.getRenderingItemsFactory();        

        renderingContext.queue.clear();

        for(let primitive of this.graphicalPrimitives) {
            let renderingItem = itemsFactory.create(primitive);
            renderingContext.queue.add(renderingItem);
        }
    }

    modificationPipeline(renderingContext) {
        for(let modifier of this.modifiers) {
            modifier.process(renderingContext);
        }
    }

    drawQueue(renderingContext) {
        for(let item of renderingContext.queue) {
            let drawer = this.drawers.get(item);
            if(drawer) {
                drawer.draw(item);
            }
        }
    }

    cleanup() {
        this.graphicalPrimitives.clear();
    }
}

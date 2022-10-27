//convert generic graphical primitive to render specific
export class RenderingItemsFactory {
    constructor() {
        this.drawers = new Map();//key type: GraphicalPrimitive type(item.constructor) | value type: Drawer object
    }

    createRenderingItem(graphicalPrimitive, transformationNode) {

    }

    setDrawer(type, drawer) {
        this.drawers.set(type, drawer);
    }
}

//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    draw(renderingContext, renderingItem) {
    }
}

export class RenderingItem {
    constructor(graphicalPrimitive, transformationNode, drawer) {
        this.primitive = graphicalPrimitive;
        this.transformationNode = transformationNode;
        this.drawer = drawer;
    }
}

//contains set of data specific for rendering(rendering queue) and refers to an underalying graphics framework(webgl, canvas, etc)
export class RenderingContext {
    constructor(viewport = new Viewport) {
        this.queue = new Set();
        this.viewport = viewport;
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

export class Viewport{
    constructor(width, height, x = 0, y = 0){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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

    combineTransformations() {
        return TransformationNode.combineWithParentTransformations(this, this.transformation);
    }

    static combineWithParentTransformations(transformationNode, combinedTransformation) {
        var parentTransformation = transformationNode.parentNode ? transformationNode.parentNode.transformation : null;
        if(parentTransformation) {
            combinedTransformation = parentTransformation.combine(combinedTransformation);

            TransformationNode.combineWithParentTransformations(parentTransformation, combinedTransformation);
        }
        
        return combinedTransformation;
    }
}

//generic rendering logic(building, optimization and drawing of rendering queue logic)
export class RenderingSystem {
    constructor() {
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

    addModifier(modifier) {
        this.modifiers.add(modifier
            );
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
        let renderingItem = itemsFactory.createRenderingItem(graphicalPrimitive, this.currentNode);
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
        //this s a most basic implementation. There can be also some cashing implemented(but in a specific renderer!)
        renderingContext.queue.clear();

        for(let renderingItem of this.renderingItems) {
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
            let drawer = item.drawer;
            if(drawer) {
                drawer.draw(renderingContext, item);
            }
        }
    }

    cleanup() {
        this.renderingItems.clear();
        this.currentNode = null;
    }
}

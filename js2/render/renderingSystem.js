import * as primitives from "../primitives.js";

//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    draw(renderingContext, graphicalPrimitive, transformation) {
    }
}

export class RenderingItem {
    constructor(graphicalPrimitive, drawer) {
        this.primitive = graphicalPrimitive;
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
        this.renderingItems = new Set();
        this.childNodes = new Set();
    }

    addRenderingItem(renderingItem) {
        this.renderingItems.add(renderingItem);
    }

    addChild(node) {
        this.childNodes.add(node);
    }

    get children() {
        return this.childNodes;
    }
}

//generic rendering logic(building, optimization and drawing of rendering queue logic)
export class RenderingSystem {
    constructor() {
        this.modifiers = new Set();
        this.reset();
    }

    getRenderingContext() {
        //should be implemented in a specific renderer
    }

    addModifier(modifier) {
        this.modifiers.add(modifier);
    }

    pushTransformation(transformation) {
        let node = new TransformationNode(transformation);
        this.currentNode.addChild(node);

        this.parrentNode = this.currentNode;
        this.currentNode = node;
    }

    popTransformation() {
        this.currentNode = this.parrentNode;
    }

    addPrimitive(graphicalPrimitive, drawer) {
        let renderingItem = new RenderingItem(graphicalPrimitive, drawer);
        this.currentNode.addRenderingItem(renderingItem);
    }

    render() {
        let context = this.getRenderingContext();

        this.modificationPipeline(context, this.rootNode, null);
        this.renderItems(context, this.rootNode, null);

        this.reset();
    }

    modificationPipeline(renderingContext) {
        for(let modifier of this.modifiers) {
            modifier.process(renderingContext);
        }
    }

    renderItems(renderingContext, node, parentTransformation) {
        let transformation = this.combineNodeTransformation(parentTransformation, node.transformation);

        for(let item of node.renderingItems) {
            let drawer = item.drawer;

            if(drawer) {
                drawer.draw(renderingContext, item.primitive, transformation);
            }
        }

        for(let childNode of node.children) {
            this.renderItems(renderingContext, childNode, transformation);
        }
    }

    combineNodeTransformation(parentTransformation, nodeTransformation) {
        let combinedTransformation = nodeTransformation;
        if(parentTransformation) {
            combinedTransformation = parentTransformation.combine(nodeTransformation);
        }

        return combinedTransformation;
    }

    reset() {
        this.rootNode = new TransformationNode(new primitives.IdentityTransformation());
        this.currentNode = this.rootNode;
        this.parrentNode = null;
    }
}

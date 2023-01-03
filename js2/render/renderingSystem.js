import * as primitives from "../primitives.js";

//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    draw(renderingContext, graphicalPrimitive) {
    }
}

export class RenderingItem {
    constructor(graphicalPrimitive, drawer) {
        this.primitive = graphicalPrimitive;
        this.drawer = drawer;
    }
}

export class RenderingQueue {
    constructor() {
        this.rootNode = new ViewNode(new primitives.IdentityTransformation());
        this.currentNode = this.rootNode;
        this.parrentNode = null;
    }
}

//contains set of data specific for rendering(rendering queue) and refers to an underalying graphics framework(webgl, canvas, etc)
export class RenderingContext {
    constructor(viewport) {
        this.viewport = viewport;
    }

    stackTransformation(parentTransformation, transformation) {
    }

    unstackTransformation() {        
    }

    get currentTransformation() {
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
export class ViewNode {
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

export class RenderingSystem {
    constructor() {
        this.modifiers = new Set();
        this.reset();
    }

    addModifier(modifier) {
        this.modifiers.add(modifier);
    }

    pushTransformation(transformation) {
        let node = new ViewNode(transformation);
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

    render(renderingContext) {
        this.modificationPipeline(renderingContext, this.rootNode, null);
        this.renderItems(renderingContext, this.rootNode);

        this.reset();
    }

    modificationPipeline(renderingContext) {
        for(let modifier of this.modifiers) {
            modifier.process(renderingContext);
        }
    }

    renderItems(renderingContext, node) {
        renderingContext.stackTransformation(node.transformation);

        for(let item of node.renderingItems) {
            let drawer = item.drawer;

            if(drawer) {
                drawer.draw(renderingContext, item.primitive);
            }
        }

        for(let childNode of node.children) {
            this.renderItems(renderingContext, childNode);
        }

        renderingContext.unstackTransformation();
    }

    reset() {
        this.rootNode = new ViewNode(new primitives.IdentityTransformation());
        this.currentNode = this.rootNode;
        this.parrentNode = null;
    }
}

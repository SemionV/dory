//convert generic primitive to render specific
export class PrimitivesFactory {
    create(genericPrimitive) {

    }
}

export class GenericPrimitive {
    constructor(id) {
        this.id = id;
    }
}

export class Primitive {
    constructor(id) {
        this.id = id;
    }
}

//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    draw(primitive) {
    }
}

//contains set of data specific for rendering(rendering queue)
export class RenderingContext {
    constructor() {
        this.primitives = new Set();
    }

    findPrimitive(predicate) {
        for(let x of this.primitives){
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

let drawersSymbol = Symbol();
let modifiersSymbol = Symbol();
let genericPrimitivesSymbol = Symbol();

//generic rendering logic(building, optimization and drawing of rendering queue logic)
export class RenderingSystem {
    constructor() {
        this[drawersSymbol] = new Map();
        this[modifiersSymbol] = new Set();
        this[genericPrimitivesSymbol] = new Set();//generig primitives
    }

    getRenderingContext() {
        //should be implemented in specific renderer
    }

    getPrimitivesFactory() {
        //should be implemented in specific renderer
    }

    addPrimitive(genericPrimitive) {
        this[genericPrimitivesSymbol].add(genericPrimitive);
    }

    render() {
        let context = this.getRenderingContext();

        this.updateRenderingQueue(context);
        this.modificationPipeline(context);
        this.drawQueue(context);
        this.cleanupQueue();
    }

    //go through this[genericsSymbol] and remove/add specific primitives to context
    updateRenderingQueue(renderingContext) {
        let primitivesFactory = this.getPrimitivesFactory();
        let primitivesToDelete = new Set();

        for(let primitive of renderingContext.primitives) {
            let existingGenericPrimitive = null;

            for(let genericPrimitive of this[genericPrimitivesSymbol]) {
                if(genericPrimitive.id === primitive.id) {
                    existingGenericPrimitive = genericPrimitive;
                    break;
                }
            }

            if(!existingGenericPrimitive) {
                primitivesToDelete.add(primitive);
            }
        }

        for(let primitive of genericPrimitive) {
            renderingContext.primitives.delete(primitive);
        }

        for(let genericPrimitive of this[genericPrimitivesSymbol]) {
            if(!renderingContext.findPrimitive((x) => {x.id == genericPrimitive.id})) {
                let primitive = primitivesFactory.create(genericPrimitive);
                renderingContext.primitives.add(primitive);
            }
        }
    }

    modificationPipeline(renderingContext) {
        for(let modifier of this[modifiersSymbol]) {
            modifier.process(renderingContext);
        }
    }

    drawQueue(renderingContext) {
        for(let primitve of renderingContext.primitives) {
            let drawer = this[drawersSymbol].get(primitive);
            if(drawer) {
                drawer.draw(primitve);
            }
        }
    }

    cleanupQueue() {
        this[genericPrimitivesSymbol].clear();
    }
}

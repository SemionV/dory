//convert generic primitive to render specific
export class PrimitivesFactory {
    create(genericPrimitive) {

    }
}

export class Primitive {

}

//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    draw(primitive) {
    }
}

//contains set of data specific for rendering(rendering queue)
export class RenderingContext {

}

//step of rendering context modification pipeline(ordering of rendering queue, optimization, etc)
export class Modifier {
    process(renderingContext) {

    }
}

let drawersSymbol = Symbol();

//generic rendering logic(building, optimization and drawing of rendering queue logic)
export class RenderingSystem {
    constructor() {
        this[drawersSymbol] = new Set();
    }
}

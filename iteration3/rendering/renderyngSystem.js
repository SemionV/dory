//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
    constructor(debugMessagePool) {
        this.debugMessagePool = debugMessagePool;
    }

    draw(renderingContext, graphicalPrimitive) {
    }
}

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

export class Viewport {
    constructor(width, height, x = 0, y = 0, transformation){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.transformation = transformation;
    }
}

export class View {
    constructor(viewport, camera) {
        this.viewport = viewport;
        this.camera = camera;
    }
}

export class Camera {
    constructor(id, transformation, projection, velocity, direction) {
        this.id = id;
        this.transformation = transformation;
        this.projection = projection;
        this.velocity = velocity;
        this.direction = direction;
    }
}
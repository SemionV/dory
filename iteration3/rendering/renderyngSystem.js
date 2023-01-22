//draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
export class Drawer {
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
    constructor(viewport, cameraId) {
        this.viewport = viewport;
        this.cameraId = cameraId;
    }
}
import * as primitives from "../primitives.js";

export class GraphicalPrimitive {
    constructor(id, color) {
        this.id = id;
        this.color = color;
    }
}

export class PointPrimitive extends GraphicalPrimitive {
    constructor(id, color, position = new primitives.Point3D()){
        super(id, color);
        this.position = position;
    }
}

export class VisualPolygon extends GraphicalPrimitive {
    constructor(id, color, polygon, wireFrame = true){
        super(id, color);
        this.polygon = polygon;
        this.wireFrame = wireFrame;
    }
}

export class ImageTile extends VisualPolygon {
    constructor(id, image, color, polygon, wireFrame = true) {
        super(id, color, polygon, wireFrame);
        this.image = image;
    }
}
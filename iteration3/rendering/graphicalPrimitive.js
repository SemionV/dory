import * as primitives from "../primitives.js";

export class GraphicalPrimitive {
}

export class Point extends GraphicalPrimitive {
    constructor(position = new primitives.Point3D(), color){
        super();
        this.position = position;
        this.color = color;
    }
}

export class Line extends GraphicalPrimitive {
    constructor(pointA, pointB) {
        super()
        this.pointA = pointA;
        this.pointB = pointB;
    }
}

export class Face extends GraphicalPrimitive {
    constructor(points){
        super();
        this.points = points;
    }
}

export class Mesh extends GraphicalPrimitive {
    constructor(faces, material) {
        super();
        this.faces = faces;
        this.material = material;
    }
}
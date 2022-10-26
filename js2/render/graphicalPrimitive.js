import * as primitives from "../primitives.js";

export class GraphicalPrimitive {
    constructor(transformation) {
        this.transformation = transformation;
    }
}

export class Point extends GraphicalPrimitive {
    constructor(transformation, position = new primitives.Point3D(), color){
        super(transformation);
        this.position = position;
        this.color = color;
    }
}

export class Line extends GraphicalPrimitive {
    constructor(transformation, pointA, pointB) {
        super(transformation)
        this.pointA = pointA;
        this.pointB = pointB;
    }
}

export class Face extends GraphicalPrimitive {
    constructor(transformation, points){
        super(transformation);
        this.points = points;
    }
}

export class Mesh extends GraphicalPrimitive {
    constructor(transformation, faces, material) {
        super(transformation);
        this.faces = faces;
        this.material = material;
    }
}
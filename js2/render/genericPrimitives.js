import * as primitives from "../primitives.js";

export class GraphicalPrimitive {
    constructor(id) {
        this.id = id;
    }
}

export class Point extends GraphicalPrimitive {
    constructor(id, position = new primitives.Point3D()){
        super(id);
        this.position = position;
    }
}

export class Line extends GraphicalPrimitive {
    constructor(id, pointA, pointB) {
        super(id)
        this.pointA = pointA;
        this.pointB = pointB;
    }
}

export class Face extends GraphicalPrimitive {
    constructor(id, points){
        super(id);
        this.points = points;
    }
}

export class Mesh extends GraphicalPrimitive {
    constructor(id, transformation, faces, material) {
        super(id);
        this.faces = faces;
        this.material = material;
    }
}
import {Component} from "./component.js";
import * as primitives from "../primitives.js";

export class Properties extends Component{
    constructor(isStatic = false){
        super();
        this.isStatic = isStatic;
    }
}

export class Transformation extends Component{
    constructor(transformation = new primitives.Matrix3D()){
        super();
        this.transformation = transformation;
    }
}

export class Camera extends Component{
    constructor(dimensions = new primitives.ThreeDimensions()){
        super();
        this.dimensions = dimensions;
    }
}

export class IsometricCamera extends Camera{
    constructor(dimensions, zAxisAlignedDimensions = new primitives.ThreeDimensions()){
        super(dimensions);
        this.zAlignedDimensions = zAxisAlignedDimensions;
    }
}

export class Sprite extends Component{
    constructor(image){
        super();
        this.image = image;
    }
}

export class Mesh extends Component{
    constructor(name, mesh){
        super(name);
        this.mesh = mesh;
    }
}

export class BoundingVolume extends Mesh{
    constructor(mesh){
        super(null, mesh);
    }
}

export class BoundingBox extends BoundingVolume{
    constructor(box){
        super();
        this.box = box;
    }
}

export class Direction extends Component{
    constructor(vector = new primitives.Point3D(1, 0, 0)){
        super();
        this.direction = vector;
    }
}

export class Position extends Component{
    constructor(point = new primitives.Point3D()){
        super();
        this.point = point;
    }
}

export class ProjectedPosition extends Position{
    constructor(){
        super();
    }
}

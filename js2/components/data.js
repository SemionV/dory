define(['./component', 'primitives'], function(component, primitives){
    class Properties extends component.Component{
        constructor(isStatic = false){
            super();
            this.isStatic = isStatic;
        }
    }

    class Transformation extends component.Component{
        constructor(transformation = new primitives.Matrix3D()){
            super();
            this.transformation = transformation;
        }
    }

    class Camera extends component.Component{
        constructor(dimensions = new primitives.ThreeDimensions()){
            super();
            this.dimensions = dimensions;
        }
    }

    class IsometricCamera extends Camera{
        constructor(dimensions, zAxisAlignedDimensions = new primitives.ThreeDimensions()){
            super(dimensions);
            this.zAlignedDimensions = zAxisAlignedDimensions;
        }
    }

    class Sprite extends component.Component{
        constructor(image){
            super();
            this.image = image;
        }
    }

    class Mesh extends component.Component{
        constructor(name, mesh){
            super(name);
            this.mesh = mesh;
        }
    }

    class BoundingVolume extends Mesh{
        constructor(mesh){
            super(null, mesh);
        }
    }

    class BoundingBox extends BoundingVolume{
        constructor(box){
            super();
            this.box = box;
        }
    }

    class Direction extends component.Component{
        constructor(vector = new primitives.Point3D(1, 0, 0)){
            super();
            this.direction = vector;
        }
    }

    class Position extends component.Component{
        constructor(point = new primitives.Point3D()){
            super();
            this.point = point;
        }
    }

    class ProjectedPosition extends Position{
        constructor(){
            super();
        }
    }

    return {
        Properties,
        Transformation,
        IsometricCamera,
        Sprite,
        Mesh,
        BoundingVolume,
        BoundingBox,
        Direction,
        Camera,
        Position,
        ProjectedPosition
    };
});

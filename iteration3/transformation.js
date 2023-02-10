import * as math from "./math.js"

// generic transformation, it can be a matrix, quaternion or a simple math calculation
export class Transformation {
    apply(point, resultPoint) {

    }

    combine(transformation) {

    }

    invert() {

    }
}

export class IdentityTransformation {
    apply(point, resultPoint) {
        resultPoint.x = point.x;
        resultPoint.y = point.y;
        resultPoint.z = point.z;
    }

    combine(transformation) {
        return new CombinedTransformation(transformation, null);
    }
}

export class Translation extends Transformation {
    constructor(x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    apply(point, resultPoint) {
        resultPoint.x = point.x + this.x;
        resultPoint.y = point.y + this.y;
        resultPoint.z = point.z + this.z;
    }

    combine(transformation) {
        return new CombinedTransformation(transformation, this);
    }

    invert() {
        return new Translation(this.x * -1, this.y * -1, this.z * -1);
    }
}

export class Rotation extends Transformation {
    constructor(x = 0, y = 0, z = 0) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }

    apply(point, resultPoint) {
        //to do: implement via Quaternion
    }

    combine(transformation) {
        return new CombinedTransformation(transformation, this);
    }
}

export class MatrixTransformation extends Transformation {
    constructor(matrix = new math.Matrix3D()) {
        super();
        this.matrix = matrix;
    }

    apply(point, resultPoint) {
        this.matrix.transform(point, resultPoint);
    }

    combine(transformation) {
        if(transformation instanceof MatrixTransformation && transformation.mergeMatrix) {
            let combinedMatrix = transformation.matrix.multiply(this.matrix);
            return new MatrixTransformation(combinedMatrix);
        } else {
            return new CombinedTransformation(transformation, this);
        }
    }

    invert() {
        return new MatrixTransformation(this.matrix.invert());
    }
}

export class CombinedTransformation extends Transformation {
    constructor(firstTransformation, secondTransformation) {
        super();
        this.firstTransformation = firstTransformation;
        this.secondTransformation = secondTransformation;
    }

    apply(point, resultPoint) {
        if(this.firstTransformation) {
            this.firstTransformation.apply(point, resultPoint);
        }

        if(this.secondTransformation) {
            this.secondTransformation.apply(resultPoint, resultPoint);
        }
    }

    combine(transformation) {
        return new CombinedTransformation(transformation, this);
    }

    invert() {
        let firstTransformation = this.firstTransformation ? this.firstTransformation.invert() : null;
        let secondTransformation = this.secondTransformation ? this.secondTransformation.invert() : null;

        return new CombinedTransformation(firstTransformation, secondTransformation);
    }
}

export class IsometricProjection extends Transformation{
    apply(point, resultPoint) {
        let x = point.x;
        let y = point.y;
        let z = point.z;

        resultPoint.x = x - y;
        resultPoint.y = ((x + y) / 2) + z;
        resultPoint.z = 0;
    }

    combine(transformation) {
        return new CombinedTransformation(transformation, this);
    }
}
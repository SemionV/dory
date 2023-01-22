/*See http://glmatrix.net/*/
export class Matrix3D extends Array{
    constructor(...parts){
        if(parts.length == 16){
            super(parts[0],parts[1],parts[2],parts[3],
            parts[4],parts[5],parts[6],parts[7],
            parts[8],parts[9],parts[10],parts[11],
            parts[12],parts[13],parts[14],parts[15]);
        }
        else{
            super(1,0,0,0,
                0,1,0,0,
                0,0,1,0,
                0,0,0,1);
        }
    }

    toIdentity(){
        this[0] = 1; this[1] = 0; this[2] = 0; this[3] = 0;
        this[4] = 0; this[5] = 1; this[6] = 0; this[7] = 0;
        this[8] = 0; this[9] = 0; this[10] = 1; this[11] = 0;
        this[12] = 0; this[13] = 0; this[14] = 0; this[15] = 1;
    }

    copyTo(matrix){
        matrix[0] = this[0]; matrix[1] = this[1]; matrix[2] = this[2]; matrix[3] = this[3];
        matrix[4] = this[4]; matrix[5] = this[5]; matrix[6] = this[6]; matrix[7] = this[7];
        matrix[8] = this[8]; matrix[9] = this[9]; matrix[10] = this[10]; matrix[11] = this[11];
        matrix[12] = this[12]; matrix[13] = this[13]; matrix[14] = this[14]; matrix[15] = this[15];
    }

    transform(point, result = new Point3D()){
        const px = point.x ?? 0;        
        const py = point.y ?? 0;        
        const pz = point.z ?? 0;        
        const pw = point.w ?? 0;        

        let x = (px * this[0]) + (py * this[4]) + (pz * this[8]) + (pw * this[12]);
        let y = (px * this[1]) + (py * this[5]) + (pz * this[9]) + (pw * this[13]);
        let z = (px * this[2]) + (py * this[6]) + (pz * this[10]) + (pw * this[14]);
        let w = (px * this[3]) + (py * this[7]) + (pz * this[11]) + (pw * this[15]);
        result.x = x;
        result.y = y;
        result.z = z;
        result.w = w;

        return result;
    }

    multiply(matrix, result = new Matrix3D()) {
        let a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3],
            a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7],
            a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11],
            a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15];

        let b0 = matrix[0], b1 = matrix[1], b2 = matrix[2], b3 = matrix[3];
        result[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        result[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        result[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        result[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = matrix[4];
        b1 = matrix[5];
        b2 = matrix[6];
        b3 = matrix[7];
        result[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        result[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        result[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        result[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = matrix[8];
        b1 = matrix[9];
        b2 = matrix[10];
        b3 = matrix[11];
        result[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        result[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        result[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        result[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        b0 = matrix[12];
        b1 = matrix[13];
        b2 = matrix[14];
        b3 = matrix[15];
        result[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        result[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        result[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        result[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return result;
    }

    invert(result = new Matrix3D()) {
        var a00 = this[0], a01 = this[1], a02 = this[2], a03 = this[3],
            a10 = this[4], a11 = this[5], a12 = this[6], a13 = this[7],
            a20 = this[8], a21 = this[9], a22 = this[10], a23 = this[11],
            a30 = this[12], a31 = this[13], a32 = this[14], a33 = this[15],
            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        result[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        result[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        result[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        result[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        result[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        result[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        result[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        result[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        result[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        result[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        result[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        result[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
        result[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
        result[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
        result[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
        result[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
        return result;
    }

    getTranslation(result = new Point3D()) {
        result.x = this[12];
        result.y = this[13];
        result.z = this[14];
        return result;
    }

    addTranslation(dx, dy, dz){
        result[12] = result[12] + dx; 
        result[13] = result[13] + dy; 
        result[14] = result[14] + dz;
        return result;
    }

    toString(){
        return `${this[0]} ${this[1]} ${this[2]} ${this[3]}
${this[4]} ${this[5]} ${this[6]} ${this[7]}
${this[8]} ${this[9]} ${this[10]} ${this[11]}
${this[12]} ${this[13]} ${this[14]} ${this[15]}`;
    }

    static translate(x, y, z, result = new Matrix3D()){
        result[0] = 1; result[1] = 0; result[2] = 0; result[3] = 0;
        result[4] = 0; result[5] = 1; result[6] = 0; result[7] = 0;
        result[8] = 0; result[9] = 0; result[10] = 1; result[11] = 0;
        result[12] = x; result[13] = y; result[14] = z; result[15] = 1;
        return result;
    }

    static scale(x, y, z, result = new Matrix3D()){
        result[0] = x; result[1] = 0; result[2] = 0; result[3] = 0;
        result[4] = 0; result[5] = y; result[6] = 0; result[7] = 0;
        result[8] = 0; result[9] = 0; result[10] = z; result[11] = 0;
        result[12] = 0; result[13] = 0; result[14] = 0; result[15] = 1;
        return result;
    }

    static rotateX(a, result = new Matrix3D()){
        result[0] = 1; result[1] = 0; result[2] = 0; result[3] = 0;
        result[4] = 0; result[5] = Math.cos(a); result[6] = -Math.sin(a); result[7] = 0;
        result[8] = 0; result[9] = Math.sin(a); result[10] = Math.cos(a); result[11] = 0;
        result[12] = 0; result[13] = 0; result[14] = 0; result[15] = 1;
        return result;
    }

    static rotateY(a, result = new Matrix3D()){
        result[0] = Math.cos(a); result[1] = 0; result[2] = Math.sin(a); result[3] = 0;
        result[4] = 0; result[5] = 1; result[6] = 0; result[7] = 0;
        result[8] = -Math.sin(a); result[9] = 0; result[10] = Math.cos(a); result[11] = 0;
        result[12] = 0; result[13] = 0; result[14] = 0; result[15] = 1;
        return result;
    }

    static rotateZ(a, result = new Matrix3D()){
        result[0] = Math.cos(a); result[1] = -Math.sin(a); result[2] = 0; result[3] = 0;
        result[4] = Math.sin(a); result[5] = Math.cos(a); result[6] = 0; result[7] = 0;
        result[8] = 0; result[9] = 0; result[10] = 1; result[11] = 0;
        result[12] = 0; result[13] = 0; result[14] = 0; result[15] = 1;
        return result;
    }
}

export class Angle {
    static radDegree = Math.PI / 180;

    static toRadian(degree){
        return degree * Angle.radDegree;
    }
}
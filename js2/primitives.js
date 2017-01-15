define(function(){
    class Constants {
        static get radian90(){
            return 1.5707963267948966;
        }

        static get radianNeg90(){
            return -1.5707963267948966;
        }
    }

    class Point2D{
        constructor(x = 0, y = 0){
            this.x = x;
            this.y = y;
        }

        areEqual(point){
            return this.x == point.x && this.y == point.y;
        }

        toIsometric(result = new Point2D()){
            result.x = this.x - this.y;
            result.y = (this.x + this.y) / 2;
            return result;
        }

        to2D(result = new Point2D()){
            result.x = (2 * this.y + this.x) / 2;
            result.y = (2 * this.y - this.x) / 2;
            return result;
        }

        copyTo(result = new Point2D()){
            result.x = this.x;
            result.y = this.y;
        }

        translate(vector){
            return new Point2D(this.x + vector.x, this.y + vector.y)
        }

        multiply(factor){
            return new Point2D(this.x*factor, this.y*factor);
        }

        toString(){
            return `${this.x}, ${this.y}`;
        }

        reset(){
            this.x = 0;
            this.y = 0;
        }

        perpendicularLeft(result = new Point2D()){
            result.x = this.y;
            result.y = -this.x;

            return result;
        }

        perpendicularRight(result = new Point2D()){
            result.x = -this.y;
            result.y = this.x;

            return result;
        }

        inverse(result = new Point2D()){
            result.x = -this.x;
            result.y = -this.y;

            return result;
        }

        length(){
            return Math.sqrt(this.x*this.x + this.y*this.y);
        }

        normalize(result = new Point2D()) {
            let len = this.x * this.x + this.y * this.y;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                result.x = this.x * len;
                result.y = this.y * len;
            }
            return result;
        }

        rotate45DegreesNormal(result = new Point2D()){
            let px = this.y;
            let py = -this.x;

            let x = this.x + px;
            let y = this.y + py;

            result.x = x != 0 ? x / Math.abs(x) : 0;
            result.y = y != 0 ? y / Math.abs(y) : 0;

            return result;
        }

        dot(vector){
            return vector.x * this.x + vector.y * this.y;
        }

        projectionOn(vector){
            return this.dot(vector) / vector.length()
        }

        projectionOnNormalized(vector){
            return this.dot(vector);
        }

        static getDirection(point){
            for(let [key, value] of directionsMap2D){
                if(value.areEqual(point)){
                    return key;
                }
            }
        }

        static fromDirection(direction){
            return directionsMap2D.get(direction);
        }
    }

    var directionsMap2D = new Map([
        ['N', new Point2D(0, -1)],  // ↑
        ['NE', new Point2D(1, -1)], // ↗
        ['E', new Point2D(1, 0)],   // →
        ['SE', new Point2D(1, 1)],  // ↘
        ['S', new Point2D(0, 1)],   // ↓
        ['SW', new Point2D(-1, 1)], // ↙
        ['W', new Point2D(-1, 0)],  // ←
        ['NW', new Point2D(-1, -1)] // ↖
    ]);

    class Point3D extends Point2D{
        constructor(x = 0, y = 0, z = 0, w = 1){
            super(x, y);
            this.z = z;
            this.w = w;
        }

        toIsometric(result){
            var point = super.toIsometric(result);
            point.y += this.z;
            return point;
        }

        copyTo(result = new Point3D()){
            result.x = this.x;
            result.y = this.y;
            result.z = this.z;
        }

        translate(vector, result = new Point3D()){
            result.x = this.x + vector.x;
            result.y = this.y + vector.y;
            result.z = this.z + vector.z;
            return result;
        }

        multiply(factor, result = new Point3D()){
            result.x = this.x*factor;
            result.y = this.y*factor;
            result.z = this.z*factor;
            return result;
        }

        reset(){
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.w = 1;
        }

        normalize(result = new Point2D()) {
            let len = this.x * this.x + this.y * this.y + this.z * this.z;
            if (len > 0) {
                len = 1 / Math.sqrt(len);
                result.x = this.x * len;
                result.y = this.y * len;
                result.z = this.z * len;
            }
            return result;
        }

        dot(vector){
            return vector.x * this.x + vector.y * this.y + vector.z * this.z;
        }

        length(){
            return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
        }

        toString(){
            return super.toString() + `, ${this.z}`;
        }
    }

    class ThreeDimensions{
        constructor(dimensionX = new Point3D(), dimensionY = new Point3D(), dimensionZ = new Point3D()){
            this.dimensionX = dimensionX;
            this.dimensionY = dimensionY;
            this.dimensionZ = dimensionZ;
        }
    }

    /*See http://glmatrix.net/*/
    class Matrix3D extends Array{
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
            let x = (point.x * this[0]) + (point.y * this[4]) + (point.z * this[8]) + (point.w * this[12]);
            let y = (point.x * this[1]) + (point.y * this[5]) + (point.z * this[9]) + (point.w * this[13]);
            let z = (point.x * this[2]) + (point.y * this[6]) + (point.z * this[10]) + (point.w * this[14]);
            let w = (point.x * this[3]) + (point.y * this[7]) + (point.z * this[11]) + (point.w * this[15]);
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

    class Color{
        constructor(r, g, b, a = 'undefined'){
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        toCanvasColor() {
            if (this.a != 'undefined') {
                return `rgba(${this.r},${this.g},${this.b},${this.a})`;
            }
            else {
                return `rgb(${this.r},${this.g},${this.b})`;
            }
        }
    }

    class Polygon extends Array{
        constructor(...points){
            super();
            for(let point of points){
                this.push(point)
            }
        }
    }

    class Image{
        constructor(image, offsetX = 0, offsetY = 0, clipX = 0, clipY = 0, clipWidth = 0, clipHeight = 0){
            this.image = image;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.clipX = clipX;
            this.clipY = clipY;
            this.clipWidth = clipWidth;
            this.clipHeight = clipHeight;
        }
    }

    class Rectangle{
        constructor(width, height){
            this.width = width;
            this.height = height;
        }
    }

    class Box extends Rectangle{
        constructor(width, height, altitude) {
            super(width, height);
            this.altitude = altitude;
        }
    }

    class Text {
        constructor(text, color, solid = true, offsetX = 0, offsetY = 0) {
            this.text = text;
            this.color = color;
            this.solid = solid;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
        }
    }

    class SpriteSheet{
        constructor(image, frameWidth, frameHeight){
            this.image = image;
            this.frameWidth = frameWidth;
            this.frameHeight = frameHeight;
            this.framesPerRow = this.image.width / frameWidth;
            this.rowsCount = this.image.height / frameHeight;
            this.offsets = new Array(this.framesPerRow * this.rowsCount);
        }

        setFramesOffset(startFrame, endFrame, x, y){
            var offset = {x: x, y: y};
            for(var i = startFrame; i <= endFrame; i++)
            {
                this.offsets[i] = offset;
            }
        }

        getFrame(index){
            var rowIndex = Math.floor(index / this.framesPerRow);
            var colIndex = index % this.framesPerRow;
            var y = this.frameHeight * rowIndex;
            var x = this.frameWidth * colIndex;
            var offset = this.offsets[index];

            return new Image(this.image, offset ? offset.x : 0, offset ? offset.y : 0, x, y, this.frameWidth, this.frameHeight);
        }
    }

    class Vertex extends Point3D{
        constructor(x, y, z, color = new Color(0, 0, 0)){
            super(x, y, z);
            this.color = color;
        }
    }

    class Triangle extends Polygon{
        constructor(vertex1, vertex2, vertex3){
            super(vertex1, vertex2, vertex3);
        }
    }

    class Mesh{
        constructor(){
            this.vertexes = [];//Use Array since it does not check uniqueness if items, that works faster
            this.polygons = [];
        }

        addVertex(vertex){
            this.vertexes.push(vertex);
        }

        addVertexes(...vertexes){
            for(let vertex of vertexes){
                this.addVertex(vertex)
            }
        }

        addPolygon(polygon){
            this.polygons.push(polygon);
        }

        addPolygons(...polygons){
            for(let polygon of polygons){
                this.addPolygon(polygon);
            }
        }

        static fromBox(box, color){
            let halfWidth = box.width / 2;
            let halfHeight = box.height / 2;

            let vertex1 = new Vertex(-halfWidth, -halfHeight, 0, color);
            let vertex2 = new Vertex(box.width - halfWidth, -halfHeight, 0, color);
            let vertex3 = new Vertex(box.width - halfWidth, box.height - halfHeight, 0, color);
            let vertex4 = new Vertex(0 - halfWidth, box.height - halfHeight, 0, color);

            let vertex5 = new Vertex(vertex1.x, vertex1.y, -box.altitude, color);
            let vertex6 = new Vertex(vertex2.x, vertex2.y, -box.altitude, color);
            let vertex7 = new Vertex(vertex3.x, vertex3.y, -box.altitude, color);
            let vertex8 = new Vertex(vertex4.x, vertex4.y, -box.altitude, color);

            let mesh = new Mesh();
            mesh.addVertexes(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7, vertex8);

            var polygon1 = new Polygon(vertex1, vertex4, vertex3, vertex2);
            var polygon2 = new Polygon(vertex1, vertex2, vertex6, vertex5);
            var polygon3 = new Polygon(vertex2, vertex3, vertex7, vertex6);
            var polygon4 = new Polygon(vertex3, vertex4, vertex8, vertex7);
            var polygon5 = new Polygon(vertex4, vertex1, vertex5, vertex8);
            var polygon6 = new Polygon(vertex5, vertex6, vertex7, vertex8);

            mesh.addPolygons(polygon1, polygon2, polygon3, polygon4, polygon5, polygon6);

            return mesh;
        }
    }

    //TODO: Make entity component out of this class
    class Animation{
        constructor(spriteSheet, startFrame, endFrame, fps, updateDeltaTime){
            this.spriteSheet = spriteSheet;
            this.startFrame = startFrame;
            this.fps = fps;
            this.frameCount = (endFrame - startFrame) + 1;
            this.dt = updateDeltaTime;
            this.oneFrameTime = 1000 / fps;
            this.currentFrame = 0;
            this.frameTimePassed = 0;
        }

        reset(){
            this.currentFrame = 0;
            this.frameTimePassed = 0;
        }

        update(){
            this.frameTimePassed += this.dt;
            if(this.frameTimePassed >= this.oneFrameTime)
            {
                this.frameTimePassed = this.frameTimePassed - this.oneFrameTime;

                if(this.currentFrame < (this.frameCount - 1))
                {
                    this.currentFrame++;
                }
                else
                {
                    this.currentFrame = 0;
                }
            }
        }

        getCurrentFrame(){
            return this.spriteSheet.getFrame((this.currentFrame + this.startFrame));
        }
    }

    return {
        Constants,
        Point2D,
        Point3D,
        ThreeDimensions,
        Matrix3D,
        Polygon,
        Color,
        Image,
        Rectangle,
        Box,
        Text,
        SpriteSheet,
        Vertex,
        Triangle,
        Mesh
    }
});
define(function(){
    class Point2D{
        constructor(x = 0, y = 0){
            this.x = x;
            this.y = y;
        }

        areEqual(point){
            return this.x == point.x && this.y == point.y;
        }

        toIsometric(){
            return new Point2D((this.x - this.y), ((this.x + this.y) / 2));
        }

        to2D(){
            return new Point2D(((2 * this.y + this.x) / 2), ((2 * this.y - this.x) / 2));
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

        toIsometric(){
            var point = super.toIsometric();
            point.y += this.z;
            return point;
        }

        translate(vector){
            return new Point3D(this.x + vector.x, this.y + vector.y, this.z + vector.z);
        }

        multiply(factor){
            return new Point3D(this.x*factor, this.y*factor, this.z*factor);
        }

        toString(){
            return super.toString() + `, ${this.z}`;
        }
    }

    class Matrix3D extends Array{
        constructor(value = [1, 0, 0, 0,
                              0, 1, 0, 0,
                              0, 0, 1, 0,
                              0, 0, 0, 1]){
            if(value.length != 16){
                throw new Error('Matrix3D value consists of 16 parts');
            }
            super(value);
        }

        transform(point, result){
            let x = (point.x * this[0]) + (point.y * this[4]) + (point.z * this[8]) + (point.w * this[11]);
            let y = (point.x * this[1]) + (point.y * this[5]) + (point.z * this[9]) + (point.w * this[12]);
            let z = (point.x * this[2]) + (point.y * this[6]) + (point.z * this[10]) + (point.w * this[13]);
            let w = (point.x * this[3]) + (point.y * this[7]) + (point.z * this[11]) + (point.w * this[14]);
            result.x = x;
            result.y = y;
            result.z = z;
            result.w = w;
        }

        multiply(matrix, result){
            let mc0r0 = this[0];
            let mc1r0 = this[1];
            let mc2r0 = this[2];
            let mc3r0 = this[3];

            let mc0r1 = this[4];
            let mc1r1 = this[5];
            let mc2r1 = this[6];
            let mc3r1 = this[7];

            let mc0r2 = this[8];
            let mc1r2 = this[9];
            let mc2r2 = this[10];
            let mc3r2 = this[11];

            let mc0r3 = this[12];
            let mc1r3 = this[13];
            let mc2r3 = this[14];
            let mc3r3 = this[15];

            let pc0r0 = matrix[0];
            let pc1r0 = matrix[1];
            let pc2r0 = matrix[2];
            let pc3r0 = matrix[3];

            let pc0r1 = matrix[4];
            let pc1r1 = matrix[5];
            let pc2r1 = matrix[6];
            let pc3r1 = matrix[7];

            let pc0r2 = matrix[8];
            let pc1r2 = matrix[9];
            let pc2r2 = matrix[10];
            let pc3r2 = matrix[11];

            let pc0r3 = matrix[12];
            let pc1r3 = matrix[13];
            let pc2r3 = matrix[14];
            let pc3r3 = matrix[15];

            let c0r0 = (pc0r0 * mc0r0) + (pc0r1 * mc0r1) + (pc0r2 * mc0r2) + (pc0r3 * mc0r3);
            let c0r1 = (pc0r0 * mc1r0) + (pc0r1 * mc1r1) + (pc0r2 * mc1r2) + (pc0r3 * mc1r3);
            let c0r2 = (pc0r0 * mc2r0) + (pc0r1 * mc2r1) + (pc0r2 * mc2r2) + (pc0r3 * mc2r3);
            let c0r3 = (pc0r0 * mc3r0) + (pc0r1 * mc3r1) + (pc0r2 * mc3r2) + (pc0r3 * mc3r3);

            let c1r0 = (pc1r0 * mc0r0) + (pc1r1 * mc0r1) + (pc1r2 * mc0r2) + (pc1r3 * mc0r3);
            let c1r1 = (pc1r0 * mc1r0) + (pc1r1 * mc1r1) + (pc1r2 * mc1r2) + (pc1r3 * mc1r3);
            let c1r2 = (pc1r0 * mc2r0) + (pc1r1 * mc2r1) + (pc1r2 * mc2r2) + (pc1r3 * mc2r3);
            let c1r3 = (pc1r0 * mc3r0) + (pc1r1 * mc3r1) + (pc1r2 * mc3r2) + (pc1r3 * mc3r3);

            let c2r0 = (pc2r0 * mc0r0) + (pc2r1 * mc0r1) + (pc2r2 * mc0r2) + (pc2r3 * mc0r3);
            let c2r1 = (pc2r0 * mc1r0) + (pc2r1 * mc1r1) + (pc2r2 * mc1r2) + (pc2r3 * mc1r3);
            let c2r2 = (pc2r0 * mc2r0) + (pc2r1 * mc2r1) + (pc2r2 * mc2r2) + (pc2r3 * mc2r3);
            let c2r3 = (pc2r0 * mc3r0) + (pc2r1 * mc3r1) + (pc2r2 * mc3r2) + (pc2r3 * mc3r3);

            let c3r0 = (pc3r0 * mc0r0) + (pc3r1 * mc0r1) + (pc3r2 * mc0r2) + (pc3r3 * mc0r3);
            let c3r1 = (pc3r0 * mc1r0) + (pc3r1 * mc1r1) + (pc3r2 * mc1r2) + (pc3r3 * mc1r3);
            let c3r2 = (pc3r0 * mc2r0) + (pc3r1 * mc2r1) + (pc3r2 * mc2r2) + (pc3r3 * mc2r3);
            let c3r3 = (pc3r0 * mc3r0) + (pc3r1 * mc3r1) + (pc3r2 * mc3r2) + (pc3r3 * mc3r3);

            result[0] = c0r0;
            result[1] = c1r0;
            result[2] = c2r0;
            result[3] = c3r0;

            result[4] = c0r1;
            result[5] = c1r1;
            result[6] = c2r1;
            result[7] = c3r1;

            result[8] = c0r2;
            result[9] = c1r2;
            result[10] = c2r2;
            result[11] = c3r2;

            result[12] = c0r3;
            result[13] = c1r3;
            result[14] = c2r3;
            result[15] = c3r3;
        }

        static translation(x, y, z){
            return new Matrix3D(
                [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                x, y, z, 1]);
        }

        static scale(x, y, z){
            return new Matrix3D(
                [x, 0, 0, 0,
                0, y, 0, 0,
                0, 0, z, 0,
                0, 0, 0, 1]);
        }

        static rotateX(a){
            return new Matrix3D(
                [1, 0, 0, 0,
                0, Math.cos(a), -Math.sin(a), 0,
                0, Math.sin(a), Math.cos(a), 0,
                0, 0, 0, 1]);
        }

        static rotateY(a){
            return new Matrix3D(
                [Math.cos(a), 0, Math.sin(a), 0,
                0, 1, 0, 0,
                -Math.sin(a), 0, Math.cos(a), 0,
                0, 0, 0, 1]);
        }

        static rotateZ(a){
            return new Matrix3D(
                [Math.cos(a), -Math.sin(a), 0, 0,
                Math.sin(a), Math.cos(a), 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]);
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
        Point2D,
        Point3D,
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
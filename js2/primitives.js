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
        constructor(x = 0, y = 0, z = 0){
            super(x, y);
            this.z = z;
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
    }

    class Color{
        constructor(r, g, b, a = 0){
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        toCanvasColor() {
            if (this.a) {
                return `rgba(${this.r},${this.b},${this.b},${this.a})`;
            }
            else {
                return `rgb(${this.r},${this.b},${this.b})`;
            }
        }
    }

    class Polygon extends Set{
        constructor(...points){
            for(let point of points){
                this.add(point)
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
        SpriteSheet
    }
});
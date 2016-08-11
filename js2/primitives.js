define(function(){
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

    class Point2D{
        constructor(x, y){
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

        setColor(color){
            this.color = color;
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

    class Point3D extends Point2D{
        constructor(x, y, z = 0){
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
        constructor(image, offsetX, offsetY){
            this.image = image;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
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

    return {
        Point2D,
        Point3D,
        Polygon,
        Color,
        Image,
        Rectangle,
        Box,
        Text
    }
});
import { Angle } from "./math.js";

export class Color{
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

export class Point2D{
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

    rotateUnit(degree, result = new Point2D()) {
        let rad = Angle.toRadian(degree);
        result.x = Math.cos(rad) * this.x + (-1 * Math.sin(rad)) * this.y;
        result.y = Math.sin(rad) * this.x + Math.cos(rad) * this.y;

        return result;
    }

    rotate45Degrees(result = new Point2D()){
        let px = this.y;
        let py = -this.x;

        let x = this.x + px;
        let y = this.y + py;

        result.x = x != 0 ? x / Math.abs(x) : 0;
        result.y = y != 0 ? y / Math.abs(y) : 0;

        return result;
    }

    rotate90Degrees(result = new Point2D()){
        result.x = this.y;
        result.y = -this.x;

        return result;
    }

    rotate135Degrees(result = new Point2D()){
        this.rotate90Degrees(result).rotate45Degrees(result);
        return result;
    }

    rotate180Degrees(result = new Point2D()){
        result.x = -this.x;
        result.y = -this.y;

        return result;
    }

    rotate225Degrees(result = new Point2D()){
        this.rotate180Degrees(result).rotate45Degrees(result);
        return result;
    }

    rotate270Degrees(result = new Point2D()){
        result.x = -this.y;
        result.y = this.x;

        return result;
    }

    rotate315Degrees(result = new Point2D()){
        this.rotate270Degrees(result).rotate45Degrees(result);
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

export class Point3D extends Point2D{
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
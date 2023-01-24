import * as fieldTypes from "../iteration3/componentStorage/fieldTypes.js"

export let pointSchema = {
    x: fieldTypes.Float32,
    y: fieldTypes.Float32,
    z: fieldTypes.Float32,
    r: fieldTypes.Int32,
    g: fieldTypes.Int32,
    b: fieldTypes.Int32
}

export let transformationSchema = {
    matrix: [fieldTypes.Float32, 16]
}

export class Layer {
    constructor(transformation) {
        this.transformation = transformation;
        this.points = new Array();
        this.childLayers = new Array();
    }

    addPoint(point) {
        this.points.push(point);
    }

    addChildLayer(layer) {
        this.childLayers.push(layer);
    }
}
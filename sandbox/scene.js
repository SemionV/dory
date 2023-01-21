import * as fieldTypes from "../iteration3/componentStorage/fieldTypes.js"

export let pointSchema = {
    x: fieldTypes.Float32,
    y: fieldTypes.Float32,
    z: fieldTypes.Float32
}

export let transformationSchema = {
    matrix: [fieldTypes.Float32, 16]
}
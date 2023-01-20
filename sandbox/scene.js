import * as fieldTypes from "../iteration3/componentStorage/fieldTypes.js"

export let pointSchema = {
    x: fieldTypes.Float32,
    y: fieldTypes.Float32,
    z: fieldTypes.Float32
}

export let matrix4x4Schema = [fieldTypes.Float32, 16]
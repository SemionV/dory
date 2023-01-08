import * as fieldTypes from "./fieldTypes.js"

export class FieldMapping {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }

    countSize() {        
    }

    setData(dataView, offset) {
    }

    getData(dataView, offset) {
    }
}

export class PrimitiveFieldMapping extends FieldMapping{
    constructor(fieldName, fieldType) {
        super(fieldName);
        this.fieldType = fieldType;
    }
}

export class ObjectFieldMapping extends FieldMapping {
    constructor(fieldName) {
        super(fieldName);
        this.fieldMappings = new Set();
    }
}

export class ArrayFieldMapping extends FieldMapping {
    constructor(fieldName, itemsType, length) {
        super(fieldName);
        this.itemsType = itemsType;
        this.length = length;
    }
}

export class ComponentMapper {
    static buildMapping(componentSchema) {
        return this.#buildObjectFieldMapping(null, componentSchema);
    }

    static #buildFieldMapping(fieldName, fieldTypeValue) {
        let fieldMapping;

        if(fieldTypeValue) {
            if(fieldTypeValue.prototype instanceof fieldTypes.PrimitiveType) {
                fieldMapping = new PrimitiveFieldMapping(fieldName, fieldTypeValue); 
            }
            else if(typeof fieldTypeValue === 'object' && !Array.isArray(fieldTypeValue)) {
                fieldMapping = this.#buildObjectFieldMapping(fieldName, fieldTypeValue);
            }
            else if(Array.isArray(fieldTypeValue) && fieldTypeValue.length == 2) {
                fieldMapping = this.#buildArrayFieldMapping(fieldName, fieldTypeValue);
            }
        }

        return fieldMapping;
    }

    static #buildObjectFieldMapping(fieldName, fieldTypeValue) {
        let objectFieldMapping = new ObjectFieldMapping(fieldName);

        for (const [key, value] of Object.entries(fieldTypeValue)) {
            let fieldMapping = this.#buildFieldMapping(key, value);
            if(fieldMapping) {
                objectFieldMapping.fieldMappings.add(fieldMapping);
            }
        }

        return objectFieldMapping;
    }

    static #buildArrayFieldMapping(fieldName, fieldTypeValue) {
        let fieldMapping;

        if(fieldTypeValue.length == 2) {
            fieldMapping = new ArrayFieldMapping(fieldName, fieldTypeValue[0], fieldTypeValue[1]);
        }

        return fieldMapping;
    }
}
import * as fieldTypes from "./fieldTypes.js"

export class DataOperationContext {
    dataView;
    offset;
    endian;
}

export class FieldMapping {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }

    build() {   
        this.size = this.getSize(); 
    }

    getSize() {        
    }

    setData(dataOperationContext, data) {
    }

    getData(dataOperationContext, dataInstance) {
    }
}

export class PrimitiveFieldMapping extends FieldMapping{
    constructor(fieldName, fieldType) {
        super(fieldName);
        this.fieldType = fieldType;
    }

    getSize() {
        return this.fieldType.size;        
    }

    setData(dataOperationContext, data) {
        if(!data) {
            data = 0;
        }
        dataOperationContext.dataView[this.fieldType.dataViewSetter](dataOperationContext.offset, data, dataOperationContext.endian);
        dataOperationContext.offset += this.fieldType.size;
    }

    getData(dataOperationContext) {
        let value = dataOperationContext.dataView[this.fieldType.dataViewGetter](dataOperationContext.offset, dataOperationContext.endian);
        dataOperationContext.offset += this.fieldType.size;

        return value;
    }
}

export class ObjectFieldMapping extends FieldMapping {
    constructor(fieldName) {
        super(fieldName);
        this.fieldMappings = new Set();
    }

    getSize() {
        let size = 0;

        for(let fieldMapping of this.fieldMappings) {
            size += fieldMapping.getSize();
        }

        return size;
    }

    setData(dataOperationContext, data) {
        for(let fieldMapping of this.fieldMappings) {
            let value = data ? data[fieldMapping.fieldName] : null;
            fieldMapping.setData(dataOperationContext, value);
        }
    }

    getData(dataOperationContext, dataInstance) {
        if(!dataInstance) {
            dataInstance = {};
        }

        for(let fieldMapping of this.fieldMappings) {
            dataInstance[fieldMapping.fieldName] = fieldMapping.getData(dataOperationContext, dataInstance[fieldMapping.fieldName]);
        }

        return dataInstance;
    }
}

export class ArrayFieldMapping extends FieldMapping {
    constructor(fieldName, itemsType, length) {
        super(fieldName);
        this.itemsType = itemsType;
        this.length = length;
    }

    getSize() {        
        return this.itemsType.size * this.length;
    }

    setData(dataOperationContext, data) {
        for(let i = 0; i < this.length; ++i) {
            let value = data ? data[i] : 0;
            dataOperationContext.dataView[this.itemsType.dataViewSetter](dataOperationContext.offset, value, dataOperationContext.endian);
            dataOperationContext.offset += this.itemsType.size;
        }
    }

    getData(dataOperationContext, dataInstance) {
        if(!dataInstance) {
            dataInstance = new Array(this.length);
        }

        for(let i = 0; i < this.length; ++i) {
            let item = dataOperationContext.dataView[this.itemsType.dataViewGetter](dataOperationContext.offset, dataOperationContext.endian);
            dataInstance[i] = item;
            dataOperationContext.offset += this.itemsType.size;
        }

        return dataInstance;
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
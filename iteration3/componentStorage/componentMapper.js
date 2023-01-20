import * as fieldTypes from "./fieldTypes.js";
import * as mappings from "./mappings.js";


export class ComponentMapper {
    static buildMapping(componentSchema) {
        return this.#buildFieldMapping(null, componentSchema);
    }

    static #buildFieldMapping(fieldName, fieldTypeValue) {
        let fieldMapping;

        if (fieldTypeValue) {
            if (fieldTypeValue.prototype instanceof fieldTypes.PrimitiveType) {
                fieldMapping = this.#buildPrimitiveFieldMapping(fieldName, fieldTypeValue);
            }
            else if (typeof fieldTypeValue === 'object' && !Array.isArray(fieldTypeValue)) {
                fieldMapping = this.#buildObjectFieldMapping(fieldName, fieldTypeValue);
            }
            else if (Array.isArray(fieldTypeValue) && fieldTypeValue.length == 2) {
                fieldMapping = this.#buildArrayFieldMapping(fieldName, fieldTypeValue);
            }
        }

        return fieldMapping;
    }

    static #buildObjectFieldMapping(fieldName, fieldTypeValue) {
        let objectFieldMapping = new mappings.ObjectFieldMapping(fieldName);

        for (const [key, value] of Object.entries(fieldTypeValue)) {
            let fieldMapping = this.#buildFieldMapping(key, value);
            if (fieldMapping) {
                objectFieldMapping.fieldMappings.push(fieldMapping);
            }
        }

        return objectFieldMapping;
    }

    static #buildArrayFieldMapping(fieldName, fieldTypeValue) {
        let fieldMapping;

        if (fieldTypeValue.length == 2) {
            let itemFieldMapping = this.#buildPrimitiveFieldMapping(null, fieldTypeValue[0]);
            fieldMapping = new mappings.ArrayFieldMapping(fieldName, itemFieldMapping, fieldTypeValue[1]);
        }

        return fieldMapping;
    }

    static #buildPrimitiveFieldMapping(fieldName, fieldTypeValue) {
        if(fieldTypeValue === fieldTypes.Int8){
            return new mappings.Int8FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Uint8){
            return new mappings.Uint8FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Int16){
            return new mappings.Int16FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Uint16){
            return new mappings.Uint16FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Int32){
            return new mappings.Int32FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Uint32){
            return new mappings.Uint32FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Uint32){
            return new mappings.Uint32FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Float32){
            return new mappings.Float32FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.BigInt64){
            return new mappings.BigInt64FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.BigUint64){
            return new mappings.BigUint64FieldMapping(fieldName, fieldTypeValue);
        }
        else if(fieldTypeValue === fieldTypes.Float64){
            return new mappings.Float64FieldMapping(fieldName, fieldTypeValue);
        }
    }
}

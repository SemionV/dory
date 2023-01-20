export class FieldMapping {
    constructor(fieldName) {
        this.fieldName = fieldName;
    }

    compile(fieldOffset) {        
    }

    setData(dataView, originOffset, data) {
    }

    getData(dataView, originOffset, instance) {
    }
}

export class ObjectFieldMapping extends FieldMapping {
    constructor(fieldName) {
        super(fieldName);
        this.fieldMappings = []; 
    }

    compile(fieldOffset) {
        fieldOffset = fieldOffset ? fieldOffset : 0;

        this.fieldOffset = fieldOffset;

        let count = this.fieldMappings.length;

        for(let i = 0; i < count; ++i) {
            fieldOffset = this.fieldMappings[i].compile(fieldOffset);
        }

        return fieldOffset;
    }

    setData(dataView, originOffset, data) {
        let count = this.fieldMappings.length;
        let fieldOffset = originOffset + this.fieldOffset;

        for(let i = 0; i < count; ++i) {
            let fieldMapping = this.fieldMappings[i];

            let value = data ? data[fieldMapping.fieldName] : null;
            fieldMapping.setData(dataView, fieldOffset, value);
        }
    }

    getData(dataView, originOffset, instance) {
        if(instance) {
            if(this.fieldName) {
                instance = instance[this.fieldName];
            }
        }
        else {
            instance = {};
        }

        let fieldOffset = originOffset + this.fieldOffset;

        let count = this.fieldMappings.length;
        for(let i = 0; i < count; ++i) {
            let fieldMapping = this.fieldMappings[i];
            instance[fieldMapping.fieldName] = fieldMapping.getData(dataView, fieldOffset, instance);
        }

        return instance;
    }
}

export class ArrayFieldMapping extends FieldMapping {
    constructor(fieldName, itemFieldMapping, length) {
        super(fieldName);
        this.itemFieldMapping = itemFieldMapping;
        this.length = length;
    }

    compile(fieldOffset) {
        fieldOffset = fieldOffset ? fieldOffset : 0;

        this.fieldOffset = fieldOffset;

        return fieldOffset + this.itemFieldMapping.compile(0) * this.length;
    }

    setData(dataView, originOffset, data) {
        let count = this.length;
        let itemOffset = originOffset + this.fieldOffset;
        let itemSize = this.itemFieldMapping.fieldType.size;

        for(let i = 0; i < count; ++i) {
            let value = data ? data[i] : 0;
            this.itemFieldMapping.setData(dataView, itemOffset, value);
            itemOffset += itemSize;
        }
    }

    getData(dataView, originOffset, dataInstance) {
        if(!dataInstance) {
            dataInstance = new Array(this.length);
        }

        let count = this.length;
        let itemOffset = originOffset + this.fieldOffset;
        let itemSize = this.itemFieldMapping.fieldType.size;

        for(let i = 0; i < count; ++i) {
            dataInstance[i] = this.itemFieldMapping.getData(dataView, itemOffset);
            itemOffset += itemSize;
        }

        return dataInstance;
    }
}

export class PrimitiveFieldMapping extends FieldMapping{
    constructor(fieldName, fieldType) {
        super(fieldName);
        this.fieldType = fieldType;
    }

    compile(fieldOffset) {
        this.fieldOffset = fieldOffset;
        return fieldOffset + this.fieldType.size;
    }
}

export class Int8FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setInt8(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getInt8(originOffset + this.fieldOffset, true);
    }
}

export class Uint8FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setUint8(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getUint8(originOffset + this.fieldOffset, true);
    }
}

export class Int16FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setInt16(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getInt16(originOffset + this.fieldOffset, true);
    }
}

export class Int32FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setInt32(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getInt32(originOffset + this.fieldOffset, true);
    }
}

export class Uint32FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setUint32(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getUint32(originOffset + this.fieldOffset, true);
    }
}

export class Float32FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setFloat32(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getFloat32(originOffset + this.fieldOffset, true);
    }
}

export class BigInt64FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setBigInt64(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getBigInt64(originOffset + this.fieldOffset, true);
    }
}

export class BigUint64FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setBigUint64(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getBigUint64(originOffset + this.fieldOffset, true);
    }
}

export class Float64FieldMapping extends PrimitiveFieldMapping{
    setData(dataView, originOffset, data) {
        dataView.setFloat64(originOffset + this.fieldOffset, data, true);
    }

    getData(dataView, originOffset) {
        return dataView.getFloat64(originOffset + this.fieldOffset, true);
    }
}
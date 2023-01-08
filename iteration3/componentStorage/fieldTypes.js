export class FieldType {}

export class PrimitiveType extends FieldType {}

export class Int8 extends PrimitiveType {
    static size = 1;
    static dataViewSetter = 'setInt8';
    static dataViewGetter = 'getInt8';
}

export class Uint8 extends PrimitiveType {
    static size = 1;
    static dataViewSetter = 'setUint8';
    static dataViewGetter = 'getUint8';
}

export class Int16 extends PrimitiveType {
    static size = 2;
    static dataViewSetter = 'setInt16';
    static dataViewGetter = 'getInt16';
}

export class Uint16 extends PrimitiveType {
    static size = 2;
    static dataViewSetter = 'setUint16';
    static dataViewGetter = 'getUint16';
}

export class Int32 extends PrimitiveType {
    static size = 4;
    static dataViewSetter = 'setInt32';
    static dataViewGetter = 'getInt32';
}

export class Uint32 extends PrimitiveType {
    static size = 4;
    static dataViewSetter = 'setUint32';
    static dataViewGetter = 'getUint32';
}

export class Float32 extends PrimitiveType {
    static size = 4;
    static dataViewSetter = 'setFloat32';
    static dataViewGetter = 'getFloat32';
}

export class BigInt64 extends PrimitiveType {
    static size = 8;
    static dataViewSetter = 'setBigInt64';
    static dataViewGetter = 'getBigInt64';
}

export class BigUint64 extends PrimitiveType {
    static size = 8;
    static dataViewSetter = 'setBigUint64';
    static dataViewGetter = 'getBigUint64';
}

export class Float64 extends PrimitiveType {
    static size = 8;
    static dataViewSetter = 'setFloat64';
    static dataViewGetter = 'getFloat64';
}
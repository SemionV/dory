export class FieldType {}

export class PrimitiveType extends FieldType {
}

export class Int8 extends PrimitiveType {
    static size = 1;    
}

export class Uint8 extends PrimitiveType {
    static size = 1;
}

export class Int16 extends PrimitiveType {
    static size = 2;
}

export class Uint16 extends PrimitiveType {
    static size = 2;
}

export class Int32 extends PrimitiveType {
    static size = 4;
}

export class Uint32 extends PrimitiveType {
    static size = 4;
}

export class Float32 extends PrimitiveType {
    static size = 4;
}

export class BigInt64 extends PrimitiveType {
    static size = 8;
}

export class BigUint64 extends PrimitiveType {
    static size = 8;
}

export class Float64 extends PrimitiveType {
    static size = 8;
}
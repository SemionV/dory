import * as fieldTypes from "./fieldTypes.js"

class GameComponentAccess {
    constructor(view){
        this.blockSize = 12;
        this.view = view;
    }

    readId(index) {
        let offset = index * this.blockSize + 0;
        return this.view.getInt32(offset, true);
    }

    writeId(index, value) {
        let offset = index * this.blockSize + 0;
        return this.view.setInt32(offset, value, true);
    }

    readUserId(index) {
        let offset = index * this.blockSize + 4;
        return this.view.getInt32(offset, true);
    }

    writeUserId(index, value) {
        let offset = index * this.blockSize + 4;
        return this.view.setInt32(offset, value, true);
    }

    readAmountDue(index) {
        let offset = index * this.blockSize + 8;
        return this.view.getFloat32(offset, true);
    }

    writeAmountDue(index, value) {
        let offset = index * this.blockSize + 8;
        return this.view.setFloat32(offset, value, true);
    }

    read(index, toInstance) {
        toInstance.id = this.readId(index);
        toInstance.userId = this.readUserId(index);
        toInstance.amountDue = this.readAmountDue(index);
    }

    write(index, instance) {
        this.writeId(index, instance.id);
        this.writeUserId(index, instance.userId);
        this.writeAmountDue(index, instance.amountDue);
    }

    get slotsCount() {
        return this.view.byteLength / this.blockSize;
    }
}

let doryEcsSetupTest = window.doryEcsSetupTest = (componentsNumber) => {
    const buffer = new ArrayBuffer(12 * componentsNumber);
    const view = new DataView(buffer, 0);

    let access = new GameComponentAccess(view);

    for(let i = 0; i < componentsNumber; ++i) {
        access.write(0, {id: i, userId: i + 100, amountDue: i + 0.0});
    }

    return {
        access: access
    }
}

let doryEcsAccessTest = window.doryEcsAccessTest = (setup) => {
    let access = setup.access;
    
    let component = new GameComponent();
    let count = access.slotsCount;

    setup.result = 0;

    console.log(`count: ${count}`);

    let start = performance.now();

    for(let i = 0; i < count; ++i) {
        access.read(i, component);
        
        //setup.result += component.id + component.userId + component.amountDue;
        setup.result += (component.id + component.userId + component.amountDue) / Math.cos(i);
        //let result = (component.id + component.userId + component.amountDue) / Math.cos(i);
    }

    let end = performance.now();

    return end - start;
}

class ComponentStorage {
    constructor(componentsCount, componentSchema) {
        this.componentMapping = this.#buildComponentMapping(componentSchema);
                
        this.buffer = new ArrayBuffer(this.componentMapping.componentSize * componentsCount);
        this.view = new DataView(buffer, 0);
    }
}
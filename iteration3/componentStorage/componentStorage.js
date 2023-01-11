import * as mapping from "./componentMapper.js"

export class ComponentStorage {
    constructor(slotsCount, componentSchema) {
        this.componentMapping = mapping.ComponentMapper.buildMapping(componentSchema);
        this.slotSize = this.componentMapping.compile();
        this.slotsCount = slotsCount;    

        this.buffer = new ArrayBuffer(this.slotSize * slotsCount);
        this.view = new DataView(this.buffer, 0);
    }

    saveComponent(slotIndex, component) {
        this.componentMapping.setData(this.view, slotIndex * this.slotSize, component);
    }

    loadComponent(slotIndex, componentInstance) {
        return this.componentMapping.getData(this.view, slotIndex * this.slotSize, componentInstance);
    }

    forEach(delegate) {
        let count = this.slotsCount;
        let component = {};
        let offset = 0;

        for(let i = 0; i < count; i++) {
            this.componentMapping.getData(this.view, offset, component);

            delegate(component);

            offset += this.slotSize;
        }
    }
}
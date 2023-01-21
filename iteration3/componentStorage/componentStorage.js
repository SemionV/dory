import * as mapping from "./componentMapper.js"

export default class ComponentStorage {
    constructor(slotsCount, componentSchema) {
        this.componentMapping = mapping.ComponentMapper.buildMapping(componentSchema);
        this.slotSize = this.componentMapping.compile();
        this.slotsCount = slotsCount;    

        this.buffer = new ArrayBuffer(this.slotSize * slotsCount);
        this.view = new DataView(this.buffer, 0);

        this.nextAvailableSlot = -1;
    }

    getNextAvailableSlotIndex() {
        return ++this.nextAvailableSlot;
    }

    saveComponent(component, slotIndex) {
        if(slotIndex === undefined) {
            slotIndex = this.getNextAvailableSlotIndex();
        }
        this.componentMapping.setData(this.view, slotIndex * this.slotSize, component);

        return slotIndex;
    }

    loadComponent(slotIndex, componentInstance) {
        return this.componentMapping.getData(this.view, slotIndex * this.slotSize, componentInstance);
    }

    forEach(delegate, componentInstance) {
        let count = this.slotsCount;
        let offset = 0;

        for(let i = 0; i < count; i++) {
            let component = this.componentMapping.getData(this.view, offset, componentInstance);

            delegate(component);

            offset += this.slotSize;
        }
    }
}
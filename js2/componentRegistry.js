class RegistryItem {
    constructor(entityId, component) {
        this.entityId = entityId;
        this.component = component;
    }
}

export class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }

    registerComponent(entityId, component) {
        let list = null;
        if(this.components.has(component.constructor)) {
            list = this.components[component.constructor];
        } 
        else {
            list = new Set();
            this.components.set(component.constructor, list);
        }

        let item = new RegistryItem(entityId, component);
        list.add(item);
    }
}
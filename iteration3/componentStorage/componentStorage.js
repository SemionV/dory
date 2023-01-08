class ComponentStorage {
    constructor(componentsCount, componentSchema) {
        this.componentMapping = this.#buildComponentMapping(componentSchema);
                
        this.buffer = new ArrayBuffer(this.componentMapping.componentSize * componentsCount);
        this.view = new DataView(buffer, 0);
    }
}
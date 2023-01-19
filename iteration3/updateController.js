export default class UpdateController {
    constructor(/*inject services*/) {
        this.children = new Set();
    }

    start() {
        for(let controller of this.children) {
            controller.start();
        }
    }

    stop() {        
        for(let controller of this.children) {
            controller.stop();
        }
    }

    addChildController(controller) {        
        this.children.add(controller); 
    }

    update(timeStep) {
        for(let controller of this.children) {
            controller.update(timeStep);
        }
    }
}
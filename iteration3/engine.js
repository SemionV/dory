export default class Engine {
    constructor(inputSystem) {
        this.controllers = new Set();
        this.inputSystem = inputSystem;
    }

    addController(controller) {        
        this.controllers.add(controller); 
    }

    run(context) {
        this.context = context;

        this.inputSystem.attach(context);

        for(let controller of this.controllers) {
            controller.initialize(this.context);
        }

        this.#requestFrame();
    }

    stop(){
        this.isDone = true;

        this.inputSystem.detach();

        for(let controller of this.controllers) {
            controller.stop(this.context);
        }

        this.context = null;
    }

    #requestFrame() {
        return window.requestAnimationFrame((timestamp) => {
            if(!this.previousTimestamp) {
                this.previousTimestamp = timestamp;
            }
    
            let timeStep = timestamp - this.previousTimestamp;
    
            for(let controller of this.controllers) {
                controller.update(timeStep, this.context);
            }
    
            if (!this.isDone) {
                this.#requestFrame();
            }
    
            this.previousTimestamp = timestamp;
        });
    }
}
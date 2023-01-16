export default class Engine {
    constructor(application) {
        this.application = application;
    }

    run() {
        this.#requestFrame();
    }

    stop(){
        this.isDone = true;
    }

    #requestFrame() {
        let context = this;
        return window.requestAnimationFrame((timestamp) => {context.animationFrame(timestamp)});
    }

    animationFrame(timestamp) {
        if(!this.previousTimestamp) {
            this.previousTimestamp = timestamp;
        }

        let timeStep = timestamp - this.previousTimestamp;

        this.application.update(timeStep);

        if (!this.isDone) {
            this.#requestFrame();
        }

        this.previousTimestamp = timestamp;
    }
}
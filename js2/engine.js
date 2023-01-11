import * as events from "./events.js";
import * as input from "./input.js";

export class EngineConfig{
    constructor(fps = 60, profile = false){
        this.fps = fps;
        this.profile = profile;
    }
}

export class FpsUpdatedEvent extends events.Event{
    constructor(name, fps){
        super(name);
        this.fps = fps;
    }
}

class Frame{
    constructor(){
        this.index = 0;
        this.startTime = 0;
        this.endTime = 0;
        this.accumulatorValue = 0;
        this.passedTime = 0;
        this.updateStartTime = 0;
        this.updateEndTime = 0;
        this.drawStartTime = 0;
        this.drawEndTime = 0;
        this.numberOfUpdates = 0;
    }

    get duration(){
        return this.endTime - this.startTime;
    }

    get durationUpdate(){
        return this.updateEndTime - this.updateStartTime;
    }

    get durationDraw(){
        return this.drawEndTime - this.drawStartTime;
    }
}

export class Engine{
    constructor(config){
        this.isDone = false;

        this.eventsManager = new events.EventsManager();
        this.inputManager = new input.InputManager();
        this.config = config;

        this.updateDeltaTime = 1000 / config.fps;

        this.frameCount = 0;
        this.timePassedSinceFrameUpdate = 0;
    }

    setHeart(heart){
        this.heart = heart;
    }

    *getTooLongFrames(){
        for(let frame of this.profile){
            if(frame.duration > this.updateDeltaTime){
                yield frame;
            }
        }
    }

    *getAfterTooLongFrames(){
        for(let frame of this.profile){
            if(frame.passedTime > this.updateDeltaTime){
                yield frame;
            }
        }
    }

    *getMultiUpdateFrames(){
        for(let frame of this.profile){
            if(frame.numberOfUpdates > 1){
                yield frame;
            }
        }
    }

    requestFrame() {
        let context = this;
        return window.requestAnimationFrame((timestamp) => {context.animationUpdate(timestamp)});
    }

    setActiveScene(scene) {
        this.scene = scene;
    }

    run() {
        this.inputManager.subscribe();

        this.requestFrame();
    }

    animationUpdate(timestamp) {
        this.frameCount++;
        
        if(!this.previousTimestamp) {
            this.previousTimestamp = timestamp;
        }

        let passedTime = timestamp - this.previousTimestamp;

        this.update(passedTime);
        this.draw();
        
        if (this.timePassedSinceFrameUpdate >= 1000) {
            this.currentFPS = this.frameCount;
            this.frameCount = 0;
            this.timePassedSinceFrameUpdate = 0;

            this.eventsManager.pushEvent(new FpsUpdatedEvent('fps.updated', this.currentFPS));
        }
        else {
            this.timePassedSinceFrameUpdate += passedTime;
        }

        if (!this.isDone) {
            this.requestFrame();
        }

        this.previousTimestamp = timestamp;
    }

    stop(){
        this.inputManager.unsubscribe();
        this.isDone = true;
    }

    update() {
        var events = this.eventsManager.swap();
        if (this.scene) {
            this.scene.update(events);
        }
    }

    draw() {
        if (this.scene) {
            this.scene.draw();
        }
    }
}


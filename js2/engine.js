define(['events', 'input'], function(events, input){
    class EngineConfig{
        constructor(fps = 60, profile = false){
            this.fps = fps;
            this.profile = profile;
        }
    }

    class FpsUpdatedEvent extends events.Event{
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

    class Engine{
        constructor(config){
            this.isStop = false;

            this.eventsManager = new events.EventsManager();
            this.inputManager = new input.InputManager();
            this.config = config;

            var deltaTime = 1000 / this.config.fps;
            this.updateDeltaTime = deltaTime;
            this.maxDeltaTime = deltaTime * 2;

            this.profile = [];
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

        createHeart(fps) {
            var raF = window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame;

            var timeout = (callback) => {
                window.setTimeout(callback, this.updateDeltaTime);
            };

            if (this.heart) {
                return this.heart;
            }
            else if (fps) {
                return timeout;
            }
            else if (raF) {
                return raF;
            }

            return timeout;
        }

        setActiveScene(scene) {
            this.scene = scene;
        }

        run() {
            this.inputManager.subscribe();

            var heart = this.createHeart();

            var now = Date.now();
            var last = null;
            var passed = 0;
            var accumulator = 0;
            var dt = this.updateDeltaTime;
            var frameCount = 0;
            var frameCountStartDate = now;

            var heartBeat = () => {
                now = Date.now();

                frameCount++;
                var frameInfo = new Frame();
                frameInfo.index = this.profile.length;
                frameInfo.startTime = now;

                if(!last){
                    last = now;
                }
                passed = now - last;
                frameInfo.passedTime = passed;
                if (passed > this.maxDeltaTime) {
                    passed = this.maxDeltaTime;
                }
                last = now;
                accumulator += passed;

                frameInfo.accumulatorValue = accumulator;

                frameInfo.updateStartTime = Date.now();
                let numberOfUpdates = 0;
                while (accumulator >= dt) {
                    this.update();
                    numberOfUpdates++;
                    accumulator -= dt;
                }
                frameInfo.updateEndTime = Date.now();
                frameInfo.numberOfUpdates = numberOfUpdates;

                frameInfo.drawStartTime = Date.now();
                this.draw();
                frameInfo.drawEndTime = Date.now()

                if ((now - frameCountStartDate) >= 1000) {
                    frameCountStartDate = now;
                    this.currentFPS = frameCount;
                    frameCount = 0;

                    this.eventsManager.pushEvent(new FpsUpdatedEvent('fps.updated', this.currentFPS));
                }

                if (!this.isStop) {
                    heart.call(window, heartBeat);
                }
                else {
                    this.isStop = false;
                }

                if(this.config.profile){
                    this.profile.push(frameInfo);
                }

                frameInfo.endTime = Date.now();
            };

            //it is necessary to update scene once before main loop
            this.update();

            this.heartBeat = heartBeat;
            heart.call(window, heartBeat);
        }

        stop(){
            this.inputManager.unsubscribe();
            this.isStop = true;
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

    return {
        Engine,
        EngineConfig,
        FpsUpdatedEvent
    };
});

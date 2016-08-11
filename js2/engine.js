define(['events', 'input'], function(events, input){
    class EngineConfig{
        constructor(fps = 60){
            this.fps = fps;
        }
    }

    class InputEvent extends events.Event{
        constructor(name, key){
            super(name);
            this.key = key;
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
        }

        setHeart(heart){
            this.heart = heart;
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
            this.inputListener = (actionName, key) => {
                this.eventsManager.pushEvent(new InputEvent(actionName, key));
            };
            this.inputManager.addListener(this.inputListener);

            var heart = this.createHeart(this.config.fps);

            var now = Date.now();
            var last = now;
            var passed = 0;
            var accumulator = 0;
            var dt = this.updateDeltaTime;
            var frameCount = 0;
            var frameCountStartDate = now;

            var heartBeat = () => {
                frameCount++;

                now = Date.now();
                passed = now - last;
                if (passed > this.maxDeltaTime) {
                    passed = this.maxDeltaTime;
                }
                last = now;
                accumulator += passed;

                while (accumulator >= dt) {
                    self.update();
                    accumulator -= dt;
                }

                this.draw();

                if ((now - frameCountStartDate) >= 1000) {
                    frameCountStartDate = now;
                    this.currentFPS = frameCount;
                    frameCount = 0;

                    this.eventsManager.pushSimpleEvent("fps.updated");
                }

                if (!this.isStop) {
                    heart.call(window, heartBeat);
                }
                else {
                    this.isStop = false;
                }
            };

            heart.call(window, heartBeat);
        }

        stop(){
            this.inputManager.removeListener(this.inputListener);
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
        Engine
    };
});

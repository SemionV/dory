define(['events', 'input'], function(events, input){
    class Engine{
        constructor(){
            this.isStop = false;

            this.eventsManager = new events.EventsManager();
            this.inputManager = new input.InputManager();
        }
    }

    Engine.method("setHeart", function(heart)
    {
        this.heart = heart;
    });

    Engine.method("createHeart", function(fps)
    {
        var raF = window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame;

        var timeout = function(callback)
        {
            window.setTimeout(callback, 1000 / fps);
        };

        if(this.heart)
        {
            return this.heart;
        }
        else if(fps)
        {
            return timeout;
        }
        else if(raF)
        {
            return raF;
        }

        return timeout;
    });

    Engine.method("setActiveScene", function(scene)
    {
        this.scene = scene;
    });

    Engine.method("run", function()
    {
        this.inputManager.subscribe();
        this.inputManager.addListener({ctx: this, func: this.onInput});

        var self = this;
        var heart = this.createHeart(spqr.Context.config.fps);

        var now = Date.now();
        var last = now;
        var passed = 0;
        var accumulator = 0;
        var dt = spqr.Context.config.updateDeltaTime;
        var frameCount = 0;
        var frameCountStartDate = now;

        var heartBeat = function()
        {
            frameCount++;

            now = Date.now();
            passed = now - last;
            if(passed > spqr.Context.config.maxDeltaTime)
            {
                passed = spqr.Context.config.maxDeltaTime;
            }
            last = now;
            accumulator += passed;

            while(accumulator >= dt)
            {
                self.update();
                accumulator -= dt;
            }

            self.draw();

            if((now - frameCountStartDate) >= 1000)
            {
                frameCountStartDate = now;
                self.currentFPS = frameCount;
                frameCount = 0;

                self.eventsManager.pushSimpleEvent("fps.updated");
            }

            if(!self.isStop)
            {
                heart.call(window, heartBeat);
            }
            else
            {
                self.isStop = false;
            }
        };

        heart.call(window, heartBeat);
    });

    Engine.method("stop", function()
    {
        this.inputManager.removeListener(this.onInput);
        this.inputManager.unsubscribe();
        this.isStop = true;
    });

    Engine.method("onInput", function(actionName, key)
    {
        var event = this.eventsManager.createEvent(actionName);
        event.key = key;
        this.eventsManager.pushEvent(event);
    });

    Engine.method("update", function()
    {
        var events = this.eventsManager.swap();
        if(this.scene)
        {
            this.scene.update(events);
        }
    });

    Engine.method("draw", function()
    {
        if(this.scene)
        {
            this.scene.draw();
        }
    });

    spqr.Engine = Engine;
});

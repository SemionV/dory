(function()
{
    var Engine = function(inputManager, eventsManager)
    {
        this.inputManager = inputManager;
        this.eventsManager = eventsManager;
        this.isStop = false;

        /*settings*/
        this.fps = 60;
    };

    Engine.method("createHeart", function(fps)
    {
        return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback)
            {
                window.setTimeout(callback, 1000 / fps);
            };
    });

    Engine.method("setActiveScene", function(scene)
    {
        this.scene = scene;
    });

    Engine.method("run", function()
    {
        var self = this;
        var heart = this.createHeart(this.fps);

        this.inputManager.addListener({ctx: this, func: this.onInput});

        var heartBeat = function()
        {
            self.processEvents();
            self.draw();

            if(!this.isStop)
            {
                heart.call(window, heartBeat);
            }
            else
            {
                this.isStop = false;
            }
        };

        heart.call(window, heartBeat);
    });

    Engine.method("stop", function()
    {
        this.inputManager.removeListener(this.onInput);
        this.isStop = true;
    });

    Engine.method("onInput", function(actionName)
    {
        var event = this.eventsManager.createEvent(actionName);
        this.eventsManager.pushEvent(event);
    });

    Engine.method("processEvents", function()
    {
        var events = this.eventsManager.swap();

        for(var i = 0, l = events.length; i < l; i++)
        {
            if(this.scene)
            {
                var action = this.scene.getAction(events[i]);
                if(action)
                {
                    action.call(this.scene);
                }
            }
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
})();

(function()
{
    var Engine = function(inputManager)
    {
        this.inputManager = inputManager;
        this.userInput = [];
        this.isStop = false;

        /*settings*/
        this.fps = 60;
    }

    Engine.method("createHeart", function(fps)
    {
        return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element)
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
            self.processUserInput();
            self.draw();

            if(!this.isStop)
            {
                heart.call(window, heartBeat);
            }
            else
            {
                this.isStop = false;
            }
        }

        heart.call(window, heartBeat);
    });

    Engine.method("stop", function()
    {
        this.inputManager.removeListener(this.onInput);
        this.isStop = true;
    });

    Engine.method("onInput", function(actionName)
    {
        this.userInput.push(actionName);
    });

    Engine.method("processUserInput", function()
    {
        for(var i = 0, l = this.userInput.length; i < l; i++)
        {
            if(this.scene)
            {
                var action = this.scene.getAction(this.userInput[i]);
                if(action)
                {
                    action.call(this.scene);
                }
            }
        }

        this.userInput = [];
    });

    Engine.method("draw", function()
    {
        if(this.scene)
        {
            this.scene.draw();
        }
    });

    spqr.Engine = Engine;
})()

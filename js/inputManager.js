(function()
{
    var InputManager = function()
    {
        this.listeners = [];

        this.keyboardMap =
        {
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
    }

    InputManager.method("removeListener", function(listener)
    {
        var list = [];

        for(var i = 0, l = this.listeners.length; i < l; i++)
        {
            var item = this.listeners[i];
            if(item !== listener)
            {
                list.push(item);
            }
        }

        this.listeners = list;
    });

    InputManager.method("addListener", function(listener)
    {
        this.listeners.push(listener);
    });

    InputManager.method("notify", function(eventName)
    {
        for(var i = 0, l = this.listeners.length; i < l; i++)
        {
            var listener = this.listeners[i];
            listener.func.call(listener.ctx, eventName);
        }
    });

    InputManager.method("subscribe", function()
    {
        var self = this;
        document.body.addEventListener("keydown", function(e)
        {
            var code = self.keyboardMap[e.keyCode];
            if(code)
            {
                self.notify("keypress." + code);
            }
        });
    });

    InputManager.method("unsubscribe", function()
    {
        document.body.removeEventListener("keydown");
    });

    spqr.InputManager = InputManager;
})();

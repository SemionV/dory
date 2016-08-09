(function()
{
    var InputManager = function()
    {
        this.listeners = [];

        this.keyboardState =
        {
            "left": false,
            "up": false,
            "right": false,
            "down": false
        };

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

    InputManager.method("notify", function(eventName, key)
    {
        for(var i = 0, l = this.listeners.length; i < l; i++)
        {
            var listener = this.listeners[i];
            listener.func.call(listener.ctx, eventName, key);
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
                if(!self.keyboardState[code])
                {
                    self.keyboardState[code] = true;
                    self.notify("keydown", code);
                }
            }
        });
        document.body.addEventListener("keyup", function(e)
        {
            var code = self.keyboardMap[e.keyCode];
            if(code)
            {
                if(self.keyboardState[code])
                {
                    self.keyboardState[code] = false;
                    self.notify("keyup", code);
                }
            }
        });
    });

    InputManager.method("getKeyState", function(key)
    {
        return this.keyboardState[key];
    });

    InputManager.method("unsubscribe", function()
    {
        document.body.removeEventListener("keydown");
    });

    spqr.InputManager = InputManager;
})();

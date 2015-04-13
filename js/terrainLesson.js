(function()
{
    var MoveLeftState = function()
    {
        this.name = "MoveLeft";

        this.dx = 0;

        this.chair = spqr.Context.getScene().getEntity("chair");
        this.startX = this.chair.translation.x;
        this.endX = this.startX - 50;
    };
    MoveLeftState.inherits(spqr.States.State);

    MoveLeftState.method("processEvents", function(events)
    {
        this.chair.translation.x--;

        if(this.chair.translation.x == this.endX)
        {
            return null;
        }

        return this;
    });

    var MoveRightState = function()
    {
        this.name = "MoveRight";

        this.dx = 0;

        this.chair = spqr.Context.getScene().getEntity("chair");
        this.startX = this.chair.translation.x;
        this.endX = this.startX + 50;
    };
    MoveRightState.inherits(spqr.States.State);

    MoveRightState.method("processEvents", function(events)
    {
        this.chair.translation.x++;

        if(this.chair.translation.x == this.endX)
        {
            return null;
        }

        return this;
    });

    var MoveUpState = function()
    {
        this.name = "MoveUp";

        this.dx = 0;

        this.chair = spqr.Context.getScene().getEntity("chair");
        this.startY = this.chair.translation.y;
        this.endY = this.startY - 50;
    };
    MoveUpState.inherits(spqr.States.State);

    MoveUpState.method("processEvents", function(events)
    {
        this.chair.translation.y--;

        if(this.chair.translation.y == this.endY)
        {
            return null;
        }

        return this;
    });

    var MoveDownState = function()
    {
        this.name = "MoveDown";

        this.dx = 0;

        this.chair = spqr.Context.getScene().getEntity("chair");
        this.startY = this.chair.translation.y;
        this.endY = this.startY + 50;
    };
    MoveDownState.inherits(spqr.States.State);

    MoveDownState.method("processEvents", function(events)
    {
        this.chair.translation.y++;

        if(this.chair.translation.y == this.endY)
        {
            return null;
        }

        return this;
    });

    var IdleState = function()
    {
        this.name = "Idle";
    };
    IdleState.inherits(spqr.States.State);

    IdleState.method("processEvents", function(events)
    {
        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];

            if(event.name == "keypress.left")
            {
                return new MoveLeftState();
            }
            if(event.name == "keypress.right")
            {
                return new MoveRightState();
            }
            if(event.name == "keypress.up")
            {
                return new MoveUpState();
            }
            if(event.name == "keypress.down")
            {
                return new MoveDownState();
            }
        }

        return this;
    });

    spqr.TerrainLesson = {};
    spqr.TerrainLesson.IdleState = IdleState;
})();
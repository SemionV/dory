(function()
{
    var UnitMovementComponent = function()
    {
        this.stateStack = new spqr.States.StateStack();
        this.stateStack.push(new IdleState());
    }
    UnitMovementComponent.inherits(spqr.Scene.EntityComponent);

    UnitMovementComponent.method("update", function(entity, events)
    {
        this.stateStack.update(events);

        var state = this.stateStack.getState();
        if(state instanceof WalkState)
        {
            var speed = 1;
            var direction = state.direction;
            var dx = direction.x * speed;
            var dy = direction.y * speed;

            entity.translation.x += dx;
            entity.translation.y += dy;
        }
    });

    var IdleState = function()
    {
    };
    IdleState.inherits(spqr.States.State);

    IdleState.method("update", function(events)
    {
        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];

            if(event.name == "keypress.left")
            {
                return new WalkState(spqr.Basic.Point2D.directionToPoint3D("W"));
            }
            if(event.name == "keypress.right")
            {
                return new WalkState(spqr.Basic.Point2D.directionToPoint3D("E"));
            }
            if(event.name == "keypress.up")
            {
                return new WalkState(spqr.Basic.Point2D.directionToPoint3D("N"));
            }
            if(event.name == "keypress.down")
            {
                return new WalkState(spqr.Basic.Point2D.directionToPoint3D("S"));
            }
        }

        return this;
    });

    var WalkState = function(direction)
    {
        this.direction = direction;
    };
    WalkState.inherits(spqr.States.State);

    WalkState.method("update", function(events)
    {
        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];

            if(event.name.indexOf("keyup") == 0)
            {
                return null;
            }
        }

        return this;
    });

    spqr.Aragorn = {};
    spqr.Aragorn.UnitMovementComponent = UnitMovementComponent;
})();

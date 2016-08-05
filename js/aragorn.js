(function()
{
    var EntityMovementComponent = function()
    {
    }
    Loop.inherits(spqr.States.State);

    var EntityMovementComponent = function()
    {
    }
    EntityMovementComponent.inherits(spqr.Scene.EntityComponent);

    OutOfMapComponent.method("update", function(entity, events)
    {
        var position = entity.translation;
        var terrain = spqr.Context.engine.scene.terrains["main"];

        if(position.x < 0 || position.x > terrain.width || position.y < 0 || position.y > terrain.height)
        {
            this.isOut = true;
            spqr.Context.engine.eventsManager.pushSimpleEvent("entity " + entity.name + " is out of map");
        }
        else if(this.isOut)
        {
            spqr.Context.engine.eventsManager.pushSimpleEvent("entity " + entity.name + " is in map");
        }
    });
})();

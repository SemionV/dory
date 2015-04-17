(function()
{
    var EntityPath = function(entity, path, speed)
    {
        this.name = "EntityPath";

        this.pathStates = [];
        var tileWidth = spqr.Context.tileWidth;
        var tileHeight = spqr.Context.tileHeight;
        var tileAltitude = spqr.Context.tileAltitude;
        var pos = entity.translation;

        for(var i = 0, l = path.length; i < l; i++)
        {
            var direction = path[i];

            var x = direction.x ? pos.x + (direction.x * tileWidth) : pos.x;
            var y = direction.y ? pos.y + (direction.y * tileHeight) : pos.y;
            var z = direction.z ? pos.z + (direction.z * tileAltitude) : pos.z;

            var lastPoint = new spqr.Basic.Point3D(x, y, z);
            this.pathStates.push(new MoveEntity(entity, pos, lastPoint, speed));

            pos = lastPoint;
        }
    };
    EntityPath.inherits(spqr.States.State);

    EntityPath.method("update", function(events)
    {
        var nextState = this.pathStates.length > 0 ? this.pathStates[0] : null;
        if(nextState)
        {
            this.pathStates.shift();
        }

        return nextState;
    });

    var MoveEntity = function(entity, startPoint, targetPoint, speed)
    {
        this.name = "MoveEntity";

        this.entity = entity;
        this.point = targetPoint;
        var dt = spqr.Context.config.updateDeltaTime;
        var dS = (speed / 1000) * dt;

        var currentPosition = this.position = startPoint;
        if(currentPosition.x != targetPoint.x)
        {
            var moveX = targetPoint.x - currentPosition.x;
            this.dx = moveX < 0 ? dS * (-1) : dS;
        }

        if(currentPosition.y != targetPoint.y)
        {
            var moveY = targetPoint.y - currentPosition.y;
            this.dy = moveY < 0 ? dS * (-1) : dS;
        }

        if(currentPosition.z != targetPoint.z)
        {
            var moveZ = targetPoint.z - currentPosition.z;
            this.dz = moveZ < 0 ? dS * (-1) : dS;
        }
    };
    MoveEntity.inherits(spqr.States.State);

    MoveEntity.method("getDelta", function(delta, currentPos, targetPos)
    {
        var dPos = 0;

        if(delta > 0)
        {
            if(currentPos < targetPos)
            {
                var result = currentPos + delta;
                if(result > targetPos)
                {
                    dPos = targetPos - currentPos;
                }
                else
                {
                    dPos = delta;
                }
            }
        }
        else if(delta < 0)
        {
            if(currentPos > targetPos)
            {
                var result = currentPos + delta;
                if(result < targetPos)
                {
                    dPos = targetPos - currentPos;
                }
                else
                {
                    dPos = delta;
                }
            }
        }

        return dPos;
    });

    MoveEntity.method("update", function(events)
    {
        var position = this.position;
        var point = this.point;

        position.x += this.getDelta(this.dx, position.x, point.x);
        position.y += this.getDelta(this.dy, position.y, point.y);
        position.z += this.getDelta(this.dz, position.z, point.z);

        this.entity.translation = position;

        if(position.x == point.x && position.y == point.y && position.z == point.z)
        {
            return null;
        }

        return this;
    });

    var IdleState = function(entity)
    {
        this.name = "Idle";
        this.entity = entity;
    };
    IdleState.inherits(spqr.States.State);

    IdleState.method("getMoveEntityState", function(direction, speed)
    {
        var pos = this.entity.translation;
        var tileWidth = spqr.Context.tileWidth;
        var tileHeight = spqr.Context.tileHeight;
        var tileAltitude = spqr.Context.tileAltitude;
        var x = direction.x ? pos.x + (direction.x * tileWidth) : pos.x;
        var y = direction.y ? pos.y + (direction.y * tileHeight) : pos.y;
        var z = direction.z ? pos.z + (direction.z * tileAltitude) : pos.z;

        return new MoveEntity(this.entity, pos, new spqr.Basic.Point3D(x, y, z), speed);
    });

    IdleState.method("update", function(events)
    {
        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];

            if(event.name == "keypress.left")
            {
                return this.getMoveEntityState(new spqr.Basic.Point3D(-1, 0, 0), spqr.Context.tileWidth * 2);
            }
            if(event.name == "keypress.right")
            {
                return this.getMoveEntityState(new spqr.Basic.Point3D(1, 0, 0), spqr.Context.tileWidth * 2);
            }
            if(event.name == "keypress.up")
            {
                return this.getMoveEntityState(new spqr.Basic.Point3D(0, -1, 0), spqr.Context.tileHeight * 2);
            }
            if(event.name == "keypress.down")
            {
                return this.getMoveEntityState(new spqr.Basic.Point3D(0, 1, 0), spqr.Context.tileHeight * 2);
            }
            if(event.name == "player.path")
            {
                return new EntityPath(this.entity, event.path, spqr.Context.tileHeight * 2);
            }
        }

        return this;
    });

    spqr.TerrainLesson = {};
    spqr.TerrainLesson.IdleState = IdleState;
    spqr.TerrainLesson.EntityPath = EntityPath;
})();
(function()
{
    var Loop = function(states, repeatCount, infinite)
    {
        this.name = "Loop";

        this.states = states;
        this.index = 0;
        this.count = 0;
        this.repeatCount = repeatCount;
        this.infinite = infinite;
    }
    Loop.inherits(spqr.States.State);

    Loop.method("update", function(events)
    {
        if(!this.infinite)
        {
            if(this.count >= this.repeatCount)
            {
                return null;
            }
        }

        var length = this.states.length;
        if(length > 0 && this.index < length)
        {
            var state = this.states[this.index];

            this.index++;

            if(this.index >= length)
            {
                this.index = 0;
                this.count++;
            }

            return state;
        }

        return null;
    });

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
        this.startPoint = new spqr.Basic.Point3D(startPoint.x, startPoint.y, startPoint.z)
        this.targetPoint = targetPoint;
        var dt = spqr.Context.config.updateDeltaTime;
        var dS = parseFloat(((speed / 1000) * dt).toFixed(1));

        if(startPoint.x != targetPoint.x)
        {
            var moveX = targetPoint.x - startPoint.x;
            this.dx = moveX < 0 ? dS * (-1) : dS;
        }

        if(startPoint.y != targetPoint.y)
        {
            var moveY = targetPoint.y - startPoint.y;
            this.dy = moveY < 0 ? dS * (-1) : dS;
        }

        if(startPoint.z != targetPoint.z)
        {
            var moveZ = targetPoint.z - startPoint.z;
            this.dz = moveZ < 0 ? dS * (-1) : dS;
        }
    };
    MoveEntity.inherits(spqr.States.State);

    MoveEntity.method("activate", function()
    {
        this.currentPoint = new spqr.Basic.Point3D(this.startPoint.x, this.startPoint.y, this.startPoint.z);
    });

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
        var currentPoint = this.currentPoint;
        var targetPoint = this.targetPoint;

        var dx = this.getDelta(this.dx, currentPoint.x, targetPoint.x);
        currentPoint.x += dx;
        var dy = this.getDelta(this.dy, currentPoint.y, targetPoint.y);
        currentPoint.y += dy;
        var dz = this.getDelta(this.dz, currentPoint.z, targetPoint.z);
        currentPoint.z += dz;

        //console.log(this.entity.name +  " - dx:" + dx + "(" + currentPoint.x + ")" + " dy:" + dy + "(" + currentPoint.y + ")" + " dz:" + dz + "(" + currentPoint.z + ")");

        this.entity.translation = currentPoint;

        if(currentPoint.x == targetPoint.x && currentPoint.y == targetPoint.y && currentPoint.z == targetPoint.z)
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
            if(event.name == "player.loop")
            {
                var path = [{x: 0, y: 1, z: 0}, {x: 0, y: 1, z: 0}, {x: 1, y: 0, z: 0}, {x: 1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: -1, z: 0}, {x: -1, y: 0, z: 0}, {x: -1, y: 0, z: 0}];
                var pathStates = [];
                var tileWidth = spqr.Context.tileWidth;
                var tileHeight = spqr.Context.tileHeight;
                var tileAltitude = spqr.Context.tileAltitude;
                var pos = this.entity.translation;

                for(var i = 0, l = path.length; i < l; i++)
                {
                    var direction = path[i];

                    var x = direction.x ? pos.x + (direction.x * tileWidth) : pos.x;
                    var y = direction.y ? pos.y + (direction.y * tileHeight) : pos.y;
                    var z = direction.z ? pos.z + (direction.z * tileAltitude) : pos.z;

                    var lastPoint = new spqr.Basic.Point3D(x, y, z);
                    pathStates.push(new MoveEntity(this.entity, pos, lastPoint, spqr.Context.tileHeight * 2));

                    pos = lastPoint;
                }

                return new Loop(pathStates, 5, true);
            }
        }

        return this;
    });

    spqr.TerrainLesson = {};
    spqr.TerrainLesson.IdleState = IdleState;
})();
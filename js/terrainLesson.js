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
            this.pathStates.push(new MoveHero(entity, pos, lastPoint, speed));

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

        currentPoint.x = ((currentPoint.x * 10) + (this.getDelta(this.dx, currentPoint.x, targetPoint.x)) * 10) / 10;
        currentPoint.y = ((currentPoint.y * 10) + (this.getDelta(this.dy, currentPoint.y, targetPoint.y)) * 10) / 10;
        currentPoint.z = ((currentPoint.z * 10) + (this.getDelta(this.dz, currentPoint.z, targetPoint.z)) * 10) / 10;

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

        var spriteSheet = new spqr.Resources.SpriteSheet(spqr.Context.resources.images["warrior_spritesheet1"], 96, 96);

        this.animationLookingNE = new spqr.Resources.Animation(spriteSheet, 0, 12, 8);
        spriteSheet.setFramesOffset(0, 12, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingNW = new spqr.Resources.Animation(spriteSheet, 13, 25, 8);
        spriteSheet.setFramesOffset(13, 25, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingN = new spqr.Resources.Animation(spriteSheet, 26, 38, 8);
        spriteSheet.setFramesOffset(26, 38, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingW = new spqr.Resources.Animation(spriteSheet, 39, 51, 8);
        spriteSheet.setFramesOffset(39, 51, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingSE = new spqr.Resources.Animation(spriteSheet, 52, 64, 8);
        spriteSheet.setFramesOffset(52, 64, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingE = new spqr.Resources.Animation(spriteSheet, 65, 77, 8);
        spriteSheet.setFramesOffset(65, 77, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingS = new spqr.Resources.Animation(spriteSheet, 78, 90, 8);
        spriteSheet.setFramesOffset(78, 90, spqr.Context.tileWidth, spqr.Context.tileHeight);

        this.animationLookingSW = new spqr.Resources.Animation(spriteSheet, 91, 103, 8);
        spriteSheet.setFramesOffset(91, 103, spqr.Context.tileWidth, spqr.Context.tileHeight);
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

        return new MoveHero(this.entity, pos, new spqr.Basic.Point3D(x, y, z), speed);
    });

    IdleState.method("activate", function()
    {
        var direction = spqr.Basic.Point2D.getDirection(this.entity.direction);
        if(direction == "N")
        {
            this.entity.setAnimation(this.animationLookingN);
        }
        else if(direction == "NE")
        {
            this.entity.setAnimation(this.animationLookingNE);
        }
        else if(direction == "E")
        {
            this.entity.setAnimation(this.animationLookingE);
        }
        else if(direction == "SE")
        {
            this.entity.setAnimation(this.animationLookingSE);
        }
        else if(direction == "S")
        {
            this.entity.setAnimation(this.animationLookingS);
        }
        else if(direction == "SW")
        {
            this.entity.setAnimation(this.animationLookingSW);
        }
        else if(direction == "W")
        {
            this.entity.setAnimation(this.animationLookingW);
        }
        else if(direction == "NW")
        {
            this.entity.setAnimation(this.animationLookingNW);
        }
    });

    IdleState.method("deactivate", function()
    {
        this.entity.animation.reset();
    });

    IdleState.method("update", function(events)
    {
        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];

            if(event.name == "keypress.left")
            {
                return this.getMoveEntityState(spqr.Basic.Point2D.directionToPoint3D("W"), spqr.Context.tileWidth * 2);
            }
            if(event.name == "keypress.right")
            {
                return this.getMoveEntityState(spqr.Basic.Point2D.directionToPoint3D("E"), spqr.Context.tileWidth * 2);
            }
            if(event.name == "keypress.up")
            {
                return this.getMoveEntityState(spqr.Basic.Point2D.directionToPoint3D("N"), spqr.Context.tileHeight * 2);
            }
            if(event.name == "keypress.down")
            {
                return this.getMoveEntityState(spqr.Basic.Point2D.directionToPoint3D("S"), spqr.Context.tileHeight * 2);
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
                    pathStates.push(new MoveHero(this.entity, pos, lastPoint, spqr.Context.tileHeight * 2));

                    pos = lastPoint;
                }

                return new Loop(pathStates, 5, true);
            }
        }

        return this;
    });

    var MoveHero = function(entity, startPoint, targetPoint, speed)
    {
        this.moveEntity = new MoveEntity(entity, startPoint, targetPoint, speed);

        this.entity = entity;
        this.startPoint = startPoint;
        this.targetPoint = targetPoint;
    };
    MoveHero.inherits(spqr.States.State);

    MoveHero.method("update", function(events)
    {
        var result = this.moveEntity.update(events);
        return result ? this : null;
    });

    MoveHero.method("deactivate", function()
    {
        this.moveEntity.deactivate();
    });

    MoveHero.method("activate", function()
    {
        this.moveEntity.activate();

        var dx = this.targetPoint.x - this.startPoint.x;
        var x = dx != 0 ? dx / Math.abs(dx) : 0;
        var dy = this.targetPoint.y - this.startPoint.y;
        var y = dy != 0 ? dy / Math.abs(dy) : 0;

        this.entity.direction = new spqr.Basic.Point3D(x, y, 0);

        /*10, 20 OR 10, 14*/
        var tileWidth = spqr.Context.tileWidth;
        var tileHeight = spqr.Context.tileHeight;
        var spriteSheet = new spqr.Resources.SpriteSheet(spqr.Context.resources.images["warrior_spritesheet2"], 128, 128);

        spriteSheet.setFramesOffset(64, 71, tileWidth, tileHeight);
        spriteSheet.setFramesOffset(72, 79, tileWidth, tileHeight);
        spriteSheet.setFramesOffset(80, 87, tileWidth + 16, tileHeight + 16);//N
        spriteSheet.setFramesOffset(88, 95, tileWidth + 16, tileHeight + 14);//W
        spriteSheet.setFramesOffset(96, 103, tileWidth, tileHeight);
        spriteSheet.setFramesOffset(104, 111, tileWidth + 16, tileHeight + 14);//E
        spriteSheet.setFramesOffset(112, 119, tileWidth + 12, tileHeight + 18);//S
        spriteSheet.setFramesOffset(120, 127, tileWidth, tileHeight);

        var direction = spqr.Basic.Point2D.getDirection(this.entity.direction);

        var fps = 14;

        if(direction == "NE")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 64, 71, fps));
        }
        else if(direction == "NW")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 72, 79, fps));
        }
        else if(direction == "N")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 80, 87, fps));
        }
        else if(direction == "W")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 88, 95, fps));
        }
        else if(direction == "SE")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 96, 103, fps));
        }
        else if(direction == "E")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 104, 111, fps));
        }
        else if(direction == "S")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 112, 119, fps));
        }
        else if(direction == "SW")
        {
            this.entity.setAnimation(new spqr.Resources.Animation(spriteSheet, 120, 127, fps));
        }
    });

    spqr.TerrainLesson = {};
    spqr.TerrainLesson.IdleState = IdleState;
})();

/*
N -> NE
NE -> E
E -> SE
SE -> S
S -> SW
SW -> W
W -> NW
NW -> N
*/
(function()
{
    var UnitMovementComponent = function()
    {
    }
    UnitMovementComponent.inherits(spqr.Scene.EntityComponent);

    UnitMovementComponent.method("update", function(entity, events)
    {
        var stateComponent = entity.getComponent("state");
        if(stateComponent)
        {
            stateComponent.stateStack.update(events);

            var state = stateComponent.stateStack.getState();
            if(state instanceof WalkState)
            {
                var speed = 1;
                var direction = state.direction;

                var entityDirectionComponent = entity.getComponent("direction");
                entityDirectionComponent.direction = direction;

                var dx = direction.x * speed;
                var dy = direction.y * speed;

                entity.translation.x += dx;
                entity.translation.y += dy;
            }
        }
    });

    var UnitStateComponent = function(state)
    {
        this.stateStack = new spqr.States.StateStack();
        if(state)
        {
            this.stateStack.push(state);
        }
    }
    UnitStateComponent.inherits(spqr.Scene.EntityComponent);

    UnitStateComponent.method("update", function(entity, events)
    {
        this.stateStack.update(events);
    });

    var EntityDirectionComponent = function(direction)
    {
        this.direction = direction;
    }
    EntityDirectionComponent.inherits(spqr.Scene.EntityComponent);

    var AnimationSetComponent = function()
    {
        //idle
        var spriteSheetIdle = new spqr.Resources.SpriteSheet(spqr.Context.resources.images["warrior_spritesheet1"], 96, 96);
        spriteSheetIdle.setFramesOffset(0, 12, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleNE
        spriteSheetIdle.setFramesOffset(13, 25, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleNW
        spriteSheetIdle.setFramesOffset(26, 38, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleN
        spriteSheetIdle.setFramesOffset(39, 51, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleW
        spriteSheetIdle.setFramesOffset(52, 64, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleSE
        spriteSheetIdle.setFramesOffset(65, 77, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleE
        spriteSheetIdle.setFramesOffset(78, 90, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleS
        spriteSheetIdle.setFramesOffset(91, 103, spqr.Context.tileWidth, spqr.Context.tileHeight); //idleSW

        //walking
        var spriteSheetWalk = new spqr.Resources.SpriteSheet(spqr.Context.resources.images["warrior_spritesheet2"], 128, 128);
        var tileWidth = spqr.Context.tileWidth;
        var tileHeight = spqr.Context.tileHeight;
        spriteSheetWalk.setFramesOffset(64, 71, tileWidth, tileHeight);
        spriteSheetWalk.setFramesOffset(72, 79, tileWidth, tileHeight);
        spriteSheetWalk.setFramesOffset(80, 87, tileWidth + 16, tileHeight + 16);//N
        spriteSheetWalk.setFramesOffset(88, 95, tileWidth + 16, tileHeight + 14);//W
        spriteSheetWalk.setFramesOffset(96, 103, tileWidth, tileHeight);
        spriteSheetWalk.setFramesOffset(104, 111, tileWidth + 16, tileHeight + 14);//E
        spriteSheetWalk.setFramesOffset(112, 119, tileWidth + 12, tileHeight + 18);//S
        spriteSheetWalk.setFramesOffset(120, 127, tileWidth, tileHeight);
        var fps = 14;

        this.animations =
        {
            "idleNE": new spqr.Resources.Animation(spriteSheetIdle, 0, 12, 8),
            "idleNW": new spqr.Resources.Animation(spriteSheetIdle, 13, 25, 8),
            "idleN": new spqr.Resources.Animation(spriteSheetIdle, 26, 38, 8),
            "idleW": new spqr.Resources.Animation(spriteSheetIdle, 39, 51, 8),
            "idleSE": new spqr.Resources.Animation(spriteSheetIdle, 52, 64, 8),
            "idleE": new spqr.Resources.Animation(spriteSheetIdle, 65, 77, 8),
            "idleS": new spqr.Resources.Animation(spriteSheetIdle, 78, 90, 8),
            "idleSW": new spqr.Resources.Animation(spriteSheetIdle, 91, 103, 8),

            "walkNE": new spqr.Resources.Animation(spriteSheetWalk, 64, 71, fps),
            "walkNW": new spqr.Resources.Animation(spriteSheetWalk, 72, 79, fps),
            "walkN": new spqr.Resources.Animation(spriteSheetWalk, 80, 87, fps),
            "walkW": new spqr.Resources.Animation(spriteSheetWalk, 88, 95, fps),
            "walkSE": new spqr.Resources.Animation(spriteSheetWalk, 96, 103, fps),
            "walkE": new spqr.Resources.Animation(spriteSheetWalk, 104, 111, fps),
            "walkS": new spqr.Resources.Animation(spriteSheetWalk, 112, 119, fps),
            "walkSW": new spqr.Resources.Animation(spriteSheetWalk, 120, 127, fps)
        };
    }
    AnimationSetComponent.inherits(spqr.Scene.EntityComponent);

    AnimationSetComponent.method("getAnimation", function(state, direction)
    {
        var directionName = direction ? spqr.Basic.Point2D.getDirection(direction) : null;

        if(state instanceof WalkState)
        {
            return this.animations["walk" + directionName];
        }
        else if(state instanceof IdleState)
        {
            return this.animations["idle" + directionName];
        }

        return null;
    });

    var SpriteAnimationComponent = function()
    {
        this.animation = null;
    }
    SpriteAnimationComponent.inherits(spqr.Scene.EntityComponent);

    SpriteAnimationComponent.method("update", function(entity, events)
    {
        var stateComponent = entity.getComponent("state");
        var directionComponent = entity.getComponent("direction");
        var animationSetComponent = entity.getComponent("animationSet");

        var state = stateComponent ? stateComponent.stateStack.getState() : null;
        var direction = directionComponent ? directionComponent.direction : null;
        var animation = animationSetComponent ? animationSetComponent.getAnimation(state, direction) : null;

        if(animation !== this.animation)
        {
            this.animation = animation;
        }

        if(this.animation)
        {
            this.animation.update(events)
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

            if(event.name == "keyup" || event.name == "keydown")
            {
                var input = spqr.Context.engine.inputManager;

                var left = input.getKeyState("left");
                var right = input.getKeyState("right");
                var top = input.getKeyState("up");
                var bottom = input.getKeyState("down");
                var direction;

                if(!left && !bottom && !right && top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("NW");
                }
                else if(left && !bottom && !right && !top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("SW");
                }
                else if(left && !bottom && !right && top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("W");
                }
                else if(left && bottom && !right && !top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("S");
                }
                else if(!left && !bottom && right && top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("N");
                }
                else if(!left && bottom && right && !top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("E");
                }
                else if(!left && bottom && !right && !top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("SE");
                }
                else if(!left && !bottom && right && !top)
                {
                    direction = spqr.Basic.Point2D.directionToPoint3D("NE");
                }

                if(direction)
                {
                    return new WalkState(direction);
                }
            }
        }

        return this;
    });

    var WalkState = function(direction)
    {
        this.direction = direction;
    };
    WalkState.inherits(spqr.States.State);

    WalkState.method("activate", function()
    {
        this.firstUpdate = true;
    });

    WalkState.method("update", function(events)
    {
        if(this.firstUpdate)
        {
            this.firstUpdate = false;
            return this;
        }

        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];

            if(event.name == "keyup" || event.name == "keydown")
            {
                return null;
            }
        }

        return this;
    });

    spqr.Aragorn = {};
    spqr.Aragorn.UnitMovementComponent = UnitMovementComponent;
    spqr.Aragorn.EntityDirectionComponent = EntityDirectionComponent;
    spqr.Aragorn.SpriteAnimationComponent = SpriteAnimationComponent;
    spqr.Aragorn.AnimationSetComponent = AnimationSetComponent;
    spqr.Aragorn.UnitStateComponent = UnitStateComponent;
    spqr.Aragorn.IdleState = IdleState;
})();

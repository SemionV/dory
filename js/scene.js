(function()
{
    var SceneManager = function()
    {
        this.terrains = {};
        this.entities = {};
        this.actions = {};
    };

    SceneManager.method("update", function(events)
    {
        for(var i = 0, l = events.length; i < l; i++)
        {
            var event = events[i];
            var action = this.getAction(event.name);
            if(action)
            {
                action.call(this, event);
            }
        }

        for(var id in this.entities)
        {
            var entity = this.entities[id];
            entity.update(events);
        }
    });

    SceneManager.method("getAction", function(key)
    {
        return this.actions[key];
    });

    SceneManager.method("setAction", function(key, action)
    {
        this.actions[key] = action;
    });

    SceneManager.method("addEntity", function(id, node)
    {
        this.entities[id] = node;
    });

    SceneManager.method("getEntity", function(id)
    {
        return this.entities[id];
    });

    SceneManager.method("addTerrain", function(id, terrainData)
    {
        var terrain = new spqr.Scene.Terrain();
        terrain.init(terrainData);
        this.terrains[id] = terrain;
    });

    SceneManager.method("setActiveCamera", function(camera)
    {
        this.camera = camera;
    });

    SceneManager.method("draw", function()
    {
        var renderer = spqr.Context.renderer;
        renderer.pushMatrix(this.camera.translation);

        for(var key in this.terrains)
        {
            var terrain = this.terrains[key];
            terrain.draw(renderer);
        }

        for(var key in this.entities)
        {
            var entity = this.entities[key];

            if(entity.translation)
                renderer.pushMatrix(entity.translation);

            entity.draw(renderer);
            if(spqr.Context.config.drawBoundingBoxes)
            {
                entity.drawBoundingBox(renderer);
            }

            if(entity.translation)
                renderer.popMatrix();
        }

        renderer.popMatrix(this.camera.translation);

        if(this.camera)
        {
            this.camera.draw(renderer);
        }

        renderer.render();
    });

    var EntityComponent = function()
    {
    };

    EntityComponent.method("update", function(entity, events)
    {
    });

    var Node = function()
    {
        this.translation = new spqr.Basic.Point3D(0, 0, 0);
        this.boundingBox = [];
    };

    Node.method("draw", function(renderer){});
    Node.method("drawBoundingBox", function(renderer){});

    Node.method("setTranslation", function(translation)
    {
        this.translation = translation;
    });

    Node.method("move", function(x, y, z)
    {
        this.translation.x += x;
        this.translation.y += y;
        this.translation.z += z;
    });

    var Entity = function()
    {
    }
    Entity.inherits(Node);

    Entity.method("update", function(events)
    {
        if(this.components)
        {
            for(var i = 0, l = this.components.length; i < l; i++)
            {
                var component = this.components[i];

                component.update(this, events);
            }
        }

        this.stateMachine.update(events);
    });

    Entity.method("addComponent", function(component)
    {
        if(!this.components)
        {
            this.components = [];
        }
        this.components.push(component);
    });

    var SpriteEntity = function(boundingBox)
    {
        this.direction = new spqr.Basic.Point3D(1, 0, 0);
        this.stateMachine = new spqr.States.StateMachine();

        this.boundingBoxSize = boundingBox;

        var tl = new spqr.Basic.Point3D(0, 0, 0);
        var tr = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y, 0);
        var br = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y + boundingBox.height, 0);
        var bl = new spqr.Basic.Point3D(tl.x, tl.y + boundingBox.height, 0);

        this.polygon = new spqr.Basic.Polygon(tl, tr, br, bl);
    };
    SpriteEntity.inherits(Entity);

    SpriteEntity.method("draw", function(renderer)
    {
        renderer.addPolygon(this.polygon);
    });

    SpriteEntity.method("setAnimation", function(animation)
    {
        this.animation = animation;
        var sprite = animation.getCurrentFrame();
        this.polygon.setTexture(sprite);
    });

    SpriteEntity.method("setSprite", function(sprite)
    {
        this.polygon.setTexture(sprite);
    });

    SpriteEntity.method("update", function(events)
    {
        if(this.animation)
        {
            this.animation.update(events);
            var sprite = this.animation.getCurrentFrame();
            this.polygon.setTexture(sprite);
        }
        this.uber('update', events);
    });

    Node.method("drawBoundingBox", function(renderer)
    {
        var bbox = this.boundingBoxSize;
        var z = (bbox.altitude * -1);

        var tl = new spqr.Basic.Point3D(0, 0, 0);
        var tr = new spqr.Basic.Point3D(bbox.width, 0, 0);
        var br = new spqr.Basic.Point3D(bbox.width, bbox.height, 0);
        var bl = new spqr.Basic.Point3D(0, bbox.height, 0);

        renderer.addPolygon(new spqr.Basic.Polygon(tl, tr, br, bl));

        var tl = new spqr.Basic.Point3D(0, 0, z);
        var tr = new spqr.Basic.Point3D(bbox.width, 0, z);
        var bl = new spqr.Basic.Point3D(0, 0, 0);
        var br = new spqr.Basic.Point3D(bbox.width, 0, 0);

        renderer.addPolygon(new spqr.Basic.Polygon(tl, tr, br, bl));

        var tl = new spqr.Basic.Point3D(0, bbox.height, z);
        var tr = new spqr.Basic.Point3D(0, 0, z);
        var bl = new spqr.Basic.Point3D(0, bbox.height, 0);
        var br = new spqr.Basic.Point3D(0, 0, 0);

        renderer.addPolygon(new spqr.Basic.Polygon(tl, tr, br, bl));

        renderer.addPolygon(this.polygon);

        var tl = new spqr.Basic.Point3D(0, 0, z);
        var tr = new spqr.Basic.Point3D(bbox.width, 0, z);
        var br = new spqr.Basic.Point3D(bbox.width, bbox.height, z);
        var bl = new spqr.Basic.Point3D(0, bbox.height, z);

        renderer.addPolygon(new spqr.Basic.Polygon(tl, tr, br, bl));

        var tl = new spqr.Basic.Point3D(0, bbox.height, z);
        var tr = new spqr.Basic.Point3D(bbox.width, bbox.height, z);
        var bl = new spqr.Basic.Point3D(0, bbox.height, 0);
        var br = new spqr.Basic.Point3D(bbox.width, bbox.height, 0);

        renderer.addPolygon(new spqr.Basic.Polygon(tl, tr, br, bl));

        var tl = new spqr.Basic.Point3D(bbox.width, bbox.height, z);
        var tr = new spqr.Basic.Point3D(bbox.width, 0, z);
        var bl = new spqr.Basic.Point3D(bbox.width, bbox.height, 0);
        var br = new spqr.Basic.Point3D(bbox.width, 0, 0);

        renderer.addPolygon(new spqr.Basic.Polygon(tl, tr, br, bl));
    });

    var Camera = function(width, height)
    {
        this.viewPort = new spqr.Basic.Rectangle(0, 0, width, height);

        var tl = spqr.Basic.Point2D.to2D(new spqr.Basic.Point2D(0, 0));
        var tr = spqr.Basic.Point2D.to2D(new spqr.Basic.Point2D(width, 0));
        var br = spqr.Basic.Point2D.to2D(new spqr.Basic.Point2D(width, height));
        var bl = spqr.Basic.Point2D.to2D(new spqr.Basic.Point2D(0, height));

        this.polygon = new spqr.Basic.Polygon(tl, tr, br, bl);
        this.polygon.id = "camera";
        this.polygon.setColor(200, 0, 0, 0);
    };
    Camera.inherits(Node);

    Camera.method("draw", function(renderer)
    {
        renderer.addPolygon(this.polygon);
    });

    var Label = function(text)
    {
        this.text = text;
    };
    Label.inherits(Node);

    Label.method("draw", function(renderer)
    {
        if(this.translation)
            renderer.pushMatrix(this.translation);
        renderer.addLabel(this.text);
        if(this.translation)
            renderer.popMatrix(this.translation);
    });

    spqr.Scene = {};
    spqr.Scene.Manager = SceneManager;
    spqr.Scene.Node = Node;
    spqr.Scene.SpriteEntity = SpriteEntity;
    spqr.Scene.Camera = Camera;
    spqr.Scene.EntityComponent = EntityComponent;
})();

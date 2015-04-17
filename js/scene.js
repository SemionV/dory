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

    SceneManager.method("draw", function()
    {
        var renderer = spqr.Context.renderer;
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

        renderer.render();
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
        this.stateMachine.update(events);
    });

    var SpriteEntity = function(texture, boundingBox)
    {
        this.stateMachine = new spqr.States.StateMachine();

        this.boundingBoxSize = boundingBox;

        var tl = new spqr.Basic.Point3D(0, 0, 0);
        var tr = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y, 0);
        var br = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y + boundingBox.height, 0);
        var bl = new spqr.Basic.Point3D(tl.x, tl.y + boundingBox.height, 0);

        var polygon = this.polygon = new spqr.Basic.Polygon(tl, tr, br, bl);

        polygon.setTexture(texture);
    };
    SpriteEntity.inherits(Entity);

    SpriteEntity.method("draw", function(renderer)
    {
        renderer.addPolygon(this.polygon);
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

    spqr.Scene = {};
    spqr.Scene.Manager = SceneManager;
    spqr.Scene.Node = Node;
    spqr.Scene.SpriteEntity = SpriteEntity;
})();

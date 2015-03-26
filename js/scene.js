(function()
{
    var SceneManager = function(renderer, resources)
    {
        this.renderer = renderer;
        this.resources = resources;

        this.terrains = {};
        this.entities = {};
        this.actions = {};

        /*settings*/
        this.drawBoundingBoxes = true;
    };

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

    SceneManager.method("addTerrain", function(id, terrainData)
    {
        var terrain = new spqr.Scene.Terrain();
        terrain.init(terrainData, this.resources);
        this.terrains[id] = terrain;
    });

    SceneManager.method("draw", function()
    {
        for(var key in this.terrains)
        {
            var terrain = this.terrains[key];
            terrain.draw(this.renderer);
        }

        for(var key in this.entities)
        {
            var entity = this.entities[key];

            if(entity.translation)
                this.renderer.pushMatrix(entity.translation);

            entity.draw(this.renderer);
            if(this.drawBoundingBoxes)
            {
                entity.drawBoundingBox(this.renderer);
            }

            if(entity.translation)
                this.renderer.popMatrix();
        }

        this.renderer.render();
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

    var SpriteEntity = function(texture, boundingBox)
    {
        this.boundingBoxSize = boundingBox;

        var tl = new spqr.Basic.Point3D(0, 0, 0);
        var tr = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y, 0);
        var br = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y + boundingBox.height, 0);
        var bl = new spqr.Basic.Point3D(tl.x, tl.y + boundingBox.height, 0);

        var polygon = this.polygon = new spqr.Basic.Polygon(tl, tr, br, bl);

        polygon.setTexture(texture);
    };
    SpriteEntity.inherits(Node);

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

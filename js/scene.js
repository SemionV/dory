(function()
{
    var SceneManager = function(renderer, resources)
    {
        this.renderer = renderer;
        this.resources = resources;

        this.terrains = {};
        this.entities = {};
    };

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
            entity.draw(this.renderer);
        }

        this.renderer.render();
    });

    var Node = function()
    {
    };

    Node.method("draw", function(renderer){});

    var SpriteEntity = function(texture, boundingBox, translation)
    {
        this.translation = translation;

        var polygon= this.polygon = new spqr.Basic.Polygon();
        var tl = new spqr.Basic.Point3D(0, 0, 0);
        var tr = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y, 0);
        var br = new spqr.Basic.Point3D(tl.x + boundingBox.width, tl.y + boundingBox.height, 0);
        var bl = new spqr.Basic.Point3D(tl.x, tl.y + boundingBox.height, 0);

        polygon.setTexture(texture);
    };
    SpriteEntity.inherits(Node);

    SpriteEntity.method("draw", function(renderer)
    {
        renderer.addPolygon(this.polygon);
    });

    spqr.Scene = {};
    spqr.Scene.Manager = SceneManager;
    spqr.Scene.Node = Node;
    spqr.Scene.SpriteEntity = SpriteEntity;
})();

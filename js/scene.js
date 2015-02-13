(function()
{
    var SceneManager = function()
    {
        this.nodes = [];
    };

    var Node = function()
    {
    };

    var Glyph = function()
    {

    }
    Glyph.inherits(Node);

    Glyph.method("draw", function(){});

    var Terrain = function()
    {

    };
    Terrain.inherits(Glyph);

    var td = {
        tiles:
        [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1]
        ],
        heightMap:
        [
            [0,0,0,0],
            [0,0,0,1],
            [0,0,0,1],
            [0,0,0,0]
        ],
        tileTypes:
        {
            "1": {image: "grass.png"}
        }
    }

    Terrain.method("init", function(/*spqr.Basic.TerrainData*/terrainData, tileWidth, tileHeight)
    {
        this.data = terrainData;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
    });

    Terrain.method("draw", function()
    {

    });

    var Tile = function(origin, width, height)
    {
        this.origin = origin ? origin : new spqr.Basic.Point2D(0, 0);
        this.width = width ? width : 0;
        this.height = height;
    };
    Tile.inherits(Node);

    spqr.Scene = {};
    spqr.Scene.Manager = SceneManager;
})();

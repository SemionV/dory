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

    Terrain.method("getTileMap", function()
    {
        if(this.data)
        {
            return this.data.tiles;
        }
    });

    Terrain.method("getTileTypes", function()
    {
        if(this.data)
        {
            return this.data.tileTypes;
        }
    });

    Terrain.method("getHeightMap", function()
    {
        if(this.data)
        {
            return this.data.heightMap;
        }
    });

    Terrain.method("getTileType", function(tileId)
    {
        var types = this.getTileTypes();

        if(types)
        {
            return types[tileId.toString()];
        }
    });

    //Tile draw techniques: http://stackoverflow.com/questions/892811/drawing-isometric-game-worlds
    Terrain.method("draw", function(context, resources)
    {
        var map = this.getTailMap();
        if(map)
        {
            for(var i = 0, l = map.length; i < l; i++)
            {
                var row = map[i];
                for(var j = row.length; j >= 0; j--)
                {
                    var tileType = this.getTileType(row[j]);
                    if(tileType)
                    {
                        var image = resources.images[tyleType.image];
                        if(image)
                        {
                            context.drawImage(image,
                                (j * this.tileWidth / 2) + (i * this.tileWidth / 2),
                                (i * this.tileHeight / 2) - (j * this.tileHeight / 2));
                        }
                    }
                }
            }
        }
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
    spqr.Scene.Terrain = Terrain;
})();

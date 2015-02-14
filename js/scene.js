(function()
{
    var SceneManager = function()
    {
        this.nodes = [];
    };

    var Node = function()
    {
    };

    var Terrain = function()
    {

    };
    Terrain.inherits(Node);

    Terrain.method("init", function(/*spqr.Basic.TerrainData*/terrainData, tileWidth, tileHeight, resources)
    {
        this.data = terrainData;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.polygons = [];

        var tileTypes = terrainData.tileTypes;
        var heightMap = terrainData.heightMap;
        var map = terrainData.tiles;
        if(map)
        {
            for(var i = 0, l = map.length; i < l; i++)
            {
                var row = map[i];
                for(var j = row.length - 1; j >= 0; j--)
                {
                    var tileType = tileTypes[row[j].toString()];
                    if(tileType)
                    {
                        var x = j * this.tileWidth;
                        var y = i * this.tileHeight;

                        var tl = new spqr.Basic.Point3D(x, y, heightMap ? heightMap[i][j] : 0);
                        var tr = new spqr.Basic.Point3D(tl.x + tileWidth, tl.y, tl.z);
                        var br = new spqr.Basic.Point3D(tl.x + tileWidth, tl.y + tileHeight, tl.z);
                        var bl = new spqr.Basic.Point3D(tl.x, tl.y + tileHeight, tl.z);
                        var polygon = new spqr.Basic.Polygon(tl, tr, br, bl);

                        if(tileType.image)
                        {
                            var image = resources.images[tileType.image];
                            polygon.setTexture(new spqr.Basic.Texture(image, tileType.offsetX, tileType.offsetY));
                        }
                        else
                        {
                            if(tileType.color)
                                polygon.setColor.apply(polygon, tileType.color);
                        }

                        this.polygons.push(polygon);
                    }
                }
            }
        }
    });

    Terrain.method("draw", function(renderManager)
    {
        for(var i = 0, l = this.polygons.length; i < l; i++)
        {
            renderManager.addPolygon(this.polygons[i]);
        }
    });

    spqr.Scene = {};
    spqr.Scene.Manager = SceneManager;
    spqr.Scene.Terrain = Terrain;
})();

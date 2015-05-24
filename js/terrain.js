(function()
{
    var Terrain = function()
    {

    };
    Terrain.inherits(spqr.Scene.Node);

    Terrain.method("init", function(/*spqr.Basic.TerrainData*/terrainData)
    {
        this.data = terrainData;
        this.tileWidth = terrainData.tileWidth;
        this.tileHeight = terrainData.tileHeight;

        this.polygons = [];

        var tileTypes = terrainData.tileTypes;
        var heightMap = terrainData.heightMap;
        var map = terrainData.tiles;
        if(map)
        {
            for(var i = 0, l = map.length; i < l; i++)
            {
                var row = map[i];
                for(var j = 0, k = row.length; j < k; j++)
                {
                    var tileType = tileTypes[row[j].toString()];
                    if(tileType)
                    {
                        var x = j * this.tileWidth;
                        var y = i * this.tileHeight;

                        var tl = new spqr.Basic.Point3D(x, y, heightMap ? (heightMap[i][j] * (-1)) : 0);
                        var tr = new spqr.Basic.Point3D(tl.x + this.tileWidth, tl.y, tl.z);
                        var br = new spqr.Basic.Point3D(tl.x + this.tileWidth, tl.y + this.tileHeight, tl.z);
                        var bl = new spqr.Basic.Point3D(tl.x, tl.y + this.tileHeight, tl.z);
                        var polygon = new spqr.Basic.Polygon(tl, tr, br, bl);

                        if(tileType.image)
                        {
                            var image = spqr.Context.resources.images[tileType.image];
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
        var halfWidth = this.tileWidth / 2;
        var halfHeight = this.tileHeight / 2;
        var cameraMatrix = spqr.context.engine.scene.camera;

        for(var i = 0, l = this.polygons.length; i < l; i++)
        {
            var polygon = this.polygons[i];

            var tl = polygon[0];
            var polygonCenter = new spqr.Basic.Point3D(br.x + halfWidth, br.y + halfHeight, tl.z);

            spqr.Basic.Point3D.translate(polygon, cameraMatrix);

            renderManager.addPolygon(polygon);
        }
    });

    spqr.Scene.Terrain = Terrain;
})();
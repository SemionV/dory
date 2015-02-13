(function()
{
    var Point2D = function(x, y)
    {
        this.X = x;
        this.Y = y;
    };

    var TerrainData = function()
    {
        this.tiles = [];
        this.heightMap = [];
        this.tileTypes = {};
    };

    spqr.Basic = {};
    spqr.Basic.Point2D = Point2D;
    spqr.Basic.TerrainData = TerrainData;
})();

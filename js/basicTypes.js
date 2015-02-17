(function()
{
    var Point2D = function(x, y)
    {
        this.x = x;
        this.y = y;
    };

    Point2D.toIsometric = function(point)
    {
        return new Point2D((point.x - point.y), ((point.x + point.y) / 2));
    };

    Point2D.to2D = function(point)
    {
        return new Point2D(((2 * point.y + point.x) / 2), ((2 * point.y - point.x) / 2));
    };

    var Point3D = function(x, y, z)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    Point3D.toIsometric = function(point)
    {
        return new Point2D((point.x - point.y), (((point.x + point.y) / 2) + point.z));
    };

    Point3D.translate = function(point, vector)
    {
        return new Point3D(point.x + vector.x, point.y + vector.y, point.z + vector.z);
    }

    var ColorRgba = function(r, g, b, a)
    {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a ? a : 0;
    };

    ColorRgba.toCanvasColor = function(c)
    {
        if(this.a)
        {
            return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
        }
        else
        {
            return "rgb(" + c.r + "," + c.g + "," + c.b + ")";
        }
    }

    var TerrainData = function()
    {
        this.tiles = [];
        this.heightMap = [];
        this.tileTypes = {};
    };

    var Polygon = function()
    {
        if(arguments.length)
        {
            for(var i = 0, l = arguments.length; i < l; i++)
            {
                this.push(arguments[i]);
            }
        }
    };
    Polygon.inherits(Array);

    Polygon.method("setTexture", function(texture)
    {
        this.texture = texture;
    });

    Polygon.method("setColor", function(r, g, b, a)
    {
        this.color = new ColorRgba(r, g, b, a);
    });

    var Texture = function(image, offsetX, offsetY)
    {
        this.image = image;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    };

    var Box = function(width, height, altitude)
    {
        this.width = width;
        this.height = height;
        this.altitude = altitude;
    };

    spqr.Basic = {};
    spqr.Basic.Point2D = Point2D;
    spqr.Basic.Point3D = Point3D;
    spqr.Basic.TerrainData = TerrainData;
    spqr.Basic.Polygon = Polygon;
    spqr.Basic.ColorRgba = ColorRgba;
    spqr.Basic.Texture = Texture;
    spqr.Basic.Box = Box;
})();

(function()
{
    var RenderManager = function(context)
    {
        this.context = context;

        this.polygonQueue = [];
    };

    RenderManager.method("addPolygon", function(/*spqr.Basic.Polygon*/polygon)
    {
        this.polygonQueue.push(polygon);
    });

    RenderManager.method("render", function()
    {
        for(var i = 0, l = this.polygonQueue.length; i < l; i++)
        {
            var polygon = this.polygonQueue[i];

            if(!polygon.length)
                continue;

            //Tile
            var texture = polygon.texture;
            if(texture)
            {
                var point = spqr.Basic.Point3D.toIsometric(polygon[0]);
                if(texture.offsetX)
                {
                    point.x -= texture.offsetX;
                }
                if(texture.offsetY)
                {
                    point.y -= texture.offsetY;
                }
                this.context.drawImage(texture.image, point.x, point.y);
            }
            else
            {
                var color;
                if(polygon.color)
                {
                    color = spqr.Basic.ColorRgba.toCanvasColor(polygon.color);
                }
                else
                {
                    color = "rgba(200, 200, 200)";
                }

                this.context.fillStyle = color;

                this.context.beginPath();
                var point = spqr.Basic.Point3D.toIsometric(polygon[0]);
                this.context.moveTo(point.x, point.y);

                for(var j = 1, k = polygon.length; j < k; j++)
                {
                    point = spqr.Basic.Point3D.toIsometric(polygon[j]);
                    this.context.lineTo(point.x, point.y);
                }

                this.context.fill();
            }
        }

        this.polygonQueue = [];
    });

    spqr.RenderManager = RenderManager;
})();

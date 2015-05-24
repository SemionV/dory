(function()
{
    var RenderManager = function(context, width, height)
    {
        this.context = context;
        this.width = width;
        this.height = height;

        this.matrixStack = [];

        this.polygonQueue = [];
    };

    RenderManager.method("addPolygon", function(/*spqr.Basic.Polygon*/polygon)
    {
        var matrix = this.matrixStack.length ? this.matrixStack[0] : null;
        this.polygonQueue.push({matrix: matrix, polygon: polygon});
    });

    RenderManager.method("pushMatrix", function(translation)
    {
        this.matrixStack.unshift(translation);
    });

    RenderManager.method("popMatrix", function()
    {
        this.matrixStack.shift();
    });

    RenderManager.method("render", function()
    {
        this.context.clearRect(0, 0, this.width, this.height);

        this.context.save();
        //this.context.translate(400, 0);

        for(var i = 0, l = this.polygonQueue.length; i < l; i++)
        {
            var item = this.polygonQueue[i];
            var polygon = item.polygon;
            var matrix = item.matrix;

            if(!polygon.length)
                continue;

            //Tile
            var texture = polygon.texture;
            if(texture)
            {
                var point = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(polygon[0], matrix));

                if(texture.offsetX)
                {
                    point.x -= texture.offsetX;
                }
                if(texture.offsetY)
                {
                    point.y -= texture.offsetY;
                }

                if(texture.clipWidth)
                {
                    this.context.drawImage(texture.image, texture.clipX, texture.clipY, texture.clipWidth, texture.clipHeight, point.x, point.y, texture.clipWidth, texture.clipHeight);
                }
                else
                {
                    this.context.drawImage(texture.image, point.x, point.y);
                }
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

                if(polygon.solid)
                {
                    this.context.fillStyle = color;
                }
                else
                {
                    this.context.strokeStyle = color;
                }

                this.context.beginPath();
                var pointStart = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(polygon[0], matrix));
                this.context.moveTo(pointStart.x, pointStart.y);

                for(var j = 1, k = polygon.length; j < k; j++)
                {
                    var point = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(polygon[j], matrix));
                    this.context.lineTo(point.x, point.y);
                }
                this.context.lineTo(pointStart.x, pointStart.y);

                if(polygon.solid)
                {
                    this.context.fill();
                }
                else
                {
                    this.context.stroke();
                }
            }
        }

        this.context.restore();
        this.polygonQueue = [];
    });

    spqr.RenderManager = RenderManager;
})();

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
        if(this.matrixStack.length)
        {
            var translation = this.matrixStack[0];
            var transformedPolygon = new spqr.Basic.Polygon();

            for(var i = 0, l = polygon.length; i < l; i++)
            {
                transformedPolygon.push(spqr.Basic.Point3D.translate(polygon[i], translation));
            }

            transformedPolygon.texture = polygon.texture;
            transformedPolygon.solid = polygon.solid;
            this.polygonQueue.push(transformedPolygon);
        }
        else
        {
            this.polygonQueue.push(polygon);
        }
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
        this.context.translate(400, 0);

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
                var pointStart = spqr.Basic.Point3D.toIsometric(polygon[0]);
                this.context.moveTo(pointStart.x, pointStart.y);

                for(var j = 1, k = polygon.length; j < k; j++)
                {
                    var point = spqr.Basic.Point3D.toIsometric(polygon[j]);
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

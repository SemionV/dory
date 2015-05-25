(function()
{
    var RenderManager = function(context, width, height)
    {
        this.context = context;
        this.width = width;
        this.height = height;

        this.matrixStack = [];

        this.polygonQueue = [];
        this.labelQueue = [];
    };

    RenderManager.method("addPolygon", function(/*spqr.Basic.Polygon*/polygon)
    {
        var matrix = new spqr.Basic.Point3D(0, 0, 0);

        if(this.matrixStack.length)
        {
            for(var i = this.matrixStack.length - 1; i >= 0; i--)
            {
                matrix = spqr.Basic.Point3D.translate(matrix, this.matrixStack[i]);
            }
        }

        this.polygonQueue.push({matrix: matrix, polygon: polygon});
    });

    RenderManager.method("addLabel", function(text)
    {
        var matrix = new spqr.Basic.Point3D(0, 0, 0);

        if(this.matrixStack.length)
        {
            for(var i = this.matrixStack.length - 1; i >= 0; i--)
            {
                matrix = spqr.Basic.Point3D.translate(matrix, this.matrixStack[i]);
            }
        }

        this.labelQueue.push({matrix: matrix, text: text});
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
            var item = this.polygonQueue[i];
            var polygon = item.polygon;
            var matrix = item.matrix;

            if(!polygon.length)
                continue;

            //Tile
            var texture = polygon.texture;
            if(texture)
            {
                var point = spqr.Basic.Point3D.translate(polygon[0], matrix);
                var isoPoint = spqr.Basic.Point3D.toIsometric(point);

                if(texture.offsetX)
                {
                    isoPoint.x -= texture.offsetX;
                }
                if(texture.offsetY)
                {
                    isoPoint.y -= texture.offsetY;
                }

                if(texture.clipWidth)
                {
                    this.context.drawImage(texture.image, texture.clipX, texture.clipY, texture.clipWidth, texture.clipHeight, isoPoint.x, isoPoint.y, texture.clipWidth, texture.clipHeight);
                }
                else
                {
                    this.context.drawImage(texture.image, isoPoint.x, isoPoint.y);
                }

                this.drawPolygonLabel(polygon, matrix);
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

                this.drawPolygonLabel(polygon, matrix);
            }
        }

        for(var i = 0, l = this.labelQueue.length; i < l; i++)
        {
            var item = this.labelQueue[i];
            var text = item.text;
            var point = spqr.Basic.Point3D.toIsometric(item.matrix);

            this.drawText(text, point.x, point.y);
        }

        this.context.restore();
        this.polygonQueue = [];
        this.labelQueue = [];
    });

    RenderManager.method("drawText", function(text, x, y)
    {
        var color;
        if(text.color)
        {
            color = spqr.Basic.ColorRgba.toCanvasColor(text.color);
        }
        else
        {
            color = "rgba(200, 200, 200)";
        }

        if(text.solid)
        {
            this.context.fillStyle = color;
            this.context.fillText(text.text, x, y);
        }
        else
        {
            this.context.strokeStyle = color;
            this.context.strokeText(text.text, x, y);
        }
    });

    RenderManager.method("drawPolygonLabel", function(polygon, matrix)
    {
        if(polygon.label && polygon.length == 4)
        {
            var point = spqr.Basic.Point3D.translate(polygon[0], matrix);
            var oppositePoint = spqr.Basic.Point3D.translate(polygon[2], matrix);

            var width = oppositePoint.x - point.x;
            var height = oppositePoint.y - point.y;

            var textMeasures= this.context.measureText(polygon.label.text);
            var x = point.x + ((width/2) - (textMeasures.width / 2));
            var y = point.y + ((height/2));
            var isoTextPoint = spqr.Basic.Point3D.toIsometric(new spqr.Basic.Point2D(x, y));
            isoTextPoint.x += polygon.label.offsetX;
            isoTextPoint.y += polygon.label.offsetY;

            this.drawText(polygon.label, isoTextPoint.x, isoTextPoint.y);
        }
    });

    spqr.RenderManager = RenderManager;
})();

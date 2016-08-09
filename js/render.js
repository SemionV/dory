(function()
{
    var RenderManager = function(context, width, height)
    {
        this.context = context;
        this.width = width;
        this.height = height;

        this.matrixStack = [];
        this.renderingQueue = [];
    };

    RenderManager.method("addPolygon", function(/*spqr.Basic.Polygon*/polygon)
    {
        var matrix = this.multiplyAllMatrix();
        this.renderingQueue.push({type: "polygon", matrix: matrix, polygon: polygon});
    });

    RenderManager.method("addLabel", function(text)
    {
        var matrix = this.multiplyAllMatrix();
        this.renderingQueue.push({type: "label", matrix: matrix, text: text});
    });

    RenderManager.method("addPoint", function(point, color, drawPointer)
    {
        var matrix = this.multiplyAllMatrix();
        this.renderingQueue.push({type: "point", matrix: matrix, point: point, drawPointer: drawPointer, color: color});
    });
    
    RenderManager.method("multiplyAllMatrix", function()
    {
        var matrix = new spqr.Basic.Point3D(0, 0, 0);

        if(this.matrixStack.length)
        {
            for(var i = this.matrixStack.length - 1; i >= 0; i--)
            {
                matrix = spqr.Basic.Point3D.translate(matrix, this.matrixStack[i]);
            }
        }

        return matrix;
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

        for(var i = 0, l = this.renderingQueue.length; i < l; i++)
        {
            var renderingItem = this.renderingQueue[i];

            if(renderingItem.type == "point")
            {
                this.renderPoint(renderingItem);
            }
            else if(renderingItem.type == "polygon")
            {
                this.renderPolygon(renderingItem);
            }
            else if(renderingItem.type == "label")
            {
                this.renderLabel(renderingItem);
            }
        }

        this.context.restore();
        this.renderingQueue = [];
    });

    RenderManager.method("renderLabel", function(renderingItem)
    {
        var text = renderingItem.text;
        var point = spqr.Basic.Point3D.toIsometric(renderingItem.matrix);

        this.drawText(text, point.x, point.y);
    });

    RenderManager.method("renderPolygon", function(renderingItem)
    {
        var polygon = renderingItem.polygon;
        var matrix = renderingItem.matrix;

        if(!polygon.length)
            return;

        if(polygon.debug)
        {
            debugger;
        }

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
    });
    
    RenderManager.method("renderPoint", function(renderingItem)
    {
        var pointerAxisLength = 100;
        var point = renderingItem.point;

        if(renderingItem.drawPointer)
        {
            var topPoint = new spqr.Basic.Point3D(point.x, point.y - pointerAxisLength, point.z);
            topPoint = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(topPoint, renderingItem.matrix));
            var bottomPoint = new spqr.Basic.Point3D(point.x, point.y + pointerAxisLength, point.z);
            bottomPoint = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(bottomPoint, renderingItem.matrix));

            var leftPoint = new spqr.Basic.Point3D(point.x - pointerAxisLength, point.y, point.z);
            leftPoint = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(leftPoint, renderingItem.matrix));
            var rightPoint = new spqr.Basic.Point3D(point.x + pointerAxisLength, point.y, point.z);
            rightPoint = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(rightPoint, renderingItem.matrix));

            var topAltPoint = new spqr.Basic.Point3D(point.x, point.y, point.z + pointerAxisLength);
            topAltPoint = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(topAltPoint, renderingItem.matrix));
            var bottomAltPoint = new spqr.Basic.Point3D(point.x, point.y, point.z - pointerAxisLength);
            bottomAltPoint = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(bottomAltPoint, renderingItem.matrix));

            this.drawLine(topPoint, bottomPoint, "rgb(0, 0, 255)");
            this.drawLine(leftPoint, rightPoint, "rgb(255, 0, 0)");
            //this.drawLine(topAltPoint, bottomAltPoint, "rgb(0, 255, 0)");
        }

        var color;
        if(renderingItem.color)
        {
            color = spqr.Basic.ColorRgba.toCanvasColor(renderingItem.color);
        }
        else
        {
            color = "rgba(250, 0, 0)";
        }

        point = spqr.Basic.Point3D.toIsometric(spqr.Basic.Point3D.translate(point, renderingItem.matrix));
        this.context.strokeStyle = color;
        this.context.strokeRect(point.x, point.y, 4, 4);
    });

    RenderManager.method("drawLine", function(pointA, pointB, color)
    {
        this.context.beginPath();
        this.context.moveTo(pointA.x, pointA.y);
        this.context.lineTo(pointB.x, pointB.y);

        this.context.strokeStyle = color;
        this.context.stroke();
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

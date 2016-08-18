define(['primitives'], function(primitives){
    class DrawPrimitive{
        constructor(color){
            this.color = color;
        }
    }

    class Polygon extends DrawPrimitive{
        constructor(polygon, color){
            super(color);
            this.polygon = polygon;
        }
    }

    class Label extends DrawPrimitive{
        constructor(text, color){
            super(color);
            this.text = text;
        }
    }

    class Point extends DrawPrimitive{
        constructor(point, color, drawPointer = false){
            super(color);
            this.point = point;
            this.drawPointer = drawPointer;
        }
    }

    class Sprite extends DrawPrimitive{
        constructor(image, color, drawBorder){
            super(color);
            this.image = image;
            this.drawBorder = drawBorder;
        }
    }

    class Canvas2DRenderer{
        constructor(context, width, height){
            this.context = context;
            this.width = width;
            this.height = height;

            this.matrixStack = [];
            this.renderingQueue = [];
        }

        addPolygon(polygon, color){
            this.addPrimitive(new Polygon(polygon, color));
        }

        addLabel(text, color){
            this.addPrimitive(new Label(text, color));
        }

        addPoint(point, color, drawPointer){
            this.addPrimitive(new Point(point, color, drawPointer));
        }

        addSprite(image, color, drawBorder){
            this.addPrimitive(new Sprite(image, color, drawBorder));
        }

        addPrimitive(primitive){
            var matrix = this.multiplyAllMatrix();
            this.renderingQueue.push({matrix: matrix, object: primitive});
        }

        multiplyAllMatrix() {
            var matrix = new primitives.Point3D(0, 0, 0);

            if (this.matrixStack.length) {
                for (var i = this.matrixStack.length - 1; i >= 0; i--) {
                    matrix.translate(this.matrixStack[i])
                }
            }

            return matrix;
        }

        pushMatrix(translation){
            this.matrixStack.unshift(translation);
        }

        popMatrix(){
            this.matrixStack.shift();
        }

        render() {
            this.context.clearRect(0, 0, this.width, this.height);

            this.context.save();
            this.context.translate(400, 0);

            for (var i = 0, l = this.renderingQueue.length; i < l; i++) {
                var renderingItem = this.renderingQueue[i];

                if (renderingItem.object instanceof Point) {
                    this.renderPoint(renderingItem);
                }
                else if (renderingItem.object instanceof Polygon) {
                    this.renderPolygon(renderingItem);
                }
                else if (renderingItem.object instanceof Label) {
                    this.renderLabel(renderingItem);
                }
            }

            this.context.restore();
            this.renderingQueue = [];
        }

        renderLabel(renderingItem){
            var text = renderingItem.object.text;
            var point = renderingItem.matrix.toIsometric();
            this.drawText(text, renderingItem.object.color, point.x, point.y);
        }

        renderPolygon(renderingItem) {
            var polygon = renderingItem.object.polygon;
            var matrix = renderingItem.matrix;

            if (!polygon.length)
                return;

            if (polygon.debug) {
                debugger;
            }

            //Tile
            var texture = polygon.texture;
            if (texture) {
                var point = polygon[0].translate(matrix);
                var isoPoint = point.toIsometric(point);

                if (texture.offsetX) {
                    isoPoint.x -= texture.offsetX;
                }
                if (texture.offsetY) {
                    isoPoint.y -= texture.offsetY;
                }

                if (texture.clipWidth) {
                    this.context.drawImage(texture.image, texture.clipX, texture.clipY, texture.clipWidth, texture.clipHeight, isoPoint.x, isoPoint.y, texture.clipWidth, texture.clipHeight);

                    if (texture.drawBorder) {
                        this.context.beginPath();
                        this.context.moveTo(isoPoint.x, isoPoint.y);
                        this.context.lineTo(isoPoint.x + texture.clipWidth, isoPoint.y);
                        this.context.lineTo(isoPoint.x + texture.clipWidth, isoPoint.y + texture.clipHeight);
                        this.context.lineTo(isoPoint.x, isoPoint.y + texture.clipHeight);
                        this.context.lineTo(isoPoint.x, isoPoint.y);

                        this.context.strokeStyle = "rgb(0,0,0)";
                        this.context.stroke();
                    }
                }
                else {
                    this.context.drawImage(texture.image, isoPoint.x, isoPoint.y);
                }

                this.drawPolygonLabel(polygon, matrix, renderingItem.object.color);
            }
            else {
                var color;
                if (polygon.color) {
                    color = polygon.color.toCanvasColor();
                }
                else {
                    color = "rgba(200, 200, 200)";
                }

                if (polygon.solid) {
                    this.context.fillStyle = color;
                }
                else {
                    this.context.strokeStyle = color;
                }

                this.context.beginPath();
                var pointStart = polygon[0].translate(matrix).toIsometric();
                this.context.moveTo(pointStart.x, pointStart.y);

                for (var j = 1, k = polygon.length; j < k; j++) {
                    var point = polygon[j].translate(matrix).toIsometric();
                    this.context.lineTo(point.x, point.y);
                }
                this.context.lineTo(pointStart.x, pointStart.y);

                if (polygon.solid) {
                    this.context.fill();
                }
                else {
                    this.context.stroke();
                }

                this.drawPolygonLabel(polygon, matrix, renderingItem.object.color);
            }
        }

        renderPoint(renderingItem) {
            var pointerAxisLength = 100;
            var point = renderingItem.object.point;

            if (renderingItem.object.drawPointer) {
                var topPoint = new primitives.Point3D(point.x, point.y - pointerAxisLength, point.z);
                topPoint = topPoint.translate(renderingItem.matrix).toIsometric();
                var bottomPoint = new primitives.Point3D(point.x, point.y + pointerAxisLength, point.z);
                bottomPoint = bottomPoint.translate(renderingItem.matrix).toIsometric();

                var leftPoint = new primitives.Point3D(point.x - pointerAxisLength, point.y, point.z);
                leftPoint = leftPoint.translate(renderingItem.matrix).toIsometric();
                var rightPoint = new primitives.Point3D(point.x + pointerAxisLength, point.y, point.z);
                rightPoint = rightPoint.translate(renderingItem.matrix).toIsometric();

                var topAltPoint = new primitives.Point3D(point.x, point.y, point.z + pointerAxisLength);
                topAltPoint = topAltPoint.translate(renderingItem.matrix).toIsometric();
                var bottomAltPoint = new primitives.Point3D(point.x, point.y, point.z - pointerAxisLength);
                bottomAltPoint = bottomAltPoint.translate(renderingItem.matrix).toIsometric();

                this.drawLine(topPoint, bottomPoint, "rgb(0, 0, 255)");
                this.drawLine(leftPoint, rightPoint, "rgb(255, 0, 0)");
                //this.drawLine(topAltPoint, bottomAltPoint, "rgb(0, 255, 0)");
            }

            var color;
            if (renderingItem.object.color) {
                color = renderingItem.object.color.toCanvasColor();
            }
            else {
                color = "rgba(250, 0, 0)";
            }

            point = point.translate(renderingItem.matrix).toIsometric();
            this.context.strokeStyle = color;
            this.context.strokeRect(point.x, point.y, 4, 4);
        }

        drawLine(pointA, pointB, color){
            this.context.beginPath();
            this.context.moveTo(pointA.x, pointA.y);
            this.context.lineTo(pointB.x, pointB.y);

            this.context.strokeStyle = color;
            this.context.stroke();
        }

        drawText(text, color, x, y) {
            if (color) {
                color = color.toCanvasColor();
            }
            else {
                color = "rgba(200, 200, 200)";
            }

            this.context.fillStyle = color;
            this.context.fillText(text, x, y);
        }

        drawPolygonLabel(polygon, matrix, color) {
            if (polygon.label && polygon.length == 4) {
                var point = polygon[0].translate(matrix);
                var oppositePoint = polygon[2].translate(matrix);

                var width = oppositePoint.x - point.x;
                var height = oppositePoint.y - point.y;

                var textMeasures = this.context.measureText(polygon.label.text);
                var x = point.x + ((width / 2) - (textMeasures.width / 2));
                var y = point.y + ((height / 2));
                var isoTextPoint = new primitives.Point2D(x, y).toIsometric();
                isoTextPoint.x += polygon.label.offsetX;
                isoTextPoint.y += polygon.label.offsetY;

                this.drawText(polygon.label, color, isoTextPoint.x, isoTextPoint.y);
            }
        }
    }
});
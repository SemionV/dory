define(['primitives'], function(primitives){
    class DrawPrimitive{
        constructor(color, transformation = new primitives.Matrix3D()){
            this.color = color;
            this.transformation = transformation;
        }
    }

    class Polygon extends DrawPrimitive{
        constructor(polygon, color, wireFrame = true){
            super(color);
            this.polygon = polygon;
            this.wireFrame = wireFrame;
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
        constructor(image, point = new Point3D(), drawBorder = false, color = null){
            super(color);
            this.image = image;
            this.drawBorder = drawBorder;
            this.point = point;
        }
    }

    class Viewport{
        constructor(width, height, x = 0, y = 0){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }

    class Canvas2DIsometricRenderer{
        constructor(context, viewport){
            this.context = context;
            this.viewport = viewport;

            this.matrixStack = [];
            this.renderingQueue = [];

            this.centerPoint = new primitives.Point3D();

            this.labelPoint = new primitives.Point3D();
            this.labelPointIso = new primitives.Point2D();

            this.spritePoint = new primitives.Point3D();
            this.spritePointIso = new primitives.Point2D();

            this.pointPoint = new primitives.Point3D();
            this.pointPointIso = new primitives.Point2D();
            this.pointPointerTop = new primitives.Point3D();
            this.pointPointerTopIso = new primitives.Point3D();
            this.pointPointerBottom = new primitives.Point3D();
            this.pointPointerBottomIso = new primitives.Point3D();
            this.pointPointerLeft = new primitives.Point3D();
            this.pointPointerLeftIso = new primitives.Point3D();
            this.pointPointerRight = new primitives.Point3D();
            this.pointPointerRightIso = new primitives.Point3D();
        }

        addPrimitive(primitive){
            this.combineTransformations(primitive.transformation);
            this.renderingQueue.push(primitive);
        }

        combineTransformations(resultTransformation) {
            if (this.matrixStack.length) {
                this.matrixStack[this.matrixStack.length - 1].copyTo(resultTransformation);
                for (let i = this.matrixStack.length - 2; i >= 0; i--) {
                    resultTransformation.multiply(this.matrixStack[i], resultTransformation);
                }
            }
        }

        pushMatrix(transformation){
            this.matrixStack.unshift(transformation);
        }

        popMatrix(){
            this.matrixStack.shift();
        }

        render() {
            this.context.clearRect(this.viewport.x, this.viewport.y , this.viewport.width, this.viewport.height);

            this.context.save();

            var zeroPoint = new primitives.Point2D(this.viewport.width/2 + this.viewport.x, this.viewport.height/2 + this.viewport.y);
            this.context.translate(zeroPoint.x, zeroPoint.y);

            for (var i = 0, l = this.renderingQueue.length; i < l; i++) {
                var renderingItem = this.renderingQueue[i];

                if (renderingItem instanceof Point) {
                    this.renderPoint(renderingItem);
                }
                else if (renderingItem instanceof Polygon) {
                    this.renderPolygon(renderingItem);
                }
                else if (renderingItem instanceof Label) {
                    this.renderLabel(renderingItem);
                }
                else if(renderingItem instanceof Sprite){
                    this.renderSprite(renderingItem);
                }
            }

            this.context.restore();
            this.renderingQueue = [];
        }

        renderLabel(renderingItem){
            var text = renderingItem.text;
            renderingItem.transformation.transform(this.centerPoint, this.labelPoint).toIsometric(this.labelPointIso);
            this.drawText(text, renderingItem.color, this.labelPointIso.x, this.labelPointIso.y);
        }

        renderSprite(renderingItem){
            var image = renderingItem.image;
            renderingItem.transformation.transform(renderingItem.point ? renderingItem.point : this.centerPoint, this.spritePoint).toIsometric(this.spritePointIso);

            if (image.offsetX) {
                this.spritePointIso.x -= image.offsetX;
            }
            if (image.offsetY) {
                this.spritePointIso.y -= image.offsetY;
            }

            if (image.clipWidth) {
                this.context.drawImage(image.image, image.clipX, image.clipY, image.clipWidth,
                    image.clipHeight, this.spritePointIso.x, this.spritePointIso.y, image.clipWidth, image.clipHeight);

                if (renderingItem.drawBorder) {
                    let color = renderingItem.color ?
                        renderingItem.color.toCanvasColor() : "rgb(0,0,0)";

                    this.context.save();
                    this.context.setLineDash([5]);
                    this.drawRect(this.spritePointIso.x, this.spritePointIso.y, image.clipWidth, image.clipHeight, color);
                    this.context.restore();
                }
            }
            else {
                this.context.drawImage(image.image, this.spritePointIso.x, this.spritePointIso.y);

                if (renderingItem.drawBorder) {
                    let color = renderingItem.color ?
                        renderingItem.color.toCanvasColor() : "rgb(0,0,0)";

                    this.context.save();
                    this.context.setLineDash([5]);
                    this.drawRect(this.spritePointIso.x, this.spritePointIso.y, image.image.width, image.image.height, color);
                    this.context.restore();
                }
            }
        }

        renderPolygon(renderingItem){
            var polygon = renderingItem.polygon;
            var matrix = renderingItem.transformation;

            if(renderingItem.wireFrame){
                var color = renderingItem.color ? renderingItem.color.toCanvasColor() : "rgba(200, 200, 200)";

                this.context.beginPath();
                var pointStart = matrix.transform(polygon[0]).toIsometric();
                this.context.moveTo(pointStart.x, pointStart.y);

                for (let j = 1, k = polygon.length; j < k; j++) {
                    let point = matrix.transform(polygon[j]).toIsometric();
                    this.context.lineTo(point.x, point.y);
                }
                this.context.lineTo(pointStart.x, pointStart.y);

                this.context.strokeStyle = color;
                this.context.stroke();
            }
        }

        renderPoint(renderingItem) {
            var pointerAxisLength = 100;
            var point = renderingItem.point;

            if (renderingItem.drawPointer) {

                this.pointPointerTop.x = point.x;
                this.pointPointerTop.y = point.y - pointerAxisLength;
                this.pointPointerTop.z = point.z;
                renderingItem.transformation.transform(this.pointPointerTop, this.pointPointerTop).toIsometric(this.pointPointerTopIso);

                this.pointPointerBottom.x = point.x;
                this.pointPointerBottom.y = point.y + pointerAxisLength;
                this.pointPointerBottom.z = point.z;
                renderingItem.transformation.transform(this.pointPointerBottom, this.pointPointerBottom).toIsometric(this.pointPointerBottomIso);

                this.pointPointerLeft.x = point.x - pointerAxisLength;
                this.pointPointerLeft.y = point.y;
                this.pointPointerLeft.z = point.z;
                renderingItem.transformation.transform(this.pointPointerLeft, this.pointPointerLeft).toIsometric(this.pointPointerLeftIso);

                this.pointPointerRight.x = point.x + pointerAxisLength;
                this.pointPointerRight.y = point.y;
                this.pointPointerRight.z = point.z;
                renderingItem.transformation.transform(this.pointPointerRight, this.pointPointerRight).toIsometric(this.pointPointerRightIso);


                this.drawLine(this.pointPointerTopIso, this.pointPointerBottomIso, "rgb(0, 0, 255)");
                this.drawLine(this.pointPointerLeftIso, this.pointPointerRightIso, "rgb(255, 0, 0)");
            }

            var color;
            if (renderingItem.color) {
                color = renderingItem.color.toCanvasColor();
            }
            else {
                color = "rgba(250, 0, 0)";
            }

            renderingItem.transformation.transform(point, this.pointPoint).toIsometric(this.pointPointIso);
            this.context.strokeStyle = color;
            this.context.strokeRect(this.pointPointIso.x - 2, this.pointPointIso.y - 2, 4, 4);
        }

        drawRect(x, y, width, height, color){
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(x + width, y);
            this.context.lineTo(x + width, y + height);
            this.context.lineTo(x, y + height);
            this.context.lineTo(x, y);

            this.context.strokeStyle = color;
            this.context.stroke();
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
    }

    return {
        Polygon,
        Label,
        Point,
        Sprite,
        Canvas2DIsometricRenderer,
        Viewport
    }
});
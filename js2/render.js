define(['primitives'], function(primitives){
    class DrawPrimitive{
        constructor(color){
            this.color = color;
        }
    }

    class PointPrimitive extends DrawPrimitive{
        constructor(color, position = new primitives.Point3D()){
            super(color);
            this.position = position;
        }
    }

    class Polygon extends DrawPrimitive{
        constructor(polygon, color, wireFrame = true){
            super(color);
            this.polygon = polygon;
            this.wireFrame = wireFrame;
        }
    }

    class Label extends PointPrimitive{
        constructor(position, text, color){
            super(color, position);
            this.text = text;
        }
    }

    class Point extends PointPrimitive{
        constructor(position, color, drawPointer = false){
            super(color, position);
            this.drawPointer = drawPointer;
        }
    }

    class Sprite extends PointPrimitive{
        constructor(image, position, drawBorder = false, color = null){
            super(color, position);
            this.image = image;
            this.drawBorder = drawBorder;
        }
    }

    class Viewport{
        constructor(width, height, x = 0, y = 0, showCenter = false){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.showCenter = showCenter;
        }
    }

    class Canvas2DIsometricRenderer{
        constructor(context, viewport){
            this.context = context;
            this.viewport = viewport;

            this.matrixStack = [];
            this.renderingTasks = new Map();

            this.labelPointIso = new primitives.Point2D();
            this.spritePointIso = new primitives.Point2D();

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

        addPrimitive(entity, primitive){
            let entityTasks = this.renderingTasks.get(entity);
            if(!entityTasks){
                entityTasks = new Set();
                this.renderingTasks.set(entity, entityTasks);
            }

            entityTasks.add(primitive);
        }

        render() {
            let queue = this.buildQueue();

            this.context.clearRect(this.viewport.x, this.viewport.y , this.viewport.width, this.viewport.height);

            this.context.save();

            var zeroPoint = new primitives.Point2D(this.viewport.width/2 + this.viewport.x, this.viewport.height/2 + this.viewport.y);
            this.context.translate(zeroPoint.x, zeroPoint.y);

            for (let renderingItem of queue) {
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
            this.renderingTasks = new Map();

            if(this.viewport.showCenter) {
                this.drawLine(new primitives.Point2D(0, zeroPoint.y), new primitives.Point2D(this.viewport.width, zeroPoint.y));
                this.drawLine(new primitives.Point2D(zeroPoint.x, 0), new primitives.Point2D(zeroPoint.x, this.viewport.height));
            }
        }

        *buildQueue(){
            for(let [entity, primitives] of this.renderingTasks){
                yield *primitives;
            }
        }

        renderLabel(renderingItem){
            var text = renderingItem.text;
            renderingItem.position.toIsometric(this.labelPointIso);
            this.drawText(text, renderingItem.color, this.labelPointIso.x, this.labelPointIso.y);
        }

        renderSprite(renderingItem){
            var image = renderingItem.image;
            renderingItem.position.toIsometric(this.spritePointIso);

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

            if(renderingItem.wireFrame){
                var color = renderingItem.color ? renderingItem.color.toCanvasColor() : "rgba(200, 200, 200)";

                this.context.beginPath();
                var pointStart = polygon[0].toIsometric();
                this.context.moveTo(pointStart.x, pointStart.y);

                for (let j = 1, k = polygon.length; j < k; j++) {
                    let point = polygon[j].toIsometric();
                    this.context.lineTo(point.x, point.y);
                }
                this.context.lineTo(pointStart.x, pointStart.y);

                this.context.strokeStyle = color;
                this.context.stroke();
            }
        }

        renderPoint(renderingItem) {
            var pointerAxisLength = 100;
            var point = renderingItem.position;

            if (renderingItem.drawPointer) {

                this.pointPointerTop.x = point.x;
                this.pointPointerTop.y = point.y - pointerAxisLength;
                this.pointPointerTop.z = point.z;
                this.pointPointerTop.toIsometric(this.pointPointerTopIso);

                this.pointPointerBottom.x = point.x;
                this.pointPointerBottom.y = point.y + pointerAxisLength;
                this.pointPointerBottom.z = point.z;
                this.pointPointerBottom.toIsometric(this.pointPointerBottomIso);

                this.pointPointerLeft.x = point.x - pointerAxisLength;
                this.pointPointerLeft.y = point.y;
                this.pointPointerLeft.z = point.z;
                this.pointPointerLeft.toIsometric(this.pointPointerLeftIso);

                this.pointPointerRight.x = point.x + pointerAxisLength;
                this.pointPointerRight.y = point.y;
                this.pointPointerRight.z = point.z;
                this.pointPointerRight.toIsometric(this.pointPointerRightIso);


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

            point.toIsometric(this.pointPointIso);
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
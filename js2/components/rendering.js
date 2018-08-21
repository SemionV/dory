import {Component} from "./component.js";
import * as primitives from "../primitives.js";
import * as render from "../render.js";
import * as dataComponents from "./data.js";
import * as preRenderingComponents from "./preRendering.js";

export class RenderingComponent extends Component{
    constructor(name = null){
        super(name);
    }

    render(entity, view){

    }
}

export class PointDrawer extends RenderingComponent{
    constructor(color = new primitives.Color(0, 0, 0), drawPointer = true){
        super();
        this.color = color;
        this.drawPointer = drawPointer;
    }

    render(entity, view){
        let position = entity.getComponent(preRenderingComponents.CameraPosition);
        if(position){
            view.renderer.addPrimitive(entity, new render.Point(position.point, this.color, this.drawPointer));
        }
    }
}

export class SpriteDrawer extends RenderingComponent{
    constructor(drawBorder = false, color = new primitives.Color(0, 0, 0)){
        super();
        this.color = color;
        this.drawBorder = drawBorder;
        this.spritePrimitive = new render.Sprite(null, null, this.drawBorder, this.color);
    }

    render(entity, view){
        let position = entity.getComponent(preRenderingComponents.CameraPosition);
        var sprite = entity.getComponent(dataComponents.Sprite);
        if(position && sprite && sprite.image){
            this.spritePrimitive.image = sprite.image;
            this.spritePrimitive.position = position.point;
            view.renderer.addPrimitive(entity, this.spritePrimitive);
        }
    }
}

export class MeshDrawer extends RenderingComponent{
    constructor(meshComponent, wireFrame = true){
        super();
        this.meshComponent = meshComponent;
        this.wireFrame = wireFrame;
    }

    render(entity, view){
        if(this.meshComponent){
            var mesh = this.meshComponent.mesh;
            if(mesh){
                for(let polygon of mesh.polygons){
                    view.renderer.addPrimitive(new render.Polygon(polygon, polygon[0].color, this.wireFrame));
                }
            }
        }
    }
}

export class BoundingBoxBackDrawer extends RenderingComponent{
    render(entity, view){
        var boundingBox = entity.getComponent(dataComponents.BoundingBox);

        if(boundingBox){
            var box = boundingBox.box;
            if(box){
                let halfWidth = box.width / 2;
                let halfHeight = box.height / 2;

                let backColor = new primitives.Color(100, 100, 100, 1);

                let vertex1 = new primitives.Vertex(-halfWidth, -halfHeight, 0);
                let vertex2 = new primitives.Vertex(box.width - halfWidth, -halfHeight, 0);
                let vertex3 = new primitives.Vertex(box.width - halfWidth, box.height - halfHeight, 0);
                let vertex4 = new primitives.Vertex(0 - halfWidth, box.height - halfHeight, 0);

                let vertex5 = new primitives.Vertex(vertex1.x, vertex1.y, -box.altitude);
                let vertex6 = new primitives.Vertex(vertex2.x, vertex2.y, -box.altitude);
                let vertex7 = new primitives.Vertex(vertex3.x, vertex3.y, -box.altitude);
                let vertex8 = new primitives.Vertex(vertex4.x, vertex4.y, -box.altitude);

                var polygon1 = new primitives.Polygon(vertex1, vertex4, vertex3, vertex2);//bottom
                view.renderer.addPrimitive(new render.Polygon(polygon1, backColor, this.wireFrame));

                var polygon2 = new primitives.Polygon(vertex1, vertex2, vertex6, vertex5);
                view.renderer.addPrimitive(new render.Polygon(polygon2, backColor, this.wireFrame));

                var polygon5 = new primitives.Polygon(vertex4, vertex1, vertex5, vertex8);
                view.renderer.addPrimitive(new render.Polygon(polygon5, backColor, this.wireFrame));
            }
        }
    }
}

export class BoundingBoxFrontDrawer extends RenderingComponent{
    render(entity, view){
        var boundingBox = entity.getComponent(dataComponents.BoundingBox);

        if(boundingBox){
            var box = boundingBox.box;
            if(box){
                let halfWidth = box.width / 2;
                let halfHeight = box.height / 2;

                let topSideColor = new primitives.Color(255, 0, 0, 1);
                let leftSideColor = new primitives.Color(0, 255, 0, 1);
                let frontSideColor = new primitives.Color(0, 0, 255, 1);

                let vertex1 = new primitives.Vertex(-halfWidth, -halfHeight, 0);
                let vertex2 = new primitives.Vertex(box.width - halfWidth, -halfHeight, 0);
                let vertex3 = new primitives.Vertex(box.width - halfWidth, box.height - halfHeight, 0);
                let vertex4 = new primitives.Vertex(0 - halfWidth, box.height - halfHeight, 0);

                let vertex5 = new primitives.Vertex(vertex1.x, vertex1.y, -box.altitude);
                let vertex6 = new primitives.Vertex(vertex2.x, vertex2.y, -box.altitude);
                let vertex7 = new primitives.Vertex(vertex3.x, vertex3.y, -box.altitude);
                let vertex8 = new primitives.Vertex(vertex4.x, vertex4.y, -box.altitude);

                var polygon3 = new primitives.Polygon(vertex2, vertex3, vertex7, vertex6);//front
                view.renderer.addPrimitive(new render.Polygon(polygon3, frontSideColor, this.wireFrame));

                var polygon4 = new primitives.Polygon(vertex3, vertex4, vertex8, vertex7);//left
                view.renderer.addPrimitive(new render.Polygon(polygon4, leftSideColor, this.wireFrame));

                var polygon6 = new primitives.Polygon(vertex5, vertex6, vertex7, vertex8);//top
                view.renderer.addPrimitive(new render.Polygon(polygon6, topSideColor, this.wireFrame));
            }
        }
    }
}
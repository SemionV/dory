define(['primitives', 'render'], function(primitives, render){
    class Component{
        constructor(name = null){
            this.name = name;
        }
    }

    class StateComponent extends Component{
        constructor(name = null){
            super(name);
        }

        update(entity, events){

        }
    }

    class RenderingComponent extends Component{
        constructor(name = null){
            super(name);
        }

        render(entity, renderer){

        }
    }

    class PositionComponent extends Component{
        constructor(){
            super();
            this.translation = new primitives.Point3D(0, 0, 0);
        }
    }

    class CameraComponent extends Component{
        constructor(renderer){
            super();
            this.renderer = renderer;
        }
    }

    class PointDrawer extends RenderingComponent{
        constructor(color = new primitives.Color(0, 0, 0), drawPointer = true){
            super();
            this.color = color;
            this.drawPointer = drawPointer;
        }

        render(entity, renderer){
            renderer.addPrimitive(new render.Point(new primitives.Point3D(), this.color, this.drawPointer));
        }
    }

    class SpriteComponent extends Component{
        constructor(image){
            super();
            this.image = image;
        }
    }

    class SpriteDrawer extends RenderingComponent{
        constructor(drawBorder = false, color = new primitives.Color(0, 0, 0)){
            super();
            this.color = color;
            this.drawBorder = drawBorder;
        }

        render(entity, renderer){
            var sprite = entity.getComponent(SpriteComponent);
            if(sprite && sprite.image){
                renderer.addPrimitive(new render.Sprite(sprite.image, this.drawBorder, this.color));
            }
        }
    }

    class MeshComponent extends Component{
        constructor(name, mesh){
            super(name);
            this.mesh = mesh;
        }
    }

    class BoundingVolumeComponent extends MeshComponent{
        constructor(mesh){
            super(null, mesh);
        }
    }

    class BoundingBoxComponent extends BoundingVolumeComponent{
        constructor(box, color){
            super(this.buildMesh(box, color));
            this.box = box;
            this.color = color;
        }

        buildMesh(box, color){
            return primitives.Mesh.fromBox(box, color);
        }
    }

    class MeshDrawer{
        constructor(meshComponent, wireFrame = true){
            this.meshComponent = meshComponent;
            this.wireFrame = true;
        }

        render(entity, renderer){

        }
    }

    return {
        Component,
        StateComponent,
        RenderingComponent,
        PositionComponent,
        CameraComponent,
        PointDrawer,
        SpriteComponent,
        SpriteDrawer,
        MeshComponent,
        BoundingVolumeComponent,
        BoundingBoxComponent
    };
});

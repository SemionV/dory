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

    return {
        Component,
        StateComponent,
        RenderingComponent,
        PositionComponent,
        CameraComponent,
        PointDrawer,
        SpriteComponent,
        SpriteDrawer
    };
});

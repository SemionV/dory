define(['primitives', 'render'], function(primitives, render){
    class Component{
        constructor(name){
            this.name = name;
        }
    }

    class StateComponent extends Component{
        constructor(name){
            super(name);
        }

        update(entity, events){

        }
    }

    class RenderingComponent extends Component{
        constructor(name){
            super(name);
        }

        render(entity, renderer){

        }
    }

    class PositionComponent extends Component{
        constructor(name){
            super(name);
            this.translation = new primitives.Point3D(0, 0, 0);
        }
    }

    class CameraComponent extends Component{
        constructor(name, renderer){
            super(name);
            this.renderer = renderer;
        }
    }

    class PointDrawer extends RenderingComponent{
        constructor(name, color = new primitives.Color(0, 0, 0), drawPointer = true){
            super(name);
            this.color = color;
            this.drawPointer = drawPointer;
        }

        render(entity, renderer){
            renderer.addPrimitive(new render.Point(new primitives.Point3D(), this.color, this.drawPointer));
        }
    }

    return {
        Component,
        StateComponent,
        RenderingComponent,
        PositionComponent,
        CameraComponent,
        PointDrawer
    };
});

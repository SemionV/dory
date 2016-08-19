define(['primitives'], function(primitives){
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

    return {
        Component,
        StateComponent,
        RenderingComponent,
        PositionComponent,
        CameraComponent
    };
});

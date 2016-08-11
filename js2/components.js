define(function(){
    var exports = {};

    class Component{
        constructor(name){
            this.name = name;
        }
    }

    class StateComponent extends Component{
        constructor(name){
            super(name);
        }
    }

    class RenderingComponent extends Component{
        constructor(name){
            super(name);
        }
    }

    return {
        Component,
        StateComponent,
        RenderingComponent
    };
});

define(['./component', './postUpdate', 'primitives'], function(component, postUpdateComponents, primitives){
    class PreRenderingComponent extends component.Component{
        constructor(name = null){
            super(name);
        }

        process(entity, view){

        }
    }

    class CameraPosition extends PreRenderingComponent{
        constructor(){
            super();
            this.point = new primitives.Point3D();
        }

        process(entity, view){
            this.point.reset();
            let position = entity.getComponent(postUpdateComponents.Position);
            let cameraTransformation = view.camera.getComponent(postUpdateComponents.CameraTransformation);
            if(position && position.point){
                position.point.copyTo(this.point);
                if(cameraTransformation){
                    cameraTransformation.transformation.transform(this.point, this.point);
                }
            }
        }
    }

    return {
        PreRenderingComponent,
        CameraPosition
    };
});

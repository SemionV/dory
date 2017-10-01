define(['./component', './postUpdate', './data', 'primitives'],
    function(component, postUpdateComponents, data, primitives){
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

    class ProjectPositionToIsoCamera extends PreRenderingComponent{
        constructor(){
            super();
        }

        process(entity, view){
            let position = entity.getComponent(postUpdateComponents.Position);
            let projection = entity.getComponent(data.ProjectedPosition);
            let cameraComponent = view.camera.getComponent(data.IsometricCamera);

            if(position && projection && cameraComponent && cameraComponent.zAlignedDimensions){
                //TODO: calculate projection to cameraComponent.zAlignedDimensions
                position.copyTo(projection.point);
            }
        }
    }

    return {
        PreRenderingComponent,
        CameraPosition,
        ProjectPositionToIsoCamera
    };
});

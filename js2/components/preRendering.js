import {Component} from "./component.js";
import * as primitives from "../primitives.js";
import * as data from "./data.js";
import * as postUpdateComponents from "./postUpdate.js";

export class PreRenderingComponent extends Component{
    constructor(name = null){
        super(name);
    }

    process(entity, view){

    }
}

export class CameraPosition extends PreRenderingComponent{
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

export class ProjectPositionToIsoCamera extends PreRenderingComponent{
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

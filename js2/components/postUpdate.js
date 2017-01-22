define(['./component', './data', 'primitives'], function(component, dataComponents, primitives){
    class PostUpdateComponent extends component.Component{
        constructor(name = null){
            super(name);
        }

        process(entity, events){

        }
    }

    class CombinedTransformation extends PostUpdateComponent{
        constructor(){
            super();
            this.transformation = null;
        }

        process(entity, events){
            let properties = entity.getComponent(dataComponents.Properties);
            let isStatic = properties ? properties.isStatic : false;

            if(!isStatic || !this.transformation){
                if(!this.transformation){
                    this.transformation = new primitives.Matrix3D();
                }

                let parents = entity.getParents();
                let parentCot = null;
                for(let parent of parents){
                    let parentCot = parent.getComponent(CombinedTransformation);
                    if(parentCot){
                        break;
                    }
                }

                let transformationComponent = entity.getComponent(dataComponents.Transformation);

                if(parentCot){
                    if(transformationComponent){
                        parentCot.transformation.multiply(transformationComponent.transformation, this.transformation);
                    }
                    else{
                        parentCot.transformation.copyTo(this.transformation);
                    }
                }
                else if(transformationComponent){
                    transformationComponent.transformation.copyTo(this.transformation)
                }
            }
        }
    }

    class Position extends PostUpdateComponent{
        constructor(combinedTransformationComponent){
            super();
            this.point = null;
            this.cotComponent = combinedTransformationComponent;
        }

        process(entity, events){
           let properties = entity.getComponent(dataComponents.Properties);
            let isStatic = properties ? properties.isStatic : false;

            if(this.cotComponent && (!isStatic || !this.point)){
                if(!this.point){
                    this.point = new primitives.Point3D();
                }

                this.point.reset();
                this.cotComponent.transformation.transform(this.point, this.point)
            }
        }
    }

    class CameraTransformation extends PostUpdateComponent{
        constructor(){
            super();
            this.transformation = new primitives.Matrix3D();
            this.invertMatrix = new primitives.Matrix3D();
        }

        process(entity, events){
            this.transformation.toIdentity();
            let transformationComponent = entity.getComponent(dataComponents.Transformation);
            if(transformationComponent){
                transformationComponent.transformation.invert(this.transformation);
            }

            let parents = entity.getParents();
            for(let parent of parents){
                transformationComponent = parent.getComponent(dataComponents.Transformation);
                if(transformationComponent){
                    transformationComponent.transformation.invert(this.invertMatrix);
                    this.transformation.multiply(this.invertMatrix, this.transformation);
                }
            }
        }
    }

    return {
        PostUpdateComponent,
        Position,
        CombinedTransformation,
        CameraTransformation
    };
});

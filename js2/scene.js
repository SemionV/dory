define(['components', 'primitives'], function(components, primitives){
    var entityComponentsSymbol = Symbol();
    var entityChildrenSymbol = Symbol();

    class Entity{
        constructor(){
            this[entityComponentsSymbol] = new Set();
            this[entityChildrenSymbol] = new Set();
            this.parent = null;
        }

        getComponent(type){
            for(let x of this.components){
                if(x instanceof type){
                    return x;
                }
            }
        }

        *getComponents(type){
            for(let x of this.components){
                if(x instanceof type){
                    yield x;
                }
            }
        }

        addComponent(component){
            this[entityComponentsSymbol].add(component);
        }

        get components(){
            return this[entityComponentsSymbol].values();
        }

        addChild(entity){
            entity.parent = this;
            this[entityChildrenSymbol].add(entity);
        }

        removeChild(entity){
            entity.parent = null;
            this[entityChildrenSymbol].delete(entity);
        }

        get children(){
            return this[entityChildrenSymbol].values();
        }

        *getParents(){
            let parent = this.parent;
            while(parent){
                yield parent;
                parent = parent.parent;
            }
        }

        update(events){
            for(let child of this.children){
                child.update(events);
            }

            this.updateComponents(events);
        }

        updateComponents(events){
            var stateComponents = this.getComponents(components.StateComponent);
            for(let component of stateComponents){
                component.update(this, events);
            }
        }

        processPostUpdate(events){
            this.processPostUpdateComponents(events);

            for(let child of this.children){
                child.processPostUpdate(events);
            }
        }

        processPostUpdateComponents(events){
            var postUpdateComponents = this.getComponents(components.PostUpdateComponent);
            for(let component of postUpdateComponents){
                component.process(this, events);
            }
        }

        processPreRendering(camera){
            this.processPreRenderingComponents(camera);

            for(let child of this.children){
                child.processPreRendering(camera);
            }
        }

        processPreRenderingComponents(camera){
            var preRenderingComponents = this.getComponents(components.PreRenderingComponent);
            for(let component of preRenderingComponents){
                component.process(this, camera);
            }
        }

        draw(renderer){
            for(let child of this.children){
                child.draw(renderer);
            }

            this.drawComponents(renderer);
        }

        drawComponents(renderer){
            var drawComponents = this.getComponents(components.RenderingComponent);
            for(let component of drawComponents){
                component.render(this, renderer);
            }
        }
    }

    class SceneManager{
        constructor(){
            this.entities = new Map();
            this.eventHandlers = new Map();
            this.cameraTransformation = new primitives.Matrix3D();
            this.cameras = new Set();
        }

        update(events){
            //Process events from previous heart beat
            for(let [type, handlers] of this.eventHandlers){
                for(let event of events){
                    if(event instanceof type){
                        for(let handler of handlers){
                            handler(event);
                        }
                    }
                }
            }

            for(let entity of this.entities.values()){
                entity.update(events);
            }

            for(let entity of this.entities.values()){
                entity.processPostUpdate(events);
            }
        }

        draw(){
            for(let camera of this.getActiveCameras()){
                this.drawFromCamera(camera);
            }
        }

        drawFromCamera(camera){
            let cameraComponent = camera.getComponent(components.CameraComponent);

            if(cameraComponent){
                let renderer = cameraComponent.renderer;
                var visibleEntities = this.getVisibleEntities();

                for(let entity of visibleEntities){
                    entity.processPreRendering(camera);
                }

                for(let entity of visibleEntities){
                    entity.draw(renderer);
                }

                renderer.render();
            }
        }

        getVisibleEntities(){
            return this.entities.values();
        }

        getActiveCameras(){
            return this.cameras;
        }

        addEventHandler(eventType, callback){
            var set = this.eventHandlers.get(eventType);
            if(!set){
                set = new Set();
                this.eventHandlers.set(eventType, set);
            }

            if(!set.has(callback)){
                set.add(callback);
            }
        }

        removeEventHandler(eventType, callback){
            var set = this.eventHandlers.get(eventType);
            if(set){
                set.delete(callback);
            }
        }

        addEntity(key, entity){
            let cameras = this.lookUpForCameras(entity);
            for(let camera of cameras){
                if(!this.cameras.has(camera)){
                    this.cameras.add(camera);
                } else {
                    throw new Error(`The camera was already attached to the scene`);
                }
            }
            this.entities.set(key, entity);
        }

        *lookUpForCameras(entity){
            var cameraComponent = entity.getComponent(components.CameraComponent);
            if(cameraComponent){
                yield entity;
            }

            for(let child of entity.children){
                yield *this.lookUpForCameras(child);
            }
        }

        removeEntity(key){
            let entity = this.entities.get(key);
            if(entity){
                let cameras = this.lookUpForCameras(entity);
                for(let camera of cameras){
                    if(this.cameras.has(camera)){
                        this.cameras.delete(camera);
                    }
                }
                this.entities.delete(key);
            }
        }

        getEntity(key){
            return this.entities.get(key);
        }
    }

    class PointEntity extends Entity{
        constructor(){
            super();
            this.addComponent(new components.TransformationComponent());
            this.addComponent(new components.CombinedTransformationComponent());
            this.addComponent(new components.PositionComponent());
            this.addComponent(new components.CameraPositionComponent());
        }
    }

    class Camera extends Entity{
        constructor(renderer){
            super();
            this.addComponent(new components.CameraComponent(renderer));
            this.addComponent(new components.TransformationComponent());
            this.addComponent(new components.CombinedTransformationComponent());
            this.addComponent(new components.CameraTransformationComponent());
        }
    }

    return {
        Entity,
        SceneManager,
        PointEntity,
        Camera
    };
});

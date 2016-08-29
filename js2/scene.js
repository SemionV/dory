define(['components', 'primitives'], function(components, primitives){
    var entityComponentsSymbol = Symbol();
    var entityChildrenSymbol = Symbol();

    class Entity{
        constructor(){
            this[entityComponentsSymbol] = new Set();
            this[entityChildrenSymbol] = new Set();
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

        addChild(component){
            this[entityChildrenSymbol].add(component);
        }

        get children(){
            return this[entityChildrenSymbol].values();
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

        draw(renderer, camera){
            let position = this !== camera ? this.getComponent(components.PositionComponent) : null;
            if(position){
                renderer.pushMatrix(position.transformation);
            }

            for(let child of this.children){
                child.draw(renderer, camera);
            }

            this.drawComponents(renderer);

            if(position){
                renderer.popMatrix();
            }
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
                let cameraPosition = camera.getComponent(components.PositionComponent);

                if(cameraPosition){
                    cameraPosition.transformation.invert(this.cameraTransformation);
                    renderer.pushMatrix(this.cameraTransformation);
                }

                var visibleEntities = this.getVisibleEntities();
                for(let entity of visibleEntities){
                    entity.draw(renderer, camera);
                }

                if(cameraPosition){
                    renderer.popMatrix();
                }

                renderer.render();
            }
        }

        getVisibleEntities(){
            return this.entities.values();
        }

        *getActiveCameras(){
            for(let entity of this.entities.values()){
                var cameraComponent = entity.getComponent(components.CameraComponent);
                if(cameraComponent){
                    yield entity;
                }
            }
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
            this.entities.set(key, entity);
        }

        getEntity(key){
            return this.entities.get(key);
        }
    }

    return {
        Entity,
        SceneManager
    };
});

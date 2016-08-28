define(['components'], function(components){
    var entityComponentsSymbol = Symbol();

    class Entity{
        constructor(){
            this[entityComponentsSymbol] = new Set();
        }

        getComponent(type){
            for(let x of this.components()){
                if(x instanceof type){
                    return x;
                }
            }
        }

        *getComponents(type){
            for(let x of this.components()){
                if(x instanceof type){
                    yield x;
                }
            }
        }

        addComponent(component){
            this[entityComponentsSymbol].add(component);
        }

        components(){
            return this[entityComponentsSymbol].values();
        }

        update(events){
            var stateComponents = this.getComponents(components.StateComponent);
            for(let component of stateComponents){
                component.update(this, events);
            }
        }

        draw(renderer){
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
                    renderer.pushMatrix(cameraPosition.translation.multiply(-1));
                }

                var visibleEntities = this.getVisibleEntities();
                for(let entity of visibleEntities){
                    let position = entity !== camera ? entity.getComponent(components.PositionComponent) : null;
                    if(position){
                        renderer.pushMatrix(position.translation);
                    }
                    entity.draw(renderer);
                    if(position){
                        renderer.popMatrix();
                    }
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

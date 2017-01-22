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
            var stateComponents = this.getComponents(components.UpdateComponent);
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

        draw(view){
            for(let child of this.children){
                child.draw(view);
            }

            this.drawComponents(view);
        }

        drawComponents(view){
            var drawComponents = this.getComponents(components.RenderingComponent);
            for(let component of drawComponents){
                component.render(this, view);
            }
        }
    }

    class SceneManager{
        constructor(){
            this.entities = new Map();
            this.eventHandlers = new Map();
            this.views = new Set();
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

        addView(view){
            this.views.add(view);
        }

        removeView(view){
            this.views.delete(view);
        }

        draw(){
            for(let view of this.getActiveViews()){
                this.drawView(view);
            }
        }

        drawView(view){
            let renderer = view.renderer;

            for(let entity of this.getVisibleEntities()){
                entity.processPreRendering(view);
            }

            for(let entity of this.getVisibleEntities()){
                entity.draw(view);
            }

            renderer.render();
        }

        getVisibleEntities(){
            return this.entities.values();
        }

        getActiveViews(){
            return this.views;
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

        removeEntity(key){
            let entity = this.entities.get(key);
            if(entity){
                this.entities.delete(key);
            }
        }

        getEntity(key){
            return this.entities.get(key);
        }
    }

    class View{
        constructor(renderer, camera){
            this.renderer = renderer;
            this.camera = camera;
        }
    }

    class TransformableEntity extends Entity{
        constructor(transformation = new primitives.Matrix3D()){
            super();
            this.addComponent(new components.data.Transformation(transformation));
            this.addComponent(new components.postUpdate.CombinedTransformation());
        }

        get transformation(){
            return this.getComponent(components.data.Transformation).transformation;
        }
    }

    class PointEntity extends TransformableEntity{
        constructor(transformation){
            super(transformation);
            let cotComponent = this.getComponent(components.postUpdate.CombinedTransformation);
            this.addComponent(new components.postUpdate.Position(cotComponent));
            this.addComponent(new components.preRendering.CameraPosition());
        }
    }

    class Camera extends TransformableEntity{
        constructor(transformation){
            super(transformation);
            this.addComponent(new components.data.Camera());
            this.addComponent(new components.postUpdate.CameraTransformation());
        }
    }

    class SpriteEntity extends PointEntity{
        constructor(sprite, transformation){
            super(transformation);
            this.addComponent(new components.data.Sprite(sprite));
            this.addComponent(new components.rendering.SpriteDrawer());
        }
    }

    return {
        Entity,
        SceneManager,
        View,
        TransformableEntity,
        PointEntity,
        Camera,
        SpriteEntity
    };
});

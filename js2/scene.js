define(function(){
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
    }

    return {
        Entity
    };
});

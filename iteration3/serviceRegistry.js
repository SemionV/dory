export class ServiceRegistry {
    constructor() {
        this.registry = new Map();
        this.instancies = new Map();
    }

    registerService(serviceType, ...dependencies) {
        this.registerServiceImplementation(serviceType, serviceType, ...dependencies);
    }

    registerServiceImplementation(serviceType, implementationType, ...dependencies) {
        this.registry[serviceType] = {implementationType: implementationType, dependencies: dependencies};
    }

    getInstance(serviceType) {
        let instance = this.instancies.get(serviceType);
        if(!instance) {
            let dependencyInstancies = new Set();
            let definition = this.registry[serviceType];
            if(definition) {
                let dependencies = definition.dependencies;
                if(dependencies) {
                    for(let dependency of dependencies){
                        let dependencyInstance = this.getInstance(dependency);
                        dependencyInstancies.add(dependencyInstance);
                    }
                }

                instance = new definition.implementationType(...dependencyInstancies);
                this.instancies.set(serviceType, instance);
            }
        }

        return instance;
    }
}
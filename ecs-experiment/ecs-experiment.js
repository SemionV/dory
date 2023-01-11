import * as bitecs from "../js2/bitecs/index.js"
import * as di from "../iteration3/serviceRegistry.js"
import * as storages from "../iteration3/componentStorage/componentStorage.js"
import * as fieldTypes from "../iteration3/componentStorage/fieldTypes.js"

let numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let bitEcsSetupTest = window.bitEcsSetupTest = (componentsNumber) => {
    const GameComponentSchema = { id: bitecs.Types.i32, userId: bitecs.Types.i32, amountDue: bitecs.Types.f32};

    const GameComponent = bitecs.defineComponent(GameComponentSchema);

    let world  = bitecs.createWorld();

    for(let i = 0; i < componentsNumber; ++i) {
        let entity = bitecs.addEntity(world);
        bitecs.addComponent(world, GameComponent, entity);

        GameComponent.id[entity] = i;
        GameComponent.userId[entity] = i + 100;
        GameComponent.amountDue[entity] = i + 0.0;
    }

    const gameComponentQuery = bitecs.defineQuery([GameComponent]);

    return {
        query: gameComponentQuery,
        world: world,
        gameComponent: GameComponent,
        componentsNumber: componentsNumber
    }
}

let bitEcsAccessTest = window.bitEcsAccessTest = (setup) => {
    let entities = setup.query(setup.world);
    const GameComponent = setup.gameComponent;

    let entitiesCount = setup.componentsNumber

    setup.result = 0;

    let start = performance.now();

    for (let i = 0; i < entitiesCount; ++i) {
        const entityId = entities[i];

        setup.result += (GameComponent.id[entityId] + GameComponent.userId[entityId] + GameComponent.amountDue[entityId]);
        //setup.result += (GameComponent.id[entityId] + GameComponent.userId[entityId] + GameComponent.amountDue[entityId]) / Math.cos(i);
    }

    let end = performance.now();

    console.log(`bitEcs on ${numberWithCommas(entitiesCount)}: ${end - start}`);
}

class GameComponent {
}

class GameComponentAccess {
    constructor(view){
        this.blockSize = 12;
        this.view = view;
    }

    read(index, toInstance) {
        let offset = index * this.blockSize;
        toInstance.id = this.view.getInt32(offset, true);
        toInstance.userId = this.view.getInt32(offset + 4, true);
        toInstance.amountDue = this.view.getFloat32(offset + 8, true);
    }

    write(index, instance) {
        let offset = index * this.blockSize;

        this.view.setInt32(offset, instance.id, true)
        this.view.setInt32(offset + 4, instance.userId, true)
        this.view.setFloat32(offset + 8, instance.amountDue, true)
    }

    get slotsCount() {
        return this.view.byteLength / this.blockSize;
    }
}

let setupComponentMap = (view, blockSize) => {
    return {
        id: (index) => {
            return view.getInt32(index * blockSize, true);
        },
        userId: (index) => {
            return view.getInt32(index * blockSize + 4, true);
        },
        amountDue: (index) => {
            return view.getFloat32(index * blockSize + 8, true);
        }
    };
}

let doryEcsSetupTest = window.doryEcsSetupTest = (componentsNumber) => {
    const buffer = new ArrayBuffer(12 * componentsNumber);
    const view = new DataView(buffer, 0);

    let start = performance.now();

    let access = new GameComponentAccess(view);
    let map = setupComponentMap(view, 12);

    for(let i = 0; i < componentsNumber; ++i) {
        access.write(i, {id: i, userId: i + 100, amountDue: i + 0.0});
    }

    let end = performance.now();

    console.log(`doryEcs setup: ${end - start}`);

    return {
        access: access,
        map: map
    }
}

let doryEcsAccessTest = window.doryEcsAccessTest = (setup) => {
    let access = setup.access;
   
    let component = new GameComponent();
    let count = access.slotsCount;

    setup.result = 0;

    let start = performance.now();

    for(let i = 0; i < count; ++i) {
        access.read(i, component);
        
        setup.result += component.id + component.userId + component.amountDue;
        //setup.result += (component.id + component.userId + component.amountDue) / Math.cos(i);
        //let result = (component.id + component.userId + component.amountDue) / Math.cos(i);
    }

    let end = performance.now();

    console.log(`doryEcs on ${numberWithCommas(count)}: ${end - start}`);
}

let doryMapAccessTest = window.doryMapAccessTest = (setup) => {
    let map = setup.map;
    let access = setup.access;
    let count = access.slotsCount;

    setup.result = 0;

    let start = performance.now();

    for(let i = 0; i < count; ++i) {
        setup.result += map.id(i) + map.userId(i) + map.amountDue(i);
    }

    let end = performance.now();

    console.log(`doryMap on ${numberWithCommas(count)}: ${end - start}`);
}

let csSetupTest = window.csSetupTest = (componentsNumber) => {
    let componentSchema = {
        id: fieldTypes.Uint32,
        userId: fieldTypes.Uint32,
        amountDue: fieldTypes.Float32,
    };

    let start = performance.now();

    let storage = new storages.ComponentStorage(componentsNumber, componentSchema);

    for(let i = 0; i < componentsNumber; ++i) {
        storage.saveComponent(i, {id: i, userId: i + 100, amountDue: i + 0.0});
    }

    let end = performance.now();

    console.log(`cs setup: ${end - start}`);

    return {
        storage: storage
    }
}

let csAccessTest = window.csAccessTest = (setup) => {
    let storage = setup.storage;    
    let count = storage.slotsCount;
    setup.result = 0;

    let start = performance.now();

    storage.forEach((component) => {
        setup.result += component.id + component.userId + component.amountDue;
    });

    let end = performance.now();

    console.log(`cs on ${numberWithCommas(count)}: ${end - start}`);
}

let arraySetupTest = window.arraySetupTest = (componentsNumber) => {
    let start = performance.now();


    let array = new Array(componentsNumber);

    for(let i = 0; i < componentsNumber; ++i) {
        array[i] = {id: i, userId: i + 100, amountDue: i + 0.0};
    }

    let end = performance.now();

    console.log(`array setup: ${end - start}`);

    return {
        array: array
    }
}

let arrayAccessTest = window.arrayAccessTest = (setup) => {
    let array = setup.array;
    
    let count = array.length;

    setup.result = 0;
    setup.counter = 0;

    let start = performance.now();

    for(let i = 0; i < count; ++i) {
        let component = array[i];
        setup.result += component.id + component.userId + component.amountDue;
        setup.counter++;
    }

    let end = performance.now();

    console.log(`arrays on ${numberWithCommas(count)}: ${end - start}`);
}


//Dependecy Injection experiment

class PositionService {
    
}

class Service {

}

class GameService extends Service {
    constructor(positionService) {
        super();
        this.positionService = positionService;
    }
}

class ArcadeGameService extends GameService {
    constructor(positionService) {
        super(positionService);
    }
}

let serviceRegistry = window.serviceRegistry = new di.ServiceRegistry();
window.Service = Service;
window.GameService = GameService;
window.ArcadeGameService = ArcadeGameService;

serviceRegistry.registerServiceImplementation(GameService, ArcadeGameService, ...[PositionService]);
serviceRegistry.registerService(PositionService);

window.gameService = serviceRegistry.getInstance(GameService);

//Component mapping experiment

class EntityId extends fieldTypes.Uint32{

}

let componentSchema = {
    x: fieldTypes.Float32,
    y: fieldTypes.Float32,
    color: {
        r: fieldTypes.Uint16,
        g: fieldTypes.Uint16,
        b: fieldTypes.Uint16,
        a: fieldTypes.Uint16
    },
    matrix: [fieldTypes.Float32, 16],
    entityId: EntityId
}

let component = window.component = {
    x: 21.3,
    y: 34.2,
    color: {
        r: 234,
        g: 45,
        b: 96,
        a: 0
    },
    matrix: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
    entityId: 1
}
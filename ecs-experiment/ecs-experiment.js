import * as bitecs from "../js2/bitecs/index.js"
import * as di from "../iteration3/serviceRegistry.js"
import * as mapping from "../iteration3/componentStorage/componentMapping.js"
import * as fieldTypes from "../iteration3/componentStorage/fieldTypes.js"

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

    console.log(`count: ${entitiesCount}`);
    setup.result = 0;

    let start = performance.now();

    for (let i = 0; i < entitiesCount; ++i) {
        const entityId = entities[i];

        setup.result += (GameComponent.id[entityId] + GameComponent.userId[entityId] + GameComponent.amountDue[entityId]) / Math.cos(i);
    }

    let end = performance.now();

    return end - start
}

class GameComponent {
}

class GameComponentAccess {
    constructor(view){
        this.blockSize = 12;
        this.view = view;
    }

    readId(index) {
        let offset = index * this.blockSize + 0;
        return this.view.getInt32(offset, true);
    }

    writeId(index, value) {
        let offset = index * this.blockSize + 0;
        return this.view.setInt32(offset, value, true);
    }

    readUserId(index) {
        let offset = index * this.blockSize + 4;
        return this.view.getInt32(offset, true);
    }

    writeUserId(index, value) {
        let offset = index * this.blockSize + 4;
        return this.view.setInt32(offset, value, true);
    }

    readAmountDue(index) {
        let offset = index * this.blockSize + 8;
        return this.view.getFloat32(offset, true);
    }

    writeAmountDue(index, value) {
        let offset = index * this.blockSize + 8;
        return this.view.setFloat32(offset, value, true);
    }

    read(index, toInstance) {
        toInstance.id = this.readId(index);
        toInstance.userId = this.readUserId(index);
        toInstance.amountDue = this.readAmountDue(index);
    }

    write(index, instance) {
        this.writeId(index, instance.id);
        this.writeUserId(index, instance.userId);
        this.writeAmountDue(index, instance.amountDue);
    }

    get slotsCount() {
        return this.view.byteLength / this.blockSize;
    }
}

let doryEcsSetupTest = window.doryEcsSetupTest = (componentsNumber) => {
    const buffer = new ArrayBuffer(12 * componentsNumber);
    const view = new DataView(buffer, 0);

    let access = new GameComponentAccess(view);

    for(let i = 0; i < componentsNumber; ++i) {
        access.write(0, {id: i, userId: i + 100, amountDue: i + 0.0});
    }

    return {
        access: access
    }
}

let doryEcsAccessTest = window.doryEcsAccessTest = (setup) => {
    let access = setup.access;
    
    let component = new GameComponent();
    let count = access.slotsCount;

    setup.result = 0;

    console.log(`count: ${count}`);

    let start = performance.now();

    for(let i = 0; i < count; ++i) {
        access.read(i, component);
        
        //setup.result += component.id + component.userId + component.amountDue;
        setup.result += (component.id + component.userId + component.amountDue) / Math.cos(i);
        //let result = (component.id + component.userId + component.amountDue) / Math.cos(i);
    }

    let end = performance.now();

    return end - start;
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
    entityId: EntityId,
    color: {
        r: fieldTypes.Uint16,
        g: fieldTypes.Uint16,
        b: fieldTypes.Uint16,
        a: fieldTypes.Uint16
    },
    matrix: [fieldTypes.Float32, 16]
}

window.componentMapping = mapping.ComponentMapper.buildMapping(componentSchema);
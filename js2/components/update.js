import {Component} from "./component.js";
import * as dataComponents from "./data.js";
import {context} from "../context.js";
import * as primitives from "../primitives.js";
import * as states from "../stateMachine.js";
import * as input from "../input.js";
import * as eventsModel from "../events.js";

export class UpdateComponent extends Component{
    constructor(name = null){
        super(name);
    }

    update(entity, events){

    }
}

export class RotateCamera extends UpdateComponent{
    constructor(){
        super();
        this.rotateMatrix = primitives.Matrix3D.rotateZ(primitives.Constants.radianNeg90);
        this.rotateMatrixBack = primitives.Matrix3D.rotateZ(primitives.Constants.radian90);
    }

    update(entity, events){

        let keyUp = events.getEvent(input.KeyupEvent);
        if(keyUp){
            let rotMatrix = null;
            if(keyUp.key == 'q'){
                rotMatrix = this.rotateMatrix;
            } else if(keyUp.key == 'e'){
                rotMatrix = this.rotateMatrixBack;
            }

            if(rotMatrix){
                var posComponent = entity.getComponent(dataComponents.Transformation);
                if(posComponent){
                    rotMatrix.multiply(posComponent.transformation, posComponent.transformation);
                    var dirComponent = entity.getComponent(dataComponents.Direction);
                    if(dirComponent){
                        rotMatrix.transform(dirComponent.direction, dirComponent.direction);
                        dirComponent.direction.x = dirComponent.direction.x != 0 ? dirComponent.direction.x / Math.abs(dirComponent.direction.x) : 0;
                        dirComponent.direction.y = dirComponent.direction.y != 0 ? dirComponent.direction.y / Math.abs(dirComponent.direction.y) : 0;
                        dirComponent.direction.z = dirComponent.direction.z != 0 ? dirComponent.direction.z / Math.abs(dirComponent.direction.z) : 0;
                    }
                }
            }
        }
    }
}

export class Controller extends UpdateComponent{
    constructor(){
        super();
        this.moveState = new states.StateStack();
        this.moveState.push(new StandingState());
    }
}

export class MoveStartEvent extends eventsModel.Event{
}

export class MoveEndEvent extends eventsModel.Event{
}

export class StandingState extends states.State{
    update(events){
        if(events.hasEvent(MoveStartEvent)){
            return new MovingState();
        }

        return super.update(events);
    }
}

export class MovingState extends states.State{
    update(events){
        if(events.hasEvent(MoveEndEvent)){
            return null;
        }

        return super.update(events);
    }
}

export class KeyboardController extends Controller{
    constructor(direction = new Point3D(-1, -1, 0)){
        super();
        this.axis = direction;
    }

    update(entity, events){
        if(events.hasEvents(input.KeydownEvent, input.KeyupEvent)){
            var inputManager = context.engine.inputManager;

            var left = inputManager.getKeyState("left") || inputManager.getKeyState("a");
            var right = inputManager.getKeyState("right") || inputManager.getKeyState("d");
            var top = inputManager.getKeyState("up") || inputManager.getKeyState("w");
            var bottom = inputManager.getKeyState("down") || inputManager.getKeyState("s");
            var moveDirection = null;

            if (!left && !bottom && !right && top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y);//NW
            }
            else if (left && !bottom && !right && !top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).perpendicularLeft();//SW
            }
            else if (left && !bottom && !right && top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).rotate45DegreesNormal();//W
            }
            else if (left && bottom && !right && !top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).perpendicularLeft().rotate45DegreesNormal();//S
            }
            else if (!left && !bottom && right && top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).perpendicularRight().rotate45DegreesNormal();//N
            }
            else if (!left && bottom && right && !top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).inverse().rotate45DegreesNormal();//E
            }
            else if (!left && bottom && !right && !top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).inverse();//SE
            }
            else if (!left && !bottom && right && !top) {
                moveDirection = new primitives.Point2D(this.axis.x, this.axis.y).perpendicularRight();//NE
            }

            let eventsSet = new eventsModel.EventsSet();
            if (moveDirection) {
                eventsSet.add(new MoveStartEvent());
                var directionComponent = entity.getComponent(dataComponents.Direction);
                if(directionComponent){
                    directionComponent.direction.x = moveDirection.x;
                    directionComponent.direction.y = moveDirection.y;
                    directionComponent.direction.z = 0;
                }
            }
            else {
                eventsSet.add(new MoveEndEvent());
            }

            this.moveState.update(eventsSet);
        }
    }
}

export class Movement extends UpdateComponent{
    constructor(speed){
        super();
        this.speed = speed;
        this.ds = parseFloat(((speed / 1000) * context.engine.updateDeltaTime).toFixed(2));
        this.vector = new primitives.Point3D();
        this.translate = new primitives.Matrix3D();
    }

    update(entity, events){
        var controllerComponent = entity.getComponent(Controller);
        var positionComponent = entity.getComponent(dataComponents.Transformation);
        var directionComponent = entity.getComponent(dataComponents.Direction);
        if(controllerComponent && positionComponent && directionComponent)
        {
            var state = controllerComponent.moveState.getState();
            if(state instanceof MovingState)
            {
                directionComponent.direction.multiply(this.ds, this.vector);
                primitives.Matrix3D.translate(this.vector.x, this.vector.y, this.vector.z, this.translate);
                this.translate.multiply(positionComponent.transformation, positionComponent.transformation);
            }
        }
    }
}

export class Spin extends  UpdateComponent{
    constructor(a, b, g){
        super();
        this.da = parseFloat(((a / 1000) * context.engine.updateDeltaTime).toFixed(5));
        this.db = parseFloat(((b / 1000) * context.engine.updateDeltaTime).toFixed(5));
        this.dg = parseFloat(((g / 1000) * context.engine.updateDeltaTime).toFixed(5));

        this.rotateA = new primitives.Matrix3D();
        primitives.Matrix3D.rotateX(this.da, this.rotateA);
        this.rotateB = new primitives.Matrix3D();
        primitives.Matrix3D.rotateY(this.db, this.rotateB);
        this.rotateG = new primitives.Matrix3D();
        primitives.Matrix3D.rotateZ(this.dg, this.rotateG);
    }

    update(entity, events){
        var positionComponent = entity.getComponent(dataComponents.Transformation);
        if(positionComponent)
        {
            var transformation = positionComponent.transformation;
            if(this.da) {
                this.rotateA.multiply(transformation, transformation);
            }
            if(this.db) {
                this.rotateB.multiply(transformation, transformation);
            }
            if(this.dg) {
                this.rotateG.multiply(transformation, transformation);
            }
        }
    }
}

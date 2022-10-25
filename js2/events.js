export class Event{
    constructor(name){
        this.name = name;
    }
}

export class EventsSet extends Set{
    getEventByName(eventName) {
        for(let event of this){
            if (event.name == eventName) {
                return event;
            }
        }

        return null;
    }

    *getEvents(...types){
        for(let event of this){
            for(let type of types){
                if(event instanceof type){
                    yield event;
                }
            }
        }
    }

    getEvent(type){
        for(let event of this){
            if(event instanceof type){
                return event;
            }
        }

        return null;
    }

    hasEvent(type){
        for(let event of this){
            if(event instanceof type){
                return true;
            }
        }

        return false;
    }

    hasEvents(...types){
        for(let event of this){
            for(let type of types){
                if(event instanceof type){
                    return true;
                }
            }
        }

        return false;
    }
}

export class EventsManager {
    constructor() {
        this.events = new EventsSet();
        this.backEvents = new EventsSet();
    }

    createEvent(name) {
        return new Event(name);
    }

    pushEvent(event) {
        this.backEvents.add(event);
    }

    pushSimpleEvent(eventName) {
        var event = this.createEvent(eventName);
        this.pushEvent(event);
    }

    swap() {
        this.events = this.backEvents;
        this.backEvents = new EventsSet();
        return this.events;
    }
}

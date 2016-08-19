define(function(){
    class Event{
        constructor(name){
            this.name = name;
        }
    }

    class EventsSet extends Set{
        getEvent(eventName) {
            for (var i = 0, l = this.length; i < l; i++) {
                var item = this[i];
                if (item.name == eventName) {
                    return item;
                }
            }

            return null;
        }
    }

    class EventsManager {
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

            return this.eventsIterator();
        }

        eventsIterator() {
            return this.events.values();
        }
    }

    return {
        EventsManager,
        Event
    };
});

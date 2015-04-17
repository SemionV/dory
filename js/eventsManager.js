(function()
{
    var EventsManager = function()
    {
        this.events = new EventsCollection();
        this.backEvents = new EventsCollection();
    };

    EventsManager.method("createEvent", function(name)
    {
        return {
            name: name
        };
    });

    EventsManager.method("pushEvent", function(event)
    {
        this.backEvents.push(event);
    });

    EventsManager.method("pushSimpleEvent", function(eventName)
    {
        var event = this.createEvent(eventName);
        this.backEvents.push(event);
    });

    EventsManager.method("swap", function()
    {
        this.events = this.backEvents;
        this.backEvents = new EventsCollection();

        return this.events;
    });

    EventsManager.method("getEvents", function()
    {
        return this.events;
    });

    var EventsCollection = function()
    {

    };
    EventsCollection.inherits(Array);

    EventsCollection.method("getEvent", function(eventName)
    {
        for(var i = 0, l = this.length; i < l; i++)
        {
            var item = this[i];
            if(item.name == eventName)
            {
                return item;
            }
        }

        return null;
    });

    spqr.EventsManager = EventsManager;
})();

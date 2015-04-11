(function()
{
    var EventsManager = function()
    {
        this.events = [];
        this.backEvents = [];
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

    EventsManager.method("swap", function()
    {
        var result = this.events;

        this.events = this.backEvents;
        this.backEvents = [];

        return result;
    });

    EventsManager.method("getEvents", function()
    {
        return this.events;
    });

    spqr.EventsManager = EventsManager;
})();

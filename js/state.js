(function()
{
    var StateStack = function()
    {
        this.states = [];
    };

    StateStack.method("push", function(state)
    {
        this.states.unshift(state)
    });

    StateStack.method("pop", function()
    {
        this.states.shift();
    });

    StateStack.method("processEvents", function(events)
    {
        if(this.states.length > 0)
        {
            var state = this.states[0];

            var result = state.processEvents(events);

            if(result)
            {
                if(state !== result)
                {
                    var eventsManager = spqr.Context.engine.eventsManager;
                    var event = eventsManager.createEvent("state.push");
                    event.stateName = result.name;
                    eventsManager.pushEvent(event);

                    this.push(result);
                    result.activate();
                    state.deactivate();
                }
            }
            else
            {
                var eventsManager = spqr.Context.engine.eventsManager;
                var event = eventsManager.createEvent("state.pop");
                event.stateName = state.name;
                eventsManager.pushEvent(event);

                this.pop();
                state.deactivate();

                if(this.states.length > 0)
                {
                    this.states[0].activate();
                }
            }
        }
    });

    var StateMachine = function()
    {
        this.stacks = {};
    };

    StateMachine.method("registerStack", function(key)
    {
        var stack = new StateStack();
        this.stacks[key] = stack;

        return stack;
    });

    StateMachine.method("processEvents", function(events)
    {
        for(var key in this.stacks)
        {
            var stack = this.stacks[key];
            stack.processEvents(events);
        }
    });

    var State = function()
    {
    }

    State.method("processEvents", function(events)
    {

    });

    State.method("activate", function()
    {

    });

    State.method("deactivate", function()
    {

    });

    spqr.States = {};
    spqr.States.State = State;
    spqr.States.StateMachine = StateMachine
}
)();

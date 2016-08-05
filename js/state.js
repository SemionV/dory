(function()
{
    var StateStack = function()
    {
        this.states = [];
    };

    StateStack.method("push", function(state)
    {
        if(this.states.length > 0)
        {
            var prevState = this.states[0];
            prevState.deactivate();
        }

        state.activate();
        this.states.unshift(state)

        this.pushStateChangeEvent("state.push", state.name);
    });

    StateStack.method("pop", function()
    {
        if(this.states.length > 0)
        {
            var prevState = this.states[0];
            prevState.deactivate();

            this.pushStateChangeEvent("state.pop", prevState.name);
        }

        this.states.shift();

        if(this.states.length > 0)
        {
            var state = this.states[0];
            state.activate();
        }
    });

    StateStack.method("update", function(events)
    {
        var state = this.getState();
        if(state)
        {
            this.updateState(state, events);
        }
    });

    StateStack.method("updateState", function(state, events)
    {
        var result = state.update(events);

        if(result)
        {
            if(state !== result)
            {
                this.push(result);
                this.updateState(result, events);
            }
        }
        else
        {
            this.pop();
        }
    });

    StateStack.method("pushStateChangeEvent", function(eventName, stateName)
    {
        var eventsManager = spqr.Context.engine.eventsManager;
        var event = eventsManager.createEvent(eventName);
        event.stateName = stateName;
        eventsManager.pushEvent(event);
    });

    StateStack.method("getState", function()
    {
        if(this.states.length > 0)
        {
            return this.states[0];
        }

        return null;
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

    StateMachine.method("update", function(events)
    {
        for(var key in this.stacks)
        {
            var stack = this.stacks[key];
            stack.update(events);
        }
    });

    var State = function()
    {
    }

    State.method("update", function(events)
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
    spqr.States.StateStack = StateStack;
    spqr.States.StateMachine = StateMachine
}
)();

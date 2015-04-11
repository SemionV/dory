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

    StateStack.method("precessEvents", function(events)
    {
        //TODO: complete the method
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

    spqr.States = {};
    spqr.States.StateMachine = StateMachine
}
)();

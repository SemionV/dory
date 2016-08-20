define(['context', 'events'], function(context, events){
    class State{
        update(events){
            return this;
        }

        activate(){

        }

        deactivate(){

        }
    }

    class StateChangeEvent extends events.Event{
        constructor(name, prevState, newState){
            super(name);
            this.prevState = prevState;
            this.newState = newState;
        }
    }

    class StateStack{
        constructor(){
            this.states = [];
        }

        push(state) {
            var topState = this.getState();
            if (topState) {
                topState.deactivate();
            }

            state.activate();
            this.states.unshift(state)

            this.pushStateChangeEvent("state.push", topState, state);
        }

        pop() {
            var prevState = null;
            if (this.states.length > 0) {
                prevState = this.states[0];
                prevState.deactivate();
            }

            this.states.shift();

            var state = this.getState();
            if (state) {
                state.activate();
            }

            this.pushStateChangeEvent("state.pop", prevState, state);
        }

        update(events) {
            var state = this.getState();
            if (state) {
                this.updateState(state, events);
            }
        }

        updateState(state, events) {
            var result = state.update(events);

            if (result) {
                if (state !== result) {
                    this.push(result);
                    this.updateState(result, events);
                }
            }
            else {
                this.pop();
                var topState = this.getState();
                if (topState) {
                    this.updateState(topState, events);
                }
            }
        }

        getState() {
            if (this.states.length > 0) {
                return this.states[0];
            }

            return null;
        }

        pushStateChangeEvent(eventName, prevState, newState){
            context.engine.eventsManager.pushEvent(new StateChangeEvent(eventName, prevState, newState));
        }
    }

    return {
        State,
        StateStack,
        StateChangeEvent
    }
});
import Controller from "./controller.js"

export default class MessagePool extends Controller {
    constructor(poolSize = 0) {
        super();
        this.poolSize = poolSize;//manually 
        this.frontPool = new Array(poolSize);//the pool where the current frame messages added
        this.backPool = new Array(poolSize);//the pool where the message from the previous frame are available
    }

    update(timeStep) {
        //swap the buffers(if they are not empty)
        if(this.backPool.length) {
            this.frontPool = this.backPool;
            this.backPool = new Array(this.poolSize);
        }
        else if(this.frontPool.length) {
            this.frontPool = new Array(this.poolSize);
        }
    }

    get messages() {
        return this.frontPool;
    }

    forEach(callback, context) {
        let messages = this.frontPool;
        let messagesCount = messages.length;
        let isBreak = false;
        for(let i = 0; i < messagesCount; ++i) {
            let message = messages[i];
            if(context) {
                isBreak = callback.call(context, message);
            }
            else {
                isBreak = callback(message);
            }

            if(isBreak){
                break;
            }
        }
    }

    pushMessage(message) {
        this.backPool.push(message);
    }
}
import Controller from "./controller.js"

export class MessagePool extends Controller {
    constructor(poolSize = 0) {
        super();
        this.poolSize = poolSize;
        this.frontPool = new Array(poolSize);//the pool where the current frame messages added
        this.backPool = new Array(poolSize);//the pool where the message from the previous frame are available
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

export class MessagePoolController {
    constructor(messagePool) {
        this.messagePool = messagePool;
    }

    update(timeStep) {
        let messagePool = this.messagePool;
        //swap the buffers(if they are not empty)
        if(messagePool.backPool.length) {
            messagePool.frontPool = messagePool.backPool;
            messagePool.backPool = new Array(messagePool.poolSize);
        }
        else if(messagePool.frontPool.length) {
            messagePool.frontPool = new Array(messagePool.poolSize);
        }
    }
}
import UpdateController from "./updateController.js"

export default class MessagePool extends UpdateController {
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
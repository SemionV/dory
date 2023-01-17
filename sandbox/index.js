import * as sandbox from "./sandboxApplication.js"
import Engine from "../iteration3/engine.js"
import {MessagePool, MessagePoolController} from "../iteration3/messagePool.js"

let sceneLoader = new sandbox.SceneLoader();
let messagePool = new MessagePool();
let messagePoolController = new MessagePoolController(messagePool);
messagePool.pushMessage(new sandbox.BootstrapMessage());
let application = new sandbox.SandboxApplication(messagePoolController, sceneLoader, messagePool);

let engine = new Engine(application);
engine.run();
import * as data from "./components/data.js";
import * as update from "./components/update.js";
import * as postUpdate from "./components/postUpdate.js";
import * as preRendering from "./components/preRendering.js";
import * as rendering from "./components/rendering.js";

import Component from "./components/component.js";

let UpdateComponent = update.UpdateComponent;
let PostUpdateComponent = postUpdate.UpdateComponent;
let PreRenderingComponent = preRendering.UpdateComponent;
let RenderingComponent = rendering.UpdateComponent;

export { 
    Component, 
    UpdateComponent, 
    PostUpdateComponent, 
    PreRenderingComponent, 
    RenderingComponent,
    data,
    update,
    postUpdate,
    preRendering,
    rendering
 };

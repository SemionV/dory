import * as rendering from "../renderingSystem.js"
import * as graphicalPrimitives from "../genericPrimitives.js"

export class IsometricRenderingSystem extends rendering.RenderingSystem {

}

class IsometricTileMesh extends graphicalPrimitives.GraphicalPrimitive {
    constructor(id, origin, ) {

    }
}

class IsometricTileMeshDrawer extends rendering.Drawer {
    draw(mesh) {
        let origin = mesh.origin;
    }
}
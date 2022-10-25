import * as rendering from "../renderingSystem.js"
import * as graphicalPrimitives from "../graphicalPrimitive.js"

export class IsometricRenderingSystem extends rendering.RenderingSystem {
    updateRenderingQueue(renderingContext) {
        let primitivesFactory = this.getPrimitivesFactory();
        let primitivesToDelete = new Set();

        for(let primitive of renderingContext.primitives) {
            let existingGenericPrimitive = null;

            for(let genericPrimitive of this.graphicalPrimitives) {
                if(genericPrimitive.id === primitive.id) {
                    existingGenericPrimitive = genericPrimitive;
                    break;
                }
            }

            if(!existingGenericPrimitive) {
                primitivesToDelete.add(primitive);
            }
        }

        for(let primitive of genericPrimitive) {
            renderingContext.primitives.delete(primitive);
        }

        for(let genericPrimitive of this.graphicalPrimitives) {
            if(!renderingContext.findInQueue((x) => {x.id == genericPrimitive.id})) {
                let primitive = primitivesFactory.create(genericPrimitive);
                renderingContext.primitives.add(primitive);
            }
        }
    }
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
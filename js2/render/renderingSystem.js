define(function(){

    //convert generic primitive to render specific
    class PrimitivesFactory {
        create(genericPrimitive) {

        }
    }

    //draw primitive with a supported rendering thechnology(canvas, WebGL, etc)
    class Drawer {
        draw(primitive) {
        }
    }

    //contains set of data specific for rendering(rendering queue)
    class RenderingContext {

    }

    //step of rendering context modification pipeline(ordering of rendering queue, optimization, etc)
    class Modifier {
        process(renderingContext) {

        }
    }

    //generic rendering logic(building, optimization and drawing of rendering queue logic)
    class RenderingSystem {
        
    }

    return {
        PrimitivesFactory,
        Drawer,
        RenderingContext,
        Modifier,
        RenderingSystem
    };
});

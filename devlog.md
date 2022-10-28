# Development log

**27.10.22**
* Working on transformations. As said before, I am trying to implement a Modifier which combines transformations of each renderingItem in the queue and applies transformation on a graphicalPrimitive. So added points array to each graphical primitive, so that I have a generic way to apply a transformation and store the result for any type of graphical primitive. The idea is that any primitive consists of points(it might be a line, a polygon or a sprite, etc) and those points just have to be transformed consequently.
* I have simplified transformation and do the calculation directly in a Drawer. Caching and optimizations can be implemented aside and in a more clomplex manner. So far this strait forward implementation works well and it is very powerfull. See the demo(canvas2d).
* I have also realized, that Transformation is not needed in each and every Graphical Primitive, it is enough to push and pop transformations in the Rendering System. They will are tight to the primitives in RenderingItem anyway.
* Reworking the engine and scene architecture for the new rendering system. So far the idea is to reduce number of component types just to update and drawing components.

**26.10.22**
* I am trying to remember the concept of the rendering system so far. I definitely remember that I wanted to introduce it in order to get abstract renderers with implementations like webgl, canvas, etc. As well as sorting the rendering queue in order to draw tiles in a proper order for isometric views.
* I will try to implement 2dCanvas rendering system and test it in order to see, if the rendering system concept is working
* I have figured out, that one of the goals of the new rendering system was to move matrix transformations from entity components to the renderer, see commit [big reforms](https://github.com/SemionV/dory/commit/74687ef40294ac88f1322d69ad79ea99e70e6ba1). It is a very good idea! So I continue on this.
* I have decided to move drawers to RenderItemFactory and assign a drawer to RenderingItem directly, so that we don't need to search every time for a drawer on each frame in a Map of drawers.
* Next step is to make transformations of geometry possible. So far I am thinking about creating a Modifier for the rendering pipeline, which will combine the Transformations for each renderingItem and apply the combined transformation on a primitive, saving the result of transformation in rendering item as a transformed primitive of the same time as the original one.

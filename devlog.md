# Development log

**31.01.23**
* Current tasks are:
    - Move keyboard input into message queue, because input command triggers need access to scene context. The new flow can look like this: InputSystem is triggered by an event from a device -> InputController sends a message to a message queue -> InputController is checking for messages in the queue every frame and if there is a message from InputSystem -> check all the triggers with the scene context included -> trigger command
    - Move Point3D, Matrix and other math into statical functions and operate on structures of data(like poits)
    - Create data access service, which are providing access to the data in scene context and use them instead of direct access to the data. It will provide an easy way for optimisation of data and access to it, like using ECS instead of simple arrays.

**11.01.23**
* I have made a very detailed investigation of memory management in EcmaScript and the ways to store and access game components in memory. The are following ways, which I have discovered and investigated with their pros and cons accordingly:
    - TypedArrays with dynamic binding and mapping(see iteration3/componentStorage/componentStorage.js). This approach is based on TypedArrays and works well for writing data and rewriting, because the slots for the components have fixed size and it is easy to find an address in memory to access/write. Mass access though is the slowest of all methods, primarily because of dynamical property search on an object, while reading and setting its properties. Another advantage is that this approach is pretty good for quick and lean development, as it has a minimum of hardcoding(better is only storage based on dynamic Arrays). It uses ComponentSchema to generate the mappings.
    - TypedArrays with hardcoded mappers. This is a pretty good performance approach for both write/read and mass access operations. Only disadvantage is a lot of boilerplating to map Components to the bytes in the storage. Even faster variation of this approach is:
    - TypedArrays with hardcoded individual access to the fields of the Components. This is an approach to direct manipulation and access to ArrayBuffers via DataView. Most performant approach on TypedArrays, but least flexible for development and maintenance. It is most likely a case for heavy optimisations, but not for development time.
    - TypedArrays for every field of every Component(bitECS). This is quite a performant way to read/write individual data, but not so good for mass access and memory usage, as it has a TypedArray of a large size for every field of every component and has a lot of CPU cache misses on complex components. On heavy tests with 100 000 000 items it has failed to allocate the storages. So it is maybe good for prototyping and has quite interesting approaches in the source code, but not so optimal and pretty memory consuming(and this is the best ECS framework available for the platform). It still requires either hardcoding or not so lean code during development. It is also hard and expensive to track changes in components and set dirty flags.
    - Pure Arrays. This is a specific approach for specific cases with very strong advantages but also very strong disadvantages. It is the fastest way for mass access(or the same fast as the fastest TypedArray-based approach, although, I don't understand why, since it has non fixed item size and should actually be very slow on traversing operations), but very slow for mass initialization and manipulation, as it is moving the items when they get deleted or doing some manipulations while they are getting inserted. Instead of deleting it is possible also to mark slots as deleted and reuse them for new items(the same approach as with TypedArrays). It is possible to use it for some scenarios though. Another advantage is that it requires the least hardcoding during development. Although I would need some kind of ComponentSchema for UI Editors anyway.
* Update engine code to use requestAnimation frame correctly. Long story short: browsers take care to run the animation callback 60 times per second(depending on screen refresh frequency) and it is not necessary to calculate the number of updates in each frame manually. There always should be just one update of the state and one output, but the update has to be time based(time passed since last update). In case if it will take too long between the frames, the animation will just skip to the current state based on time.

**08.01.22**
* Implementing component mapping. Goal of the mapping to read/write component data to a typed array buffer.

**07.01.22**
* I have successfully gone through the Entity Component System experiment and made a first implementation of doryECS, a ECS framework which was inspired by bitECS, but uses compact packaging of complex components into a single binary buffer instead of spreading properties over many buffers like bitECS does. This brings better performance, since the data is more streamlined and dory has more CPU cache hits than bitECS. Performance tests have shown that access to many components(a million to 100 millions) is working two or sometimes three times faster. I would like to continue development of doryECS and implement the functionality which will be needed in the game engine.
* I have also implemented a simple dependency injection container for the game engine. So far it supports only singleton instances. I had to make a compromise in order keep service classes clean and without any decorators, but being able to register class dependencies. So the dependencies of any service have to be mentioned together with the class registration.

**03.01.22**
* Start of experimenting with modern game engine architectures. I will try Entity Component System pattern and Data-Oriented programmking practics.
* Next step is to try a high performance ECS framwork called bitECS

**29.12.22**
* Move rendering context management out of Renderer's scope, so that View can customize and control the context
* Add SceneView class to manage rendering of Scene. Engine will have set of views, each view will render to a specific viewport with a specific Renderer and will manage the order of scene rendering as well as optimizations and logic.

**25.12.22**
* Implemented transformation stack in Rendering Context. It makes possible to implement different strategies of calculating and stacking transformations. For canvas 2D it is currently combining transformations, for webgl it will be sending them directly to the graphik rendering context.

**24.12.22**
* Rendering pipeline reorganized. Now rendering Items are ordered inside transformation Nodes, it is possible now to use different Drawers for each type of graphical primitive.
* Now it is possible to stack transformations in the rendering context or apply them iundividually to the primitives

**20.12.22**
* Reorganatzing rendering pipeline. Goals are:
    - Possibility to draw the same graphical primitives with different Drawers. Sometimes I want to draw a point or any other primitive in some different ways. Like a pint as a cross, a point as a dot, a solid line, dashed line, etc. For this I have to reorganize how the rpimitives are created and queued.
    - Move combining of transformations out of the Drawers. For this I want to try to organize the rendering queue in a differnt way: assign to each transformation node a list of rendering items. Just an idea, I have ti think about it more.

**01.11.22**
* Bingo! I am trying to understand how transformation matrices are working under the hood and today I made a breakthrough in this topic. I was investigating how a 2D orthogonal matrix is rotating at a point. There are two things. First off, a rotation matrix is a set of two vectors, where each column of the matrix represents a vector. Second off, multiplying the matrix and a point makes a dot product of the vector, which is representing the point and each vector stored in the matrix. I was thinking, it moves the point somewhere and was confused, because the point moved kind of away from the destination vectors. But the thing is, the point is not moving anywhere, it is that we, as an observer, are moving to the destination coordinate system and see how the point is positioned relative to this coordinate system. If you think like this, the transformation immediately makes sense. Understanding this very small, but crucial detail I can start building my own transformation matrices. So far only orthogonal, but projection matrices are coming as well!

**27.10.22**
* Working on transformations. As said before, I am trying to implement a Modifier which combines transformations of each renderingItem in the queue and applies transformation on a graphicalPrimitive. So added points array to each graphical primitive, so that I have a generic way to apply a transformation and store the result for any type of graphical primitive. The idea is that any primitive consists of points(it might be a line, a polygon or a sprite, etc) and those points just have to be transformed consequently.
* I have simplified transformation and do the calculation directly in a Drawer. Caching and optimizations can be implemented aside and in a more clomplex manner. So far this strait forward implementation works well and it is very powerfull. See the demo(canvas2d).
* I have also realized, that Transformation is not needed in each and every Graphical Primitive, it is enough to push and pop transformations in the Rendering System. They will be assigned to the primitives in RenderingItem anyway.
* Reworking the engine and scene architecture for the new rendering system. So far the idea is to reduce number of component types just to update and drawing components.

**26.10.22**
* I am trying to remember the concept of the rendering system so far. I definitely remember that I wanted to introduce it in order to get abstract renderers with implementations like webgl, canvas, etc. As well as sorting the rendering queue in order to draw tiles in a proper order for isometric views.
* I will try to implement 2dCanvas rendering system and test it in order to see, if the rendering system concept is working
* I have figured out, that one of the goals of the new rendering system was to move matrix transformations from entity components to the renderer, see commit [big reforms](https://github.com/SemionV/dory/commit/74687ef40294ac88f1322d69ad79ea99e70e6ba1). It is a very good idea! So I continue on this.
* I have decided to move drawers to RenderItemFactory and assign a drawer to RenderingItem directly, so that we don't need to search every time for a drawer on each frame in a Map of drawers.
* Next step is to make transformations of geometry possible. So far I am thinking about creating a Modifier for the rendering pipeline, which will combine the Transformations for each renderingItem and apply the combined transformation on a primitive, saving the result of transformation in rendering item as a transformed primitive of the same time as the original one.

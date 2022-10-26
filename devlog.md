# Development log

**26.10.22**
* I am trying to remeber the concept of rendering system so far. I definitely remember that I wanted to introduce it in order to get abstarct renderers with implementations like webgl, canvas, etc. As well as sorting rendering queue in order to draw tiles in a proper order for isometric views.
* I will try to implement 2dCanvas rendering system and test it in oder to see, if the rendering system concept is working
    * I have figured out, that one of the goals of the new rendering system was to move matrix transformations from entity components to the renderer, see commit [big reforms](https://github.com/SemionV/dory/commit/74687ef40294ac88f1322d69ad79ea99e70e6ba1). It is a very good idea! So I continue on this.
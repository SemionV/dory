require(['context', 'engine', 'resources', 'scene', 'components', 'render', 'primitives', 'tileTerrain'],
    function(context, dori, resources, scenes, components, render, primitives, tileTerrain){

    let canvas = document.getElementById('canvas');
    let canvasContext = canvas.getContext('2d');

    var resourceManager = new resources.ResourceManager();
    resourceManager.loadImages({
        "terrain.grass": "img/1-grass-1.png",
        "terrain.hole": "img/hole.png",
        "objects.chair": "img/2-chair1.png",
        "warrior_spritesheet1": "img/warrior/warrior_spritesheet1.png",
        "warrior_spritesheet2": "img/warrior/warrior_spritesheet2.png",
        "terrain.grass2": "img/grass.png",
        "terrain.grass3": "img/grass2.png",
        "terrain.grass4": "img/grass32.png",
    }).then(() =>{
        let engine = new dori.Engine({fps: 60});
        context.engine = engine;

        let scene = new scenes.SceneManager();

        let camera = new scenes.Entity();
        let viewport = new render.Viewport(canvas.width, canvas.height);
        let renderer = new render.Canvas2DIsometricRenderer(canvasContext, viewport);
        camera.addComponent(new components.CameraComponent(renderer));
        camera.addComponent(new components.PositionComponent());
        camera.addComponent(new components.DirectionComponent());
        camera.addComponent(new components.KeyboardControllerComponent());
        camera.addComponent(new components.MovementComponent(60));
        scene.addEntity('camera', camera);

        let terrain = new scenes.Entity();
        const tileWidth = 32;
        const tileHeight = 32;
        var imageGrass = resourceManager.getImage('terrain.grass4');
        var imageHole = resourceManager.getImage('terrain.hole');
        terrain.addComponent(new tileTerrain.TileTerrainComponent(tileWidth, tileHeight,
            [
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ], new Map([
                [1, new tileTerrain.TileType(new primitives.Image(imageGrass, imageGrass.width / 2))],
                [2, new tileTerrain.TileType(new primitives.Image(imageHole, imageHole.width / 2))]
            ])));
        terrain.addComponent(new tileTerrain.TileTerrainDrawer());
        scene.addEntity('terrain', terrain);

        let chair = new scenes.Entity();
        chair.addComponent(new components.PositionComponent());
        chair.addComponent(new components.DirectionComponent());
        chair.addComponent(new components.PointDrawer());
        let imageChair = resourceManager.getImage('objects.chair');
        chair.addComponent(new components.SpriteComponent(new primitives.Image(imageChair, imageChair.width / 2 + 6, imageChair.height / 2 + 26)));
        chair.addComponent(new components.BoundingBoxComponent(new primitives.Box(28, 26, 46)));
        chair.addComponent(new components.BoundingBoxBackDrawer());
        chair.addComponent(new components.SpriteDrawer(true));
        chair.addComponent(new components.BoundingBoxFrontDrawer());

        scene.addEntity('chair', chair);

        scene.addEventHandler('fps.updated', (e)=>{
            document.getElementById('FPS').innerText = e.fps;
        });

        engine.setActiveScene(scene);
        engine.run();
    });
});

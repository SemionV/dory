require(['engine', 'resources', 'scene', 'components', 'render', 'primitives', 'tileTerrain'],
    function(dori, resources, scenes, components, render, primitives, tileTerrain){

    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    var resourceManager = new resources.ResourceManager();
    resourceManager.loadImages({
        "terrain.grass": "img/1-grass-1.png",
        "terrain.hole": "img/hole.png",
        "objects.chair": "img/2-chair1.png",
        "warrior_spritesheet1": "img/warrior/warrior_spritesheet1.png",
        "warrior_spritesheet2": "img/warrior/warrior_spritesheet2.png"
    }).then(() =>{
        let engine = new dori.Engine({fps: 60});

        let scene = new scenes.SceneManager();

        let camera = new scenes.Entity();
        let viewport = new render.Viewport(canvas.width, canvas.height);
        let renderer = new render.Canvas2DIsometricRenderer(context, viewport);
        camera.addComponent(new components.CameraComponent(renderer));
        camera.addComponent(new components.PositionComponent());
        scene.addEntity('camera', camera);

        let terrain = new scenes.Entity();
        const tileWidth = 50;
        const tileHeight = 50;
        var imageGrass = resourceManager.getImage('terrain.grass');
        var imageHole = resourceManager.getImage('terrain.hole');
        terrain.addComponent(new tileTerrain.TileTerrainComponent(tileWidth, tileHeight,
            [
                [1, 1, 1, 2, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [2, 1, 1, 2, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1],
                [1, 1, 1, 1, 1, 1, 1, 1]
            ], new Map([
                [2, new tileTerrain.TileType(new primitives.Image(imageGrass, imageGrass.width / 2))],
                [1, new tileTerrain.TileType(new primitives.Image(imageHole, imageHole.width / 2))]
            ])));
        terrain.addComponent(new tileTerrain.TileTerrainDrawer());
        scene.addEntity('terrain', terrain);

        let hero = new scenes.Entity();
        hero.addComponent(new components.PositionComponent());
        hero.addComponent(new components.PointDrawer());
        var imageChair = resourceManager.getImage('objects.chair');
        hero.addComponent(new components.SpriteComponent(new primitives.Image(imageChair, imageChair.width / 2 + 4, imageChair.height / 2 + 24)));
        hero.addComponent(new components.SpriteDrawer(true));
        scene.addEntity('hero', hero);

        engine.setActiveScene(scene);
        engine.run();
    });
});

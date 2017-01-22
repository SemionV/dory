require(['context', 'engine', 'resources', 'scene', 'components', 'render', 'primitives', 'tileTerrain'],
    (context, dori, resources, scenes, components, render, primitives, tileTerrain) => {

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
        "pine-none04.png": "img/pine-none04.png"
    }).then(() =>{
        let engine = new dori.Engine(new dori.EngineConfig(100, false));
        context.engine = engine;

        //engine.heart = () => {};
        window.engine = engine;

        let scene = new scenes.SceneManager();

        //init terrain
        {
            let terrain = new scenes.TransformableEntity();
            const tileWidth = 32;
            const tileHeight = 32;
            var imageGrass = resourceManager.getImage('terrain.grass4');
            let terrainDefinition = new tileTerrain.TerrainDefinition(
                    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 2, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                    1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 10, tileWidth, tileHeight,
                new Map([
                    [1, new tileTerrain.TileType(new primitives.Image(imageGrass, tileWidth, tileHeight / 2))],
                    [2, new tileTerrain.TileType()]
                ]));
            tileTerrain.TerrainFactory.build(terrainDefinition, terrain);
            scene.addEntity('terrain', terrain);
        }

        //init camera
        {
            let camera = new scenes.Camera(primitives.Matrix3D.translate(100, 100, -100));
            var cameraDirection = new primitives.Point3D(-1, -1, 1);
            camera.addComponent(new components.data.Direction(cameraDirection));
            camera.addComponent(new components.update.RotateCamera());

            let cameraFocus = new scenes.PointEntity();
            cameraFocus.addComponent(new components.data.Direction());
            cameraFocus.addComponent(new components.update.KeyboardController(cameraDirection));
            cameraFocus.addComponent(new components.update.Movement(100));
            cameraFocus.addComponent(new components.rendering.PointDrawer());
            cameraFocus.addChild(camera);
            scene.addEntity('cameraFocus', cameraFocus);

            let viewport = new render.Viewport(canvas.width, canvas.height);
            let renderer = new render.Canvas2DIsometricRenderer(canvasContext, viewport);
            let view = new scenes.View(renderer, camera);
            scene.addView(view);

            let center = new scenes.PointEntity();
            center.addComponent(new components.rendering.PointDrawer());
            scene.addEntity('center', center);
        }

        //init pines
        {
            let imagePine = resourceManager.getImage('pine-none04.png');
            let pineSprite = new primitives.Image(imagePine, 158.07999999999663, 223.99999999999665);

            let pine = new scenes.SpriteEntity(pineSprite, primitives.Matrix3D.translate(-74.23999999999982, 144.63999999999834, 0));
            scene.addEntity('pine', pine);

            pine = new scenes.SpriteEntity(pineSprite, primitives.Matrix3D.translate(-139.83999999999844, 115.51999999999896, 0));
            scene.addEntity('pine2', pine);

            pine = new scenes.SpriteEntity(pineSprite, primitives.Matrix3D.translate(-50, 50, 0));
            scene.addEntity('pine3', pine);

            pine = new scenes.SpriteEntity(pineSprite, primitives.Matrix3D.translate(84.47999999999962, 338.5599999999942, 0));
            scene.addEntity('pine4', pine);
        }

        scene.addEventHandler(dori.FpsUpdatedEvent, (e)=>{
            document.getElementById('FPS').innerText = e.fps;
        });

        engine.setActiveScene(scene);
        engine.run();
    });
});

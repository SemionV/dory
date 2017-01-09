require(['context', 'engine', 'resources', 'scene', 'components', 'render', 'primitives'],
    (context, dori, resources, scenes, components, render, primitives) => {

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

        let viewport = new render.Viewport(canvas.width, canvas.height);
        let renderer = new render.Canvas2DIsometricRenderer(canvasContext, viewport);

        let camera = new scenes.Camera(renderer, primitives.Matrix3D.translate(100, 100, -100));
        var cameraDirection = new primitives.Point3D(-1, -1, 1);
        camera.addComponent(new components.DirectionComponent(cameraDirection));
        camera.addComponent(new components.RotateCameraComponent());

        let cameraFocus = new scenes.PointEntity();
        cameraFocus.addComponent(new components.DirectionComponent());
        cameraFocus.addComponent(new components.KeyboardControllerComponent(cameraDirection));
        cameraFocus.addComponent(new components.MovementComponent(100));
        cameraFocus.addComponent(new components.PointDrawer());
        cameraFocus.addChild(camera);
        scene.addEntity('cameraFocus', cameraFocus);

        let center = new scenes.PointEntity();
        center.addComponent(new components.PointDrawer());
        scene.addEntity('center', center);

        let imagePine = resourceManager.getImage('pine-none04.png');
        var pineSprite = new primitives.Image(imagePine, 158.07999999999663, 223.99999999999665);
        let pine = new scenes.SpriteEntity(pineSprite, primitives.Matrix3D.translate(-74.23999999999982, 144.63999999999834, 0));
        scene.addEntity('pine', pine);

        engine.setActiveScene(scene);
        engine.run();
    });
});

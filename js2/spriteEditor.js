require(['engine', 'scene', 'components', 'render', 'primitives'], function(dori, scenes, components, render, primitives){
    let canvas = document.getElementById('canvas');
    let context = canvas.getContext('2d');

    let engine = new dori.Engine({fps: 60});

    let scene = new scenes.SceneManager();

    let camera = new scenes.Entity();
    let viewport = new render.Viewport(canvas.width, canvas.height);
    let renderer = new render.Canvas2DRenderer(context, viewport);
    let cameraComponent = new components.CameraComponent('Main Camera', renderer);
    camera.addComponent(cameraComponent);
    var positionComponent = new components.PositionComponent('pos');
    camera.addComponent(positionComponent);
    scene.addEntity('camera', camera);

    let hero = new scenes.Entity();
    hero.addComponent(new components.PositionComponent('pos'));
    hero.addComponent(new components.PointDrawer('point'));
    scene.addEntity('hero', hero);

    engine.setActiveScene(scene);
    engine.run();
});

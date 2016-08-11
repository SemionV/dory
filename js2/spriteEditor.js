require(['scene', 'components'], function(scene, components){
    var entity = new scene.Entity();

    var component1 = new components.StateComponent("StateComponent1");
    var component2 = new components.RenderingComponent("RenderingComponent1");

    entity.addComponent(component1);
    entity.addComponent(component2);

    var result1 = entity.getComponent(components.StateComponent);
    if(result1){
        console.log(result1.name);
    }

    var result1 = entity.getComponent(components.RenderingComponent);
    if(result1){
        console.log(result1.name);
    }

    var result2 = entity.getComponents(components.Component);
    if(result2){
        for(let component of result2){
            console.log(component.name);
        }
    }
});

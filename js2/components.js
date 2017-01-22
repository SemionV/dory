define(['components/component', 'components/data', 'components/update', 'components/postUpdate', 'components/preRendering', 'components/rendering'],
function(component, data, update, postUpdate, preRendering, rendering){
    return {
        Component: component.Component,
        UpdateComponent: update.UpdateComponent,
        PostUpdateComponent: postUpdate.PostUpdateComponent,
        PreRenderingComponent: preRendering.PreRenderingComponent,
        RenderingComponent: rendering.RenderingComponent,
        data,
        update,
        postUpdate,
        preRendering,
        rendering
    };
});

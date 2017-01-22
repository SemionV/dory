define(['components/component', 'components/data', 'components/update', 'components/postUpdate', 'components/preRendering', 'components/rendering'],
function(component, data, update, postUpdate, preRendering, rendering){
    return {
        Component: component.Component,
        data,
        update,
        postUpdate,
        preRendering,
        rendering
    };
});

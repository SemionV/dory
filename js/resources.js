(function()
{
    var ResourceManager = function()
    {
        this.images = {};
    };

    ResourceManager.method("loadImages", function(images)
    {
        var d = $.Deferred();
        var self = this;

        var allDeferred = [];

        for(var key in images)
        {
            var imgDeferred = $.Deferred();
            allDeferred.push(imgDeferred);

            var image = self.images[key] = new Image();
            image.onload = function()
            {
                imgDeferred.resolve();
            }
            image.src = images[key];
        }

        $.when(allDeferred).then(function()
        {
            d.resolve();
        });

        return d.promise();
    });

    spqr.ResourceManager = ResourceManager;
})();

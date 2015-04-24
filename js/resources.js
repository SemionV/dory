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
            (function()
            {
                var imgDeferred = new $.Deferred();
                allDeferred.push(imgDeferred);

                var image = self.images[key] = new Image();
                image.onload = function(e)
                {
                    imgDeferred.resolve();
                }
                image.src = images[key];
            })();
        }

        $.when.apply($, allDeferred).then(function()
        {
            d.resolve();
        });

        return d.promise();
    });

    var c =
    {
        image: "image.key",
        frame: {width: 64, height: 64},
        animations:
        {
            walk: {startFrame: 0, endFrame: 10, fps: 24},
            run: {startFrame: 11, endFrame: 20, fps: 24}
        }
    }

    var SpriteSheet = function(definition)
    {
        this.definition = definition;

        this.image = spqr.Context.resources.images[definition.image];
        if(this.image)
        {
            this.framesPerRow = this.images.width / definition.frame.width;
            this.rowsCount = this.image.height / definition.frame.height;
        }
    };

    SpriteSheet.method("setAnimation", function(key)
    {
        this.animation = this.definition.animations[key];
    });
    
    SpriteSheet.method("getFrame", function()
    {
        
    });

    spqr.ResourceManager = ResourceManager;
})();

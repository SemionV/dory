(function()
{
    var Context = function()
    {
        var deltaTime = 1000 / 60;
        this.config =
        {
            //fps: 30,
            updateDeltaTime: deltaTime,
            drawBoundingBoxes: false,
            maxDeltaTime: deltaTime * 2
        };
    }

    Context.method("getScene", function()
    {
        if(this.engine)
        {
            return this.engine.scene;
        }

        return null;
    });

    spqr.Context = new Context();
})();

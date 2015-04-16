(function()
{
    var Context = function()
    {
        this.config =
        {
            //fps: 30,
            updateDeltaTime: 1000 / 60,
            drawBoundingBoxes: true
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

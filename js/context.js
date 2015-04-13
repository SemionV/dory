(function()
{
    var Context = function()
    {
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

(function()
{
    var Engine = function()
    {
        this.fps = 60;
    }

    Engine.method("createHeart", function(fps)
    {
        return  window.requestAnimationFrame   ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(/* function */ callback, /* DOMElement */ element)
            {
                window.setTimeout(callback, 1000 / fps);
            };
    });

    Engine.method("setActiveScene", function(scene)
    {
        this.scene = scene;
    });

    Engine.method("run", function()
    {
        this.heart = this.createHeart(this.fps);
        this.heart(this.heartBeat);
    });

    Engine.method("heartBeat", function()
    {
        this.scene.draw();

        this.heart(this.heartBeat);
    });

    spqr.Engine = Engine;
})()

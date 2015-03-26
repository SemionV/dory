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
        var self = this;
        var heart = this.createHeart(this.fps);

        var heartBeat = function()
        {
            self.scene.draw();
            heart.call(window, heartBeat);
        }

        heart.call(window, heartBeat);
    });

    /*Engine.method("heartBeat", function()
    {
        this.scene.draw();

        this.heart.call(window, this.heartBeat);
    });*/

    spqr.Engine = Engine;
})()

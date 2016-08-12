define(function(){
    class ResourceManager{
        constructor(){
            this.images = new Set();
        }

        loadImages(images) {
            var promises = new Set();

            for (let key in images) {
                promises.add(new Promise(() => {
                    let image = this.images[key] = new Image();

                    image.onload = () => {
                        resolve();
                    }
                    image.src = images[key];
                }));
            }

            return Promise.all(promises);
        }
    }

    var SpriteSheet = function(image, frameWidth, frameHeight)
    {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.framesPerRow = this.image.width / frameWidth;
        this.rowsCount = this.image.height / frameHeight;
        this.offsets = new Array(this.framesPerRow * this.rowsCount);
    };

    SpriteSheet.method("setFramesOffset", function(startFrame, endFrame, x, y)
    {
        var offset = {x: x, y: y};
        for(var i = startFrame; i <= endFrame; i++)
        {
            this.offsets[i] = offset;
        }
    });

    SpriteSheet.method("getFrame", function(index)
    {
        var rowIndex = Math.floor(index / this.framesPerRow);
        var colIndex = index % this.framesPerRow;
        var y = this.frameHeight * rowIndex;
        var x = this.frameWidth * colIndex;
        var offset = this.offsets[index];

        return new Sprite(this.image, x, y, this.frameWidth, this.frameHeight, offset ? offset.x : 0, offset ? offset.y : 0);
    });

    var Sprite = function(image, clipX, clipY, clipWidth, clipHeight, offsetX, offsetY)
    {
        this.clipX = clipX;
        this.clipY = clipY;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.clipWidth = clipWidth;
        this.clipHeight = clipHeight;
        this.image = image;
    };

    var Animation = function(spriteSheet, startFrame, endFrame, fps)
    {
        this.spriteSheet = spriteSheet;
        this.startFrame = startFrame;
        this.endFrame = endFrame;
        this.fps = fps;
        this.frameCount = (endFrame - startFrame) + 1;
        this.dt = spqr.Context.config.updateDeltaTime;
        this.oneFrameTime = 1000 / fps;
        this.currentFrame = 0;
        this.frameTimePassed = 0;
    };

    Animation.method("reset", function()
    {
        this.currentFrame = 0;
        this.frameTimePassed = 0;
    });

    Animation.method("update", function(events)
    {
        this.frameTimePassed += this.dt;
        if(this.frameTimePassed >= this.oneFrameTime)
        {
            this.frameTimePassed = this.frameTimePassed - this.oneFrameTime;

            if(this.currentFrame < (this.frameCount - 1))
            {
                this.currentFrame++;
            }
            else
            {
                this.currentFrame = 0;
            }
        }
    });

    Animation.method("getCurrentFrame", function()
    {
        return this.spriteSheet.getFrame((this.currentFrame + this.startFrame));
    });

    spqr.Resources = {};
    spqr.ResourceManager = ResourceManager;
    spqr.Resources.SpriteSheet = SpriteSheet;
    spqr.Resources.Animation = Animation;
    spqr.Resources.Sprite = Sprite;
});

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

        getImage(key) {
            return this.image.get(key);
        }
    }

    return {
        ResourceManager
    }
});

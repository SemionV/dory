export class ResourceManager{
    constructor(){
        this.images = new Map();
    }

    loadImages(images) {
        var promises = new Set();

        for (let key in images) {
            promises.add(new Promise((resolve) => {
                let image = new Image();
                this.images.set(key, image);

                image.onload = () => {
                    resolve();
                }
                image.src = images[key];
            }));
        }

        return Promise.all(promises);
    }

    getImage(key) {
        return this.images.get(key);
    }
}
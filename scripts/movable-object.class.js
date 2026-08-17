class MovableObject {
    x = 80;
    y = 450;
    img;
    height = 150;
    width = 150;
    imgCache = {};

    loadImage(path) {
        if (this.imgCache[path]) {
            this.img = this.imgCache[path];
        } else {
            this.img = new Image();
            this.img.src = path;
        }
    }

    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }

    moveRight() {
        console.log("moving right");
    }

    moveLeft() {}
}

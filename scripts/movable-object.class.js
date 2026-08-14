class MovableObject {
    x = 80;
    y = 450;
    img;
    height = 150;
    width = 100;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    moveRight() {
        console.log("moving right");
    }

    moveLeft() {}
}

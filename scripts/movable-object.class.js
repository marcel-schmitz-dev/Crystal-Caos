class MovableObject {
    x = 120;
    y = 420;
    img;
    height = 150;
    width = 150;
    imgCache = {};
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;
    currentImage = 0;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = 420;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof Character) {
            return this.y < 420;
        }
        return true;
    }

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

    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height
        );
    }

    isCollidingTop(mo) {
        return (
            this.isColliding(mo) &&
            this.speedY < 0 &&
            this.y + this.height - 20 <= mo.y + 30
        );
    }
}

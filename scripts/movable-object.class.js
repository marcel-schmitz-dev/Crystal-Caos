import { DrawableObject } from "./drawable-object.class.js";

export class MovableObject extends DrawableObject {
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            } else {
                this.y = 380;
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this.constructor.name === "Character") {
            return this.y < 380;
        }
        return true;
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

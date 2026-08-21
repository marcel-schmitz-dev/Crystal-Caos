import { ImageHub } from "./image.hub.js";
import { MovableObject } from "./movable-object.class.js";

export class Cloud extends MovableObject {
    width = 120;
    height = 120;

    constructor(startX) {
        super().loadImage("./assets/img/monster/qualle.png");

        this.x = startX !== undefined ? startX : Math.random() * 1200;

        this.y = 50 + Math.random() * 200;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.15;
            if (this.x < -this.width) {
                this.x = 2900;
            }
        }, 1000 / 60);
    }
}

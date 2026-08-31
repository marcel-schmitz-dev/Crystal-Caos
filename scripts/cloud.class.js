import { MovableObject } from "./movable-object.class.js";

/**
 * Represents floating cloud or background entity elements.
 */
export class Cloud extends MovableObject {
    width = 120;
    height = 120;

    /**
     * Creates a cloud instance at a given or randomized starting position.
     * @param {number} [startX] - Optional starting X coordinate.
     */
    constructor(startX) {
        super().loadImage("./assets/img/monster/qualle.webp");
        this.x = startX !== undefined ? startX : Math.random() * 1200;
        this.y = 50 + Math.random() * 200;
        this.animate();
    }

    /**
     * Starts the horizontal movement loop for floating elements.
     */
    animate() {
        setInterval(() => {
            this.x -= 0.15;
            if (this.x < -this.width) this.x = 2900;
        }, 1000 / 60);
    }
}

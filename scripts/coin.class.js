import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Represents collectible coin items in the level.
 */
export class Coin extends MovableObject {
    width = 40;
    height = 40;

    /**
     * Creates a coin instance at specified coordinates.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     */
    constructor(x, y) {
        super().loadImage(ImageHub.COINS[0]);
        this.loadImages(ImageHub.COINS);
        this.x = x;
        this.y = y;
        this.animate();
    }

    /**
     * Starts the coin animation frame loop.
     */
    animate() {
        setInterval(() => {
            this.playAnimation(ImageHub.COINS);
        }, 150);
    }
}

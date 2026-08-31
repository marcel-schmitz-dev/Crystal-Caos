import { MovableObject } from "./movable-object.class.js";

/**
 * Represents a background layer object in the game level.
 */
export class BackgroundObjekt extends MovableObject {
    width = 1280;
    height = 720;

    /**
     * Creates a background object instance.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - X-coordinate of the background object.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 0;
    }
}

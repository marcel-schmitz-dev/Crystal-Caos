import { DrawableObject } from "./drawable-object.class.js";

/**
 * Base class for all movable entities featuring physics, gravity, and collision logic.
 */
export class MovableObject extends DrawableObject {
    speedY = 0;
    acceleration = 2.5;
    otherDirection = false;

    /**
     * Applies gravity physics to the object in an interval loop.
     */
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

    /**
     * Checks if the object is currently airborne.
     * @returns {boolean} True if above ground level.
     */
    isAboveGround() {
        if (this.constructor.name === "Character") {
            return this.y < 380;
        }
        return true;
    }

    /**
     * Moves object to the left by speed value.
     */
    moveLeft() {
        this.x -= this.speed;
    }

    /**
     * Cycles through animation image frames.
     * @param {string[]} images - Array of image paths.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imgCache[path];
        this.currentImage++;
    }

    /**
     * Checks collision bounds with another movable object.
     * @param {DrawableObject} mo - Target object to check against.
     * @returns {boolean} True if bounding boxes intersect.
     */
    isColliding(mo) {
        return (
            this.x + this.width > mo.x &&
            this.y + this.height > mo.y &&
            this.x < mo.x + mo.width &&
            this.y < mo.y + mo.height
        );
    }

    /**
     * Checks if landing top-down onto another object (e.g. jumping on enemies).
     * @param {DrawableObject} mo - Target object.
     * @returns {boolean} True if landing on top.
     */
    isCollidingTop(mo) {
        return (
            this.isColliding(mo) &&
            this.speedY < 0 &&
            this.y + this.height - 20 <= mo.y + 30
        );
    }
}

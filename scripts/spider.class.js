import { MovableObject } from "./movable-object.class.js";
import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Represents Spider enemies that drop from the ceiling.
 */
export class Spider extends MovableObject {
    height = 80;
    width = 80;
    isDead = false;
    isActivated = false;
    hasLanded = false;
    targetY = 530;
    IMAGES_WALKING = ImageHub.SPIDER.WALKING;

    /**
     * Initializes Spider assets, random position, and movement loops.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = 1280 + Math.random() * 2560;
        this.y = 0;
        this.speed = 0.5 + Math.random() * 0.5;
        this.dropSpeed = 4;
        this.animate();
    }

    /**
     * Starts drop-in, walking, and animation intervals.
     */
    animate() {
        setInterval(() => this.runMovementTick(), 1000 / 60);
        setInterval(() => this.runAnimationTick(), 1000 / 8);
    }

    /**
     * Processes ceiling drop-in or crawling behavior per frame.
     */
    runMovementTick() {
        if (this.isDead || !this.isActivated) return;
        if (!this.hasLanded) {
            this.y += this.dropSpeed;
            if (this.y >= this.targetY) {
                this.y = this.targetY;
                this.hasLanded = true;
            }
        } else {
            this.moveLeft();
        }
    }

    /**
     * Cycles walking animation frames.
     */
    runAnimationTick() {
        if (!this.isDead && this.isActivated) {
            this.playAnimation(this.IMAGES_WALKING);
        }
    }

    /**
     * Creates a crystal drop item when defeated.
     * @returns {DrawableObject} The drop entity.
     */
    createDrop() {
        let drop = new DrawableObject();
        drop.x = this.x;
        drop.y = this.y + 10;
        drop.width = 80;
        drop.height = 80;
        drop.loadImage("./assets/img/drops/Core_amBoden.png");
        return drop;
    }
}

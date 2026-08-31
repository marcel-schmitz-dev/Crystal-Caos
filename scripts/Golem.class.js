import { ImageHub } from "./image.hub.js";
import { MovableObject } from "./movable-object.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Represents Golem enemies spawned from portals.
 */
export class Golem extends MovableObject {
    height = 80;
    width = 80;
    currentImage = 0;
    IMAGES_WALKING = ImageHub.GOLEM.WALKING;

    /**
     * Initializes Golem assets, spawn position, and loops.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_WALKING[0]);
        this.x = 400 + Math.random() * 500;
        this.y = 530;
        this.animate();
    }

    /**
     * Starts movement and animation intervals.
     */
    animate() {
        setInterval(() => this.runMovementTick(), 1000 / 60);
        setInterval(() => this.runAnimationTick(), 1000 / 8);
    }

    /**
     * Runs movement logic and audio playback per frame.
     */
    runMovementTick() {
        this.x -= 0.8;
        if (this.world?.audioHub) {
            this.world.audioHub.playGolemWalk(this.energy > 0);
        }
    }

    /**
     * Cycles through walking sprite frames.
     */
    runAnimationTick() {
        let path = this.IMAGES_WALKING[this.currentImage];
        this.loadImage(path);
        this.currentImage =
            (this.currentImage + 1) % this.IMAGES_WALKING.length;
    }

    /**
     * Creates a crystal drop item at the Golem's location.
     * @returns {DrawableObject} The drop entity.
     */
    createDrop() {
        let drop = new DrawableObject();
        drop.x = this.x;
        drop.y = this.y + 20;
        drop.width = 80;
        drop.height = 80;
        drop.loadImage("./assets/img/drops/Core_amBoden.png");
        return drop;
    }

    /**
     * Static helper to generate portal structures.
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @returns {DrawableObject} The portal entity.
     */
    static createPortal(x, y) {
        let portal = new DrawableObject();
        portal.x = x;
        portal.y = y;
        portal.width = 150;
        portal.height = 200;
        portal.loadImage("./assets/img/waffen/portal.webp");
        return portal;
    }
}

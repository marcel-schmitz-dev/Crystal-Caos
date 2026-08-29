import { ImageHub } from "./image.hub.js";
import { MovableObject } from "./movable-object.class.js";
import { DrawableObject } from "./drawable-object.class.js";

export class Golem extends MovableObject {
    height = 80;
    width = 80;
    currentImage = 0;

    IMAGES_WALKING = ImageHub.GOLEM.WALKING;

    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage(this.IMAGES_WALKING[0]);

        this.x = 400 + Math.random() * 500;
        this.y = 530;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.8;

            if (this.world && this.world.audioHub) {
                let isMoving = this.energy > 0;
                this.world.audioHub.playGolemWalk(isMoving);
            }
        }, 1000 / 60);

        setInterval(() => {
            let path = this.IMAGES_WALKING[this.currentImage];
            this.loadImage(path);
            this.currentImage =
                (this.currentImage + 1) % this.IMAGES_WALKING.length;
        }, 1000 / 8);
    }

    /**
     * Erzeugt einen Crystal Drop direkt an der Position des Golems.
     * @returns {DrawableObject} Das fertige Drop-Objekt für das Array.
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
     * Erzeugt ein Portal, aus dem Golems spawnen können.
     * @param {number} x - X-Position des Portals.
     * @param {number} y - Y-Position des Portals.
     * @returns {DrawableObject} Das Portal-Objekt für die Welt.
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

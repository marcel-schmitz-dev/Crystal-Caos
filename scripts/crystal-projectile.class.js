import { MovableObject } from "./movable-object.class.js";

/**
 * Represents thrown projectiles (player cores or boss bullets).
 */
export class CrystalProjectile extends MovableObject {
    width = 80;
    height = 50;
    speedX = 10;
    world;
    isPlayerCore = false;

    /**
     * Creates a projectile instance.
     * @param {number} x - Starting X coordinate.
     * @param {number} y - Starting Y coordinate.
     * @param {World} world - Game world reference.
     * @param {number} [direction=-1] - Movement direction multiplier.
     * @param {boolean} [isPlayerCore=false] - Whether it belongs to the player.
     */
    constructor(x, y, world, direction = -1, isPlayerCore = false) {
        super();
        this.isPlayerCore = isPlayerCore;
        this.configureProjectileType();
        this.x = x;
        this.y = y;
        this.world = world;
        this.speedX = 12 * direction;
        this.animate();
    }

    /**
     * Configures dimensions and sprite based on projectile ownership.
     */
    configureProjectileType() {
        if (this.isPlayerCore) {
            this.loadImage("./assets/img/character/angreifen/core_flug.webp");
            this.width = 150;
            this.height = 150;
        } else {
            this.loadImage("./assets/img/waffen/crystal_geschoss.webp");
            this.width = 80;
            this.height = 50;
        }
    }

    /**
     * Starts projectile movement loop.
     */
    animate() {
        setInterval(() => {
            if (this.world && !this.world.gameStarted) return;
            this.x += this.speedX;
        }, 1000 / 60);
    }
}

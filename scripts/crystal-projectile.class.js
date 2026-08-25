import { ImageHub } from "./image.hub.js";
import { MovableObject } from "./movable-object.class.js";

export class CrystalProjectile extends MovableObject {
    width = 80;
    height = 50;
    speedX = 10;
    world;

    constructor(x, y, world, direction = -1, isPlayerCore = false) {
        super();

        if (isPlayerCore) {
            this.loadImage("./assets/img/character/angreifen/core_flug.png");
            this.width = 150;
            this.height = 150;
        } else {
            this.loadImage("./assets/img/waffen/crystal_geschoss.png");
            this.width = 80;
            this.height = 50;
        }

        this.x = x;
        this.y = y;
        this.world = world;
        this.speedX = 12 * direction;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world && !this.world.gameStarted) return;

            this.x += this.speedX;
        }, 1000 / 60);
    }
}

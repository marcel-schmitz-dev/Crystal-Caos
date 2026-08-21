import { ImageHub } from "./image.hub.js";
import { MovableObject } from "./movable-object.class.js";

export class CrystalProjectile extends MovableObject {
    width = 80;
    height = 50;
    speedX = 10;
    world;

    constructor(x, y, world) {
        super().loadImage("./assets/img/waffen/crystal_geschoss.png");
        this.x = x;
        this.y = y;
        this.world = world;
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (this.world && !this.world.gameStarted) return;

            this.x -= this.speedX;
        }, 1000 / 60);
    }
}

import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

export class Ghost extends MovableObject {
    height = 450;
    width = 400;
    energy = 5;
    isActivated = false;

    IMAGES_WALKING = [
        "./assets/img/monster/ghost_boss1.png",
        "./assets/img/monster/ghost_boss2.png",
        "./assets/img/monster/ghost_boss3.png",
        "./assets/img/monster/ghost_boss.png",
    ];

    attackToggle = false;
    world;
    lastImageIndex = -1;
    intervalId = null;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage("./assets/img/monster/ghost_boss.png");

        this.x = 3300;
        this.y = 180;

        this.animate();
    }

    animate() {
        this.intervalId = setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;

            this.playAnimation(this.IMAGES_WALKING);
            let currentIndex = this.currentImage % this.IMAGES_WALKING.length;

            if (currentIndex === 2 && this.lastImageIndex !== 2) {
                this.throwCrystal();
            }
            this.lastImageIndex = currentIndex;
        }, 600);
    }

    throwCrystal() {
        if (!this.world) return;

        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 250 : this.y + 340;
        let crystalX = this.x - 40;

        let crystal = new CrystalProjectile(crystalX, crystalY, this.world, -1);
        crystal.loadImage("./assets/img/waffen/crystal_geschoss.png");

        this.world.throwableObjects.push(crystal);
    }

    hit(damage = 1) {
        if (!this.isActivated) return;

        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.stopAnimation();
        }
        console.log("Boss HP:", this.energy);
    }

    stopAnimation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

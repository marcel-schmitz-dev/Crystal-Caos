import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

export class Ghost extends MovableObject {
    height = 450;
    width = 400;
    energy = 5;
    isActivated = false;
    isHurt = false;
    isDead = false;

    IMAGES_WALKING = [
        "./assets/img/monster/ghost_boss1.png",
        "./assets/img/monster/ghost_boss2.png",
        "./assets/img/monster/ghost_boss3.png",
        "./assets/img/monster/ghost_boss.png",
    ];

    IMAGES_DEAD = ImageHub.BOSS.DEAD;

    attackToggle = false;
    world;
    lastImageIndex = -1;
    intervalId = null;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage("./assets/img/monster/ghost_boss.png");

        this.x = 4800;
        this.y = 180;

        this.animate();
    }

    animate() {
        this.intervalId = setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;
            if (this.isDead) return;

            if (!this.isHurt) {
                this.playAnimation(this.IMAGES_WALKING);
                let currentIndex =
                    this.currentImage % this.IMAGES_WALKING.length;

                if (currentIndex === 2 && this.lastImageIndex !== 2) {
                    this.throwCrystal();
                }
                this.lastImageIndex = currentIndex;
            }
        }, 600);
    }

    throwCrystal() {
        if (!this.world || this.isDead) return;
        this.world.audioHub.playBossShoot();

        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 210 : this.y + 340;
        let crystalX = this.x - 40;

        let crystal = new CrystalProjectile(crystalX, crystalY, this.world, -1);
        crystal.loadImage("./assets/img/waffen/crystal_geschoss.png");

        this.world.throwableObjects.push(crystal);
    }

    hit(damage = 1) {
        if (!this.isActivated || this.isDead) return;

        this.energy -= damage;
        console.log("Boss HP:", this.energy);

        if (this.energy <= 0) {
            this.energy = 0;
            this.isDead = true;
            this.playDeathAnimation();
        } else {
            this.playHurtAnimation();
        }
    }

    playHurtAnimation() {
        this.isHurt = true;
        this.loadImage(ImageHub.BOSS.HURT);

        setTimeout(() => {
            this.isHurt = false;
        }, 300);
    }

    playDeathAnimation() {
        this.stopAnimation();
        let currentFrame = 0;

        let deathInterval = setInterval(() => {
            if (currentFrame < this.IMAGES_DEAD.length) {
                this.loadImage(this.IMAGES_DEAD[currentFrame]);
                currentFrame++;
            } else {
                clearInterval(deathInterval);

                if (
                    this.world &&
                    this.world.level &&
                    this.world.level.enemies
                ) {
                    let index = this.world.level.enemies.indexOf(this);
                    if (index > -1) {
                        this.world.level.enemies.splice(index, 1);
                    }
                }
            }
        }, 150);
    }

    stopAnimation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

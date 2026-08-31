import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

export class Ghost extends MovableObject {
    height = 450;
    width = 400;
    energy = 5;
    speed = 2.5;
    isActivated = false;
    isHurt = false;
    isDead = false;

    IMAGES_WALKING = ImageHub.BOSS.WALKING;
    IMAGES_ATTACK = ImageHub.BOSS.ATTACK;
    IMAGES_DEAD = ImageHub.BOSS.DEAD;

    attackToggle = false;
    world;
    lastImageIndex = -1;
    intervalId = null;
    movementIntervalId = null;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage("./assets/img/monster/ghost_boss.png");

        this.x = 4800;
        this.y = 180;

        this.animate();
    }

    animate() {
        // 1. Animations-Loop (schaltet die Bilder in gemütlichem Tempo durch)
        this.intervalId = setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;
            if (this.isDead) return;

            if (this.world.character && this.world.character.x > 2560) {
                this.isActivated = true;
            }

            if (!this.isHurt) {
                if (this.energy <= 4) {
                    this.playAnimation(this.IMAGES_WALKING);
                } else {
                    this.playAnimation(this.IMAGES_ATTACK);
                    let currentIndex =
                        this.currentImage % this.IMAGES_ATTACK.length;

                    if (
                        currentIndex === 2 &&
                        this.lastImageIndex !== 2 &&
                        this.isActivated
                    ) {
                        this.throwCrystal();
                    }
                    this.lastImageIndex = currentIndex;
                }
            }
        }, 700);

        // 2. Bewegungs-Loop (läuft flüssig mit 60 FPS, sobald Phase 2 aktiv ist)
        this.movementIntervalId = setInterval(() => {
            if (
                !this.world ||
                !this.world.gameStarted ||
                this.isDead ||
                this.isHurt
            )
                return;

            if (this.isActivated && this.energy <= 4 && this.world.character) {
                if (this.world.character.x < this.x) {
                    this.x -= this.speed;
                    this.otherDirection = false;
                } else {
                    this.x += this.speed;
                    this.otherDirection = true;
                }
            }
        }, 1000 / 60);
    }

    throwCrystal() {
        if (!this.world || this.isDead || !this.isActivated || this.energy <= 4)
            return;
        this.world.audioHub.playBossShoot();

        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 210 : this.y + 340;
        let crystalX = this.x - 40;

        let crystal = new CrystalProjectile(crystalX, crystalY, this.world, -1);
        crystal.loadImage("./assets/img/waffen/crystal_geschoss.webp");

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
        if (this.movementIntervalId) {
            clearInterval(this.movementIntervalId);
            this.movementIntervalId = null;
        }
    }
}

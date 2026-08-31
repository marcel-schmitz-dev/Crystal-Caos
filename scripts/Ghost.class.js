import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

/**
 * Represents the final Ghost Boss enemy.
 */
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

    /**
     * Initializes the Ghost Boss assets and starting position.
     */
    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_ATTACK);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImage("./assets/img/monster/ghost_boss.png");
        this.x = 4800;
        this.y = 180;
        this.animate();
    }

    /**
     * Starts animation and movement loops for the boss.
     */
    animate() {
        this.intervalId = setInterval(() => this.runAnimationTick(), 700);
        this.movementIntervalId = setInterval(
            () => this.runMovementTick(),
            1000 / 60,
        );
    }

    /**
     * Processes animation frames and activation triggers per tick.
     */
    runAnimationTick() {
        if (!this.world || !this.world.gameStarted || this.isDead) return;
        if (this.world.character && this.world.character.x > 2560)
            this.isActivated = true;

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
    }

    /**
     * Processes chasing movement ticks when active.
     */
    runMovementTick() {
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
    }

    /**
     * Spawns a crystal projectile aimed from the boss towards the player.
     */
    throwCrystal() {
        if (!this.world || this.isDead || !this.isActivated || this.energy <= 4)
            return;
        this.world.audioHub.playBossShoot();
        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 210 : this.y + 340;
        let crystal = new CrystalProjectile(
            this.x - 40,
            crystalY,
            this.world,
            -1,
        );
        crystal.loadImage("./assets/img/waffen/crystal_geschoss.webp");
        this.world.throwableObjects.push(crystal);
    }

    /**
     * Applies damage to the boss and triggers reactions.
     * @param {number} [damage=1] - Damage amount.
     */
    hit(damage = 1) {
        if (!this.isActivated || this.isDead) return;
        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.isDead = true;
            this.playDeathAnimation();
        } else {
            this.playHurtAnimation();
        }
    }

    /**
     * Triggers temporary hurt reaction state.
     */
    playHurtAnimation() {
        this.isHurt = true;
        this.loadImage(ImageHub.BOSS.HURT);
        setTimeout(() => {
            this.isHurt = false;
        }, 300);
    }

    /**
     * Plays the death sequence and removes boss from level.
     */
    playDeathAnimation() {
        this.stopAnimation();
        let currentFrame = 0;
        let deathInterval = setInterval(() => {
            if (currentFrame < this.IMAGES_DEAD.length) {
                this.loadImage(this.IMAGES_DEAD[currentFrame]);
                currentFrame++;
            } else {
                clearInterval(deathInterval);
                let index = this.world?.level?.enemies?.indexOf(this);
                if (index > -1) this.world.level.enemies.splice(index, 1);
            }
        }, 150);
    }

    /**
     * Stops all running intervals for the boss.
     */
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

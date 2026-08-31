import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";
import { Ghost } from "./Ghost.class.js";

/**
 * Represents the main player character in the game.
 * Handles movement, animations, gravity, health, and actions.
 */
export class Character extends MovableObject {
    width = 180;
    height = 240;
    energy = 5;

    IMAGES_STANDING = ImageHub.CHARACTER.STANDING;
    IMAGES_WALKING = ImageHub.CHARACTER.WALKING;
    IMAGES_IDLE_0 = ImageHub.CHARACTER.IDLE_0;
    IMAGES_LONG_IDLE = ImageHub.CHARACTER.LONG_IDLE;
    IMAGES_JUMPING = ImageHub.CHARACTER.JUMPING;
    IMAGES_DODGING = ImageHub.CHARACTER.DODGING;
    IMAGES_HURT = ImageHub.CHARACTER.HURT;
    IMAGES_DEAD = ImageHub.CHARACTER.DEAD;
    IMAGES_ATTACK = ImageHub.CHARACTER.ATTACK;

    currentImage = 0;
    currentJumpImage = 0;
    currentDodgeImage = 0;
    currentDeadImage = 0;
    crystals = 0;
    deadAnimationStarted = false;
    isDodgeEnding = false;
    isThrowing = false;
    world;
    lastHit = 0;

    /**
     * Initializes the character, loads images, applies gravity and starts loops.
     */
    constructor() {
        super();
        this.loadAllCharacterImages();
        this.applyGravity();
        this.animate();
        this.idleTimer = 0;
        this.idleThreshold = 24;
        this.longIdleThreshold = 60;
        this.currentLongIdleImage = 0;
    }

    /**
     * Loads all sprite arrays required for the character animations.
     */
    loadAllCharacterImages() {
        this.loadImage(this.IMAGES_STANDING[0]);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImage(this.IMAGES_IDLE_0);
        this.loadImages(this.IMAGES_LONG_IDLE);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DODGING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.loadImages(this.IMAGES_ATTACK);
    }

    /**
     * Starts the main animation and control loops.
     */
    animate() {
        setInterval(() => this.runGameLoop(), 1000 / 60);
        setInterval(() => this.runAnimationLoop(), 1000 / 12);
    }

    /**
     * Handles movement and input logic per frame.
     */
    runGameLoop() {
        if (!this.isGameActive()) return;

        let keyboard = this.world.keyboard;
        if (!keyboard) return;

        this.handleHorizontalMovement(keyboard);
        this.handleVerticalMovement(keyboard);
        this.updateCamera();
    }

    /**
     * Checks if the game is active and character can move.
     * @returns {boolean} True if game has started and character is alive.
     */
    isGameActive() {
        return this.world && this.world.gameStarted && this.energy > 0;
    }

    /**
     * Processes left and right movement and direction changes, including crawling.
     * @param {Object} keyboard - The current keyboard state.
     */
    handleHorizontalMovement(keyboard) {
        let isCrawling = keyboard.DOWN && !this.isAboveGround();
        this.world.audioHub.playCrawling(isCrawling);

        let isMovingHorizontally =
            (keyboard.RIGHT || keyboard.LEFT) &&
            !this.isAboveGround() &&
            !isCrawling;
        this.world.audioHub.playCharacterWalk(isMovingHorizontally);

        let moveSpeed = isCrawling ? 2 : 5;

        if (keyboard.RIGHT && !this.isDodgeEnding) {
            this.otherDirection = false;
            if (!this.isThrowing && this.x < this.world.level.level_end_x) {
                this.x += moveSpeed;
            }
        }
        if (keyboard.LEFT && !this.isDodgeEnding) {
            this.otherDirection = true;
            if (!this.isThrowing && this.x > 0) {
                this.x -= moveSpeed;
            }
        }
    }

    /**
     * Processes jumping and dodging inputs.
     * @param {Object} keyboard - The current keyboard state.
     */
    handleVerticalMovement(keyboard) {
        if (this.isThrowing) return;

        if (keyboard.UP && !this.isAboveGround() && !this.isDodgeEnding) {
            this.jump();
            if (this.world && this.world.audioHub) {
                this.world.audioHub.playJump();
            }
        }

        if (keyboard.DOWN && !this.isAboveGround()) {
            this.ausweichen();
        } else if (
            !keyboard.DOWN &&
            this.currentDodgeImage > 0 &&
            !this.isDodgeEnding
        ) {
            this.startDodgeEnd();
        }
    }

    /**
     * Updates the camera position based on character coordinates.
     */
    updateCamera() {
        if (this.x > 400) {
            this.world.camera_x = Math.floor(this.x - 400);
        } else {
            this.world.camera_x = 0;
        }
    }

    /**
     * Selects and plays the correct animation based on character state.
     */
    runAnimationLoop() {
        if (!this.world || !this.world.gameStarted) return;

        let keyboard = this.world.keyboard;
        if (!keyboard || this.isThrowing) return;

        if (this.energy <= 0) {
            this.playDeadAnimation();
        } else if (this.isHurtAnimationActive()) {
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isAboveGround()) {
            this.playJumpAnimation();
        } else if (this.isDodgeEnding) {
            this.finishDodgeAnimation();
        } else if (keyboard.DOWN && (keyboard.LEFT || keyboard.RIGHT)) {
            this.playCrawlAnimation();
        } else if (keyboard.DOWN) {
            this.playDodgeAnimation();
        } else {
            this.playStandardAnimation(keyboard);
        }
    }

    /**
     * Checks if the hurt animation should be shown.
     * @returns {boolean} True if character is currently hurt.
     */
    isHurtAnimationActive() {
        return this.isHurt() && this.IMAGES_HURT && this.IMAGES_HURT.length > 0;
    }

    /**
     * Handles the sequence of death animations.
     */
    playDeadAnimation() {
        if (!this.deadAnimationStarted) {
            this.currentDeadImage = 0;
            this.deadAnimationStarted = true;
        }
        if (this.IMAGES_DEAD && this.IMAGES_DEAD[this.currentDeadImage]) {
            this.loadImage(this.IMAGES_DEAD[this.currentDeadImage]);
            if (this.currentDeadImage < this.IMAGES_DEAD.length - 1) {
                this.currentDeadImage++;
            }
        }
    }

    /**
     * Progresses through the jumping animation frames.
     */
    playJumpAnimation() {
        let path = this.IMAGES_JUMPING[this.currentJumpImage];
        this.loadImage(path);
        if (this.currentJumpImage < this.IMAGES_JUMPING.length - 1) {
            this.currentJumpImage++;
        }
    }

    /**
     * Progresses through the crawling animation frames.
     */
    playCrawlAnimation() {
        if (!this.IMAGES_CROUCHING || this.IMAGES_CROUCHING.length === 0) {
            this.IMAGES_CROUCHING = ImageHub.CHARACTER.CROUCHING;
        }

        let path =
            this.IMAGES_CROUCHING[
                this.currentImage % this.IMAGES_CROUCHING.length
            ];
        this.loadImage(path);
        this.currentImage =
            (this.currentImage + 1) % this.IMAGES_CROUCHING.length;
    }

    /**
     * Resets state after dodge sequence completes.
     */
    finishDodgeAnimation() {
        this.loadImage(this.IMAGES_DODGING[5]);
        this.currentDodgeImage = 0;
        this.isDodgeEnding = false;
    }

    /**
     * Progresses through the dodging animation frames.
     */
    playDodgeAnimation() {
        let path = this.IMAGES_DODGING[this.currentDodgeImage];
        this.loadImage(path);
        if (this.currentDodgeImage < 4) {
            this.currentDodgeImage++;
        }
    }

    /**
     * Plays walking or standing animations depending on input.
     * @param {Object} keyboard - The current keyboard state.
     */
    playStandardAnimation(keyboard) {
        this.currentJumpImage = 0;
        this.currentDodgeImage = 0;

        if (keyboard.RIGHT || keyboard.LEFT || keyboard.UP || keyboard.DOWN) {
            this.idleTimer = 0;
            this.currentLongIdleImage = 0;

            let path = this.IMAGES_WALKING[this.currentImage];
            if (path) {
                this.loadImage(path);
                this.currentImage =
                    (this.currentImage + 1) % this.IMAGES_WALKING.length;
            }
        } else {
            this.idleTimer++;

            if (this.idleTimer > this.longIdleThreshold) {
                let path = this.IMAGES_LONG_IDLE[this.currentLongIdleImage];
                this.loadImage(path);
                if (Math.random() < 0.2) {
                    this.currentLongIdleImage =
                        (this.currentLongIdleImage + 1) %
                        this.IMAGES_LONG_IDLE.length;
                }
            } else if (this.idleTimer > this.idleThreshold) {
                if (this.IMAGES_IDLE_0) {
                    this.loadImage(this.IMAGES_IDLE_0);
                }
            } else {
                if (this.IMAGES_STANDING && this.IMAGES_STANDING[0]) {
                    this.loadImage(this.IMAGES_STANDING[0]);
                }
            }
            this.currentImage = 0;
        }
    }

    /**
     * Applies damage to the character if cooldown allows it.
     * @param {number} [damage=1] - The amount of damage to take.
     */
    hit(damage = 1) {
        if (this.energy <= 0) return;

        let timePassed = (new Date().getTime() - this.lastHit) / 1000;
        if (timePassed > 1) {
            this.energy -= damage;
            this.lastHit = new Date().getTime();
            if (this.energy < 0) this.energy = 0;
        }
    }

    /**
     * Triggers the crystal throwing action if available.
     * @returns {boolean} True if throw was successfully executed.
     */
    throwCrystal() {
        if (this.crystals > 0 && !this.isThrowing) {
            this.isThrowing = true;
            this.crystals--;

            if (this.world && this.world.audioHub) {
                this.world.audioHub.playPlayerThrow();
            }

            this.executeThrowSequence();
            return true;
        }
        return false;
    }

    /**
     * Iterates through attack images during a crystal throw.
     */
    executeThrowSequence() {
        let currentThrowImage = 0;
        let throwInterval = setInterval(() => {
            let path = this.IMAGES_ATTACK[currentThrowImage];
            this.loadImage(path);
            currentThrowImage++;

            if (currentThrowImage >= this.IMAGES_ATTACK.length) {
                clearInterval(throwInterval);
                setTimeout(() => {
                    this.isThrowing = false;
                }, 400);
            }
        }, 180);
    }

    /**
     * Spawns a crystal projectile aimed at the center of the boss.
     */
    throwCrystalAtBoss() {
        let boss = this.world.enemies.find((e) => e instanceof Ghost);

        let targetX = boss
            ? boss.x + boss.width / 2
            : this.x + (this.otherDirection ? -500 : 500);
        let targetY = boss ? boss.y + boss.height / 2 : this.y;

        let startX = this.otherDirection ? this.x - 20 : this.x + this.width;
        let startY = this.y + 70;

        let crystal = new CrystalProjectile(startX, startY, targetX, targetY);
        crystal.loadImage("./assets/img/character/angreifen/core_flug.webp");

        this.world.throwableObjects.push(crystal);
    }

    /**
     * Checks if character is currently in a hurt state window.
     * @returns {boolean} True if hurt timer is active.
     */
    isHurt() {
        if (this.energy <= 0) return false;
        let timepassed = (new Date().getTime() - this.lastHit) / 1000;
        return timepassed < 0.5;
    }

    /**
     * Initiates a jump action.
     */
    jump() {
        this.speedY = 25;
        this.currentJumpImage = 0;
    }

    /**
     * Placeholder method for dodging behavior.
     */
    ausweichen() {}

    /**
     * Flags the end of a dodge action.
     */
    startDodgeEnd() {
        this.isDodgeEnding = true;
    }
}

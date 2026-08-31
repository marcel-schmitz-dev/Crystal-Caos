import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";
import { Ghost } from "./Ghost.class.js";

/**
 * Represents the main player character, managing movement, health, and animations.
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
     * Initializes character assets, gravity, and animation/game loops.
     */
    constructor() {
        super();
        this.loadAllCharacterImages();
        this.applyGravity();
        this.animate();
        this.initIdleProperties();
    }

    /**
     * Sets initial values for the idle timer states.
     */
    initIdleProperties() {
        this.idleTimer = 0;
        this.idleThreshold = 24;
        this.longIdleThreshold = 60;
        this.currentLongIdleImage = 0;
    }

    /**
     * Loads all required animation sprite arrays.
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
     * Starts game loop and animation loop intervals.
     */
    animate() {
        setInterval(() => this.runGameLoop(), 1000 / 60);
        setInterval(() => this.runAnimationLoop(), 1000 / 12);
    }

    /**
     * Handles movement and input execution per frame.
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
     * Checks if the game is running and character is alive.
     * @returns {boolean} True if active.
     */
    isGameActive() {
        return this.world && this.world.gameStarted && this.energy > 0;
    }

    /**
     * Processes horizontal movement, crawling, and audio triggers.
     * @param {Object} keyboard - Active keyboard state.
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
        this.applyRightMovement(keyboard, moveSpeed);
        this.applyLeftMovement(keyboard, moveSpeed);
    }

    /**
     * Moves character right if input is given.
     * @param {Object} keyboard - Keyboard state.
     * @param {number} speed - Movement speed.
     */
    applyRightMovement(keyboard, speed) {
        if (keyboard.RIGHT && !this.isDodgeEnding) {
            this.otherDirection = false;
            if (!this.isThrowing && this.x < this.world.level.level_end_x) {
                this.x += speed;
            }
        }
    }

    /**
     * Moves character left if input is given.
     * @param {Object} keyboard - Keyboard state.
     * @param {number} speed - Movement speed.
     */
    applyLeftMovement(keyboard, speed) {
        if (keyboard.LEFT && !this.isDodgeEnding) {
            this.otherDirection = true;
            if (!this.isThrowing && this.x > 0) {
                this.x -= speed;
            }
        }
    }

    /**
     * Processes jump and dodge inputs.
     * @param {Object} keyboard - Keyboard state.
     */
    handleVerticalMovement(keyboard) {
        if (this.isThrowing) return;
        if (keyboard.UP && !this.isAboveGround() && !this.isDodgeEnding) {
            this.jump();
            if (this.world?.audioHub) this.world.audioHub.playJump();
        }
        if (keyboard.DOWN && !this.isAboveGround()) {
            this.dodge();
        } else if (
            !keyboard.DOWN &&
            this.currentDodgeImage > 0 &&
            !this.isDodgeEnding
        ) {
            this.startDodgeEnd();
        }
    }

    /**
     * Updates camera position based on character location.
     */
    updateCamera() {
        this.world.camera_x = this.x > 400 ? Math.floor(this.x - 400) : 0;
    }

    /**
     * Selects appropriate animation sequence based on state.
     */
    runAnimationLoop() {
        if (!this.world || !this.world.gameStarted) return;
        let keyboard = this.world.keyboard;
        if (!keyboard || this.isThrowing) return;

        if (this.energy <= 0) this.playDeadAnimation();
        else if (this.isHurtAnimationActive())
            this.playAnimation(this.IMAGES_HURT);
        else if (this.isAboveGround()) this.playJumpAnimation();
        else if (this.isDodgeEnding) this.finishDodgeAnimation();
        else if (keyboard.DOWN && (keyboard.LEFT || keyboard.RIGHT))
            this.playCrawlAnimation();
        else if (keyboard.DOWN) this.playDodgeAnimation();
        else this.playStandardAnimation(keyboard);
    }

    /**
     * Checks if hurt animation is ready to play.
     * @returns {boolean} True if hurt.
     */
    isHurtAnimationActive() {
        return this.isHurt() && this.IMAGES_HURT?.length > 0;
    }

    /**
     * Plays death sequence animation frames.
     */
    playDeadAnimation() {
        if (!this.deadAnimationStarted) {
            this.currentDeadImage = 0;
            this.deadAnimationStarted = true;
        }
        if (this.IMAGES_DEAD[this.currentDeadImage]) {
            this.loadImage(this.IMAGES_DEAD[this.currentDeadImage]);
            if (this.currentDeadImage < this.IMAGES_DEAD.length - 1)
                this.currentDeadImage++;
        }
    }

    /**
     * Plays jump animation frame.
     */
    playJumpAnimation() {
        this.loadImage(this.IMAGES_JUMPING[this.currentJumpImage]);
        if (this.currentJumpImage < this.IMAGES_JUMPING.length - 1)
            this.currentJumpImage++;
    }

    /**
     * Plays crawling animation frames.
     */
    playCrawlAnimation() {
        if (!this.IMAGES_CROUCHING?.length)
            this.IMAGES_CROUCHING = ImageHub.CHARACTER.CROUCHING;
        let path =
            this.IMAGES_CROUCHING[
                this.currentImage % this.IMAGES_CROUCHING.length
            ];
        this.loadImage(path);
        this.currentImage =
            (this.currentImage + 1) % this.IMAGES_CROUCHING.length;
    }

    /**
     * Finalizes the dodge action sequence.
     */
    finishDodgeAnimation() {
        this.loadImage(this.IMAGES_DODGING[5]);
        this.currentDodgeImage = 0;
        this.isDodgeEnding = false;
    }

    /**
     * Plays dodge sequence animation frames.
     */
    playDodgeAnimation() {
        this.loadImage(this.IMAGES_DODGING[this.currentDodgeImage]);
        if (this.currentDodgeImage < 4) this.currentDodgeImage++;
    }

    /**
     * Plays standing, idle, or walking animations.
     * @param {Object} keyboard - Keyboard state.
     */
    playStandardAnimation(keyboard) {
        this.currentJumpImage = 0;
        this.currentDodgeImage = 0;
        if (keyboard.RIGHT || keyboard.LEFT || keyboard.UP || keyboard.DOWN) {
            this.handleWalkingAnimation();
        } else {
            this.handleIdleAnimation();
        }
    }

    /**
     * Handles walking sprite frame progression.
     */
    handleWalkingAnimation() {
        this.idleTimer = 0;
        this.currentLongIdleImage = 0;
        let path = this.IMAGES_WALKING[this.currentImage];
        if (path) {
            this.loadImage(path);
            this.currentImage =
                (this.currentImage + 1) % this.IMAGES_WALKING.length;
        }
    }

    /**
     * Handles idle and long idle timeouts and sprite switches.
     */
    handleIdleAnimation() {
        this.idleTimer++;
        if (this.idleTimer > this.longIdleThreshold) {
            this.loadImage(this.IMAGES_LONG_IDLE[this.currentLongIdleImage]);
            if (Math.random() < 0.2) {
                this.currentLongIdleImage =
                    (this.currentLongIdleImage + 1) %
                    this.IMAGES_LONG_IDLE.length;
            }
        } else if (this.idleTimer > this.idleThreshold) {
            if (this.IMAGES_IDLE_0) this.loadImage(this.IMAGES_IDLE_0);
        } else {
            if (this.IMAGES_STANDING[0])
                this.loadImage(this.IMAGES_STANDING[0]);
        }
        this.currentImage = 0;
    }

    /**
     * Applies damage to character if hit cooldown has passed.
     * @param {number} [damage=1] - Damage value.
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
     * Triggers crystal throwing action if crystals are available.
     * @returns {boolean} True if throw started successfully.
     */
    throwCrystal() {
        if (this.crystals > 0 && !this.isThrowing) {
            this.isThrowing = true;
            this.crystals--;
            if (this.world?.audioHub) this.world.audioHub.playPlayerThrow();
            this.executeThrowSequence();
            return true;
        }
        return false;
    }

    /**
     * Runs attack sprite frames during a throw action.
     */
    executeThrowSequence() {
        let currentThrowImage = 0;
        let throwInterval = setInterval(() => {
            this.loadImage(this.IMAGES_ATTACK[currentThrowImage]);
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
     * Spawns a crystal projectile targeting the boss.
     */
    throwCrystalAtBoss() {
        let boss = this.world.enemies.find((e) => e instanceof Ghost);
        let targetX = boss
            ? boss.x + boss.width / 2
            : this.x + (this.otherDirection ? -500 : 500);
        let targetY = boss ? boss.y + boss.height / 2 : this.y;
        let startX = this.otherDirection ? this.x - 20 : this.x + this.width;

        let crystal = new CrystalProjectile(
            startX,
            this.y + 70,
            targetX,
            targetY,
        );
        crystal.loadImage("./assets/img/character/angreifen/core_flug.webp");
        this.world.throwableObjects.push(crystal);
    }

    /**
     * Checks if character is currently in hurt window.
     * @returns {boolean} True if hurt active.
     */
    isHurt() {
        if (this.energy <= 0) return false;
        return (new Date().getTime() - this.lastHit) / 1000 < 0.5;
    }

    /**
     * Initiates a jump action.
     */
    jump() {
        this.speedY = 25;
        this.currentJumpImage = 0;
    }

    /**
     * Placeholder method for character dodge action.
     */
    dodge() {}

    /**
     * Flags the end state of a dodge action.
     */
    startDodgeEnd() {
        this.isDodgeEnding = true;
    }
}

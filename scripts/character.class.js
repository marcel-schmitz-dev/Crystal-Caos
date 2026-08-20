import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class Character extends MovableObject {
    width = 150;
    height = 200;
    energy = 5;

    IMAGES_STANDING = ImageHub.CHARACTER.STANDING;
    IMAGES_WALKING = ImageHub.CHARACTER.WALKING;
    IMAGES_JUMPING = ImageHub.CHARACTER.JUMPING;
    IMAGES_DODGING = ImageHub.CHARACTER.DODGING;
    IMAGES_HURT = ImageHub.CHARACTER.HURT;
    IMAGES_DEAD = ImageHub.CHARACTER.DEAD; // Neu: Sterbe-Animation

    currentImage = 0;
    currentJumpImage = 0;
    currentDodgeImage = 0;
    currentDeadImage = 0; // Neu: Zähler für die Toten-Frames
    deadAnimationStarted = false; // Neu: Verhindert Schleifenwiederholung
    isDodgeEnding = false;
    world;

    constructor() {
        super();
        this.loadImage(this.IMAGES_STANDING[0]);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DODGING);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD); // Neu: Toten-Bilder vorladen

        this.applyGravity();
        this.animate();
    }

    animate() {
        // 1. Logik-Schleife (60 FPS)
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;
            if (this.energy <= 0) return; // Wenn tot, keine Bewegung mehr

            let keyboard = this.world.keyboard;
            if (!keyboard) return;

            if (
                keyboard.RIGHT &&
                !keyboard.DOWN &&
                !this.isDodgeEnding &&
                this.x < this.world.level.level_end_x
            ) {
                this.x += 5;
                this.otherDirection = false;
            }
            if (
                keyboard.LEFT &&
                !keyboard.DOWN &&
                !this.isDodgeEnding &&
                this.x > 0
            ) {
                this.x -= 5;
                this.otherDirection = true;
            }
            if (keyboard.UP && !this.isAboveGround() && !this.isDodgeEnding) {
                this.jump();
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

            if (this.x > 400) {
                this.world.camera_x = Math.floor(this.x - 400);
            } else {
                this.world.camera_x = 0;
            }
        }, 1000 / 60);

        // 2. Animations-Schleife (12 FPS)
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;

            let keyboard = this.world.keyboard;
            if (!keyboard) return;

            // --- NEU: TOT-ANIMATION EINMALIG ABSETZEN ---
            if (this.energy <= 0) {
                if (!this.deadAnimationStarted) {
                    this.currentDeadImage = 0;
                    this.deadAnimationStarted = true;
                }

                let path = this.IMAGES_DEAD[this.currentDeadImage];
                this.loadImage(path);

                // Durchläuft alle Frames bis zum letzten (dead9.png) und bleibt dort stehen
                if (this.currentDeadImage < this.IMAGES_DEAD.length - 1) {
                    this.currentDeadImage++;
                }
                return; // Stoppt alle anderen Animationen absolut zuverlässig!
            }

            // --- NORMALE ANIMATIONEN ---
            if (
                this.isHurt() &&
                this.IMAGES_HURT &&
                this.IMAGES_HURT.length > 0
            ) {
                this.playAnimation(this.IMAGES_HURT);
            } else if (this.isAboveGround()) {
                let path = this.IMAGES_JUMPING[this.currentJumpImage];
                this.loadImage(path);
                if (this.currentJumpImage < this.IMAGES_JUMPING.length - 1) {
                    this.currentJumpImage++;
                }
            } else if (this.isDodgeEnding) {
                this.loadImage(this.IMAGES_DODGING[5]);
                this.currentDodgeImage = 0;
                this.isDodgeEnding = false;
            } else if (keyboard.DOWN) {
                let path = this.IMAGES_DODGING[this.currentDodgeImage];
                this.loadImage(path);

                if (this.currentDodgeImage < 4) {
                    this.currentDodgeImage++;
                }
            } else {
                this.currentJumpImage = 0;
                this.currentDodgeImage = 0;

                if (keyboard.RIGHT || keyboard.LEFT) {
                    let path = this.IMAGES_WALKING[this.currentImage];
                    this.loadImage(path);
                    this.currentImage =
                        (this.currentImage + 1) % this.IMAGES_WALKING.length;
                } else {
                    this.loadImage(this.IMAGES_STANDING[0]);
                    this.currentImage = 0;
                }
            }
        }, 1000 / 12);
    }

    lastHit = 0;

    hit(damage = 1) {
        // Wenn der Charakter bereits tot ist, passiert gar nichts mehr!
        if (this.energy <= 0) return;

        let timePassed = (new Date().getTime() - this.lastHit) / 1000;

        if (timePassed > 1) {
            this.energy -= damage;
            this.lastHit = new Date().getTime();

            if (this.energy < 0) {
                this.energy = 0;
            }
        }
    }

    isHurt() {
        if (this.energy <= 0) return false;
        let timepassed = new Date().getTime() - this.lastHit;
        timepassed = timepassed / 1000;
        return timepassed < 0.5;
    }

    jump() {
        this.speedY = 25;
        this.currentJumpImage = 0;
    }

    ausweichen() {}

    startDodgeEnd() {
        this.isDodgeEnding = true;
    }
}

import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class Character extends MovableObject {
    width = 150;
    height = 200;

    IMAGES_STANDING = ImageHub.CHARACTER.STANDING;
    IMAGES_WALKING = ImageHub.CHARACTER.WALKING;
    IMAGES_JUMPING = ImageHub.CHARACTER.JUMPING;
    IMAGES_DODGING = ImageHub.CHARACTER.DODGING;

    currentImage = 0;
    currentJumpImage = 0;
    currentDodgeImage = 0;
    isDodgeEnding = false;
    world;

    constructor() {
        super();
        this.loadImage(this.IMAGES_STANDING[0]);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_DODGING);

        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;

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

        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;

            let keyboard = this.world.keyboard;
            if (!keyboard) return;

            if (this.isAboveGround()) {
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

    jump() {
        this.speedY = 25;
        this.currentJumpImage = 0;
    }

    ausweichen() {}

    startDodgeEnd() {
        this.isDodgeEnding = true;
    }
}

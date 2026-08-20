class Character extends MovableObject {
    width = 150;
    height = 150;

    IMAGES_STANDING = ["assets/img/character/Stehen3.png"];

    IMAGES_WALKING = [
        "assets/img/character/B1.png",
        "assets/img/character/B2.png",
        "assets/img/character/B15.png",
        "assets/img/character/B5.png",
        "assets/img/character/B1.png",
        "assets/img/character/B2.png",
        "assets/img/character/B15.png",
        "assets/img/character/B5.png",
    ];

    IMAGES_JUMPING = [
        "assets/img/character/springen/sprung1.png",
        "assets/img/character/springen/sprung2.png",
        "assets/img/character/springen/sprung3.png",
        "assets/img/character/springen/sprung4.png",
        "assets/img/character/springen/sprung5.png",
        "assets/img/character/springen/sprung6.png",
        "assets/img/character/springen/sprung7.png",
        "assets/img/character/springen/sprung8.png",
    ];

    IMAGES_DODGING = [
        "assets/img/character/dodge/dodge1.png",
        "assets/img/character/dodge/dodge2.png",  
        "assets/img/character/dodge/dodge3.png",
        "assets/img/character/dodge/dodge4.png",
        "assets/img/character/dodge/dodge5.png",
        "assets/img/character/dodge/dodge6.png",
    ];

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
            if (keyboard.LEFT && !keyboard.DOWN && !this.isDodgeEnding && this.x > 0) {
                this.x -= 5;
                this.otherDirection = true;
            }
            if (keyboard.UP && !this.isAboveGround() && !this.isDodgeEnding) {
                this.jump();
            }

            if (keyboard.DOWN && !this.isAboveGround()) {
                this.ausweichen();
            } else if (!keyboard.DOWN && this.currentDodgeImage > 0 && !this.isDodgeEnding) {
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

    ausweichen() {
    }

    startDodgeEnd() {
        this.isDodgeEnding = true;
    }
}
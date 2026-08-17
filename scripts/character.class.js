class Character extends MovableObject {
    width = 150;
    height = 150;

    IMAGES_STANDING = ["assets/img/character/bewegung1.png"];

    IMAGES_WALKING = [
        "assets/img/character/bewegung8.png",
        "assets/img/character/bewegung11.png",
        "assets/img/character/bewegung12.png",
    ];

    IMAGES_JUMPING = ["assets/img/character/springen.png"];

    IMAGES_DODGING = ["assets/img/character/ausweichen.png"];

    currentImage = 0;
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
            let keyboard = this.world?.keyboard;
            if (!keyboard) return;

            if (keyboard.RIGHT && this.x < 1800) {
                this.x += 5;
                this.otherDirection = false;
            }
            if (keyboard.LEFT && this.x > -500) {
                this.x -= 5;
                this.otherDirection = true;
            }
            if (keyboard.UP && !this.isAboveGround()) {
                this.jump();
            }
            if (keyboard.DOWN) {
                this.ausweichen();
            }

            if (this.x > 400) {
                this.world.camera_x = Math.floor(this.x - 400);
            } else {
                this.world.camera_x = 0;
            }
        }, 1000 / 60);

        setInterval(() => {
            let keyboard = this.world?.keyboard;
            if (!keyboard) return;

            if (this.isAboveGround()) {
                this.loadImage(this.IMAGES_JUMPING[0]);
            } else if (keyboard.DOWN) {
                this.loadImage(this.IMAGES_DODGING[0]);
            } else if (keyboard.RIGHT || keyboard.LEFT) {
                let path = this.IMAGES_WALKING[this.currentImage];
                this.loadImage(path);
                this.currentImage =
                    (this.currentImage + 1) % this.IMAGES_WALKING.length;
            } else {
                this.loadImage(this.IMAGES_STANDING[0]);
                this.currentImage = 0;
            }

        }, 1000 / 8);
    }

    jump() {
        this.speedY = 25;
    }

    ausweichen() {}
}

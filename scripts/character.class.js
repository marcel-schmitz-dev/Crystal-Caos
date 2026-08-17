class Character extends MovableObject {
    width = 150;
    height = 150;

    IMAGES_STANDING = ["assets/img/character/bewegung1.png"];

    IMAGES_WALKING = [
        "assets/img/character/bewegung8.png",
        "assets/img/character/bewegung11.png",
        "assets/img/character/bewegung12.png",
    ];

    currentImage = 0;
    world;

    constructor() {
        super();
        this.loadImage(this.IMAGES_STANDING[0]);
        this.loadImages(this.IMAGES_STANDING);
        this.loadImages(this.IMAGES_WALKING);
        this.animate();
    }

    animate() {
        setInterval(() => {
            let keyboard = this.world?.keyboard;
            if (!keyboard) return;

            if (keyboard.RIGHT) {
                this.x += 5;
            }
            if (keyboard.LEFT) {
                this.x -= 5;
            }
            if (keyboard.UP) {
                this.jump();
            }
        }, 1000 / 60);

        setInterval(() => {
            let keyboard = this.world?.keyboard;
            if (!keyboard) return;

            if (keyboard.RIGHT || keyboard.LEFT) {
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

    jump() {}

    ausweichen() {}
}

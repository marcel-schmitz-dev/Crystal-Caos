class Ghost extends MovableObject {
    height = 450;
    width = 400;

    IMAGES_WALKING = [
        "assets/img/monster/ghost_boss1.png",
        "assets/img/monster/ghost_boss2.png",
        "assets/img/monster/ghost_boss3.png",
        "assets/img/monster/ghost_boss.png",
    ];

    attackToggle = false;
    world;
    lastImageIndex = -1;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage("assets/img/monster/ghost_boss.png");

        this.x = 3300;
        this.y = 180;

        this.animate();
    }

    animate() {
        setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;

            this.playAnimation(this.IMAGES_WALKING);

            let currentIndex = this.currentImage % this.IMAGES_WALKING.length;

            if (currentIndex === 2 && this.lastImageIndex !== 2) {
                this.throwCrystal();
            }

            this.lastImageIndex = currentIndex;
        }, 600);
    }

    throwCrystal() {
        if (!this.world) return;

        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 250 : this.y + 340;
        let crystalX = this.x - 40;

        let crystal = new CrystalProjectile(crystalX, crystalY, this.world);
        this.world.throwableObjects.push(crystal);
    }
}

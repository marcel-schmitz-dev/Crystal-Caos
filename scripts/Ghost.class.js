class Ghost extends MovableObject {
    height = 450;
    width = 400;

    IMAGES_WALKING = [
        "assets/img/monster/ghost_walk_01.png",
        "assets/img/monster/ghost_walk_02.png",
        "assets/img/monster/ghost_walk_03.png",
        "assets/img/monster/ghost_walk_04.png",
    ];

    attackToggle = false;
    world;
    lastImageIndex = -1;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage("assets/img/monster/ghost_walk_01.png");

        this.x = 2700;
        this.y = 180;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.IMAGES_WALKING);

            let currentIndex = this.currentImage % this.IMAGES_WALKING.length;

            if (currentIndex === 2 && this.lastImageIndex !== 2) {
                this.throwCrystal();
            }

            this.lastImageIndex = currentIndex;
        }, 400);
    }

    throwCrystal() {
        if (!this.world) return;

        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 260 : this.y + 320;
        let crystalX = this.x - 40;

        let crystal = new CrystalProjectile(crystalX, crystalY);
        this.world.throwableObjects.push(crystal);
    }
}

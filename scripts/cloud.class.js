class cloud extends MovableObject {
    width = 120;
    height = 120;

    constructor() {
        super().loadImage("assets/img/monster/qualle.png");

        this.x = Math.random() * 1200;

        this.y = 50 + Math.random() * 200;

        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.15;
            if (this.x < -this.width) {
                this.x = 1200;
            }
        }, 1000 / 60);
    }
}

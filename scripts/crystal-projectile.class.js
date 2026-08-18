class CrystalProjectile extends MovableObject {
    width = 80;
    height = 50;
    speedX = 10;

    constructor(x, y) {
        super().loadImage("assets/img/waffen/crystall_geschoss.png");
        this.x = x;
        this.y = y;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= this.speedX;
        }, 1000 / 60);
    }
}

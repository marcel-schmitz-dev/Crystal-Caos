class Qualle extends MovableObject {
    width = 80;
    height = 80;

    constructor() {
        super().loadImage("assets/img/qualle.png");

        this.x = 0 + Math.random() * 1100;
        this.y = 50 + Math.random() * 200;
    }
}

class Cloud extends MovableObject {
    constructor() {
        super().loadImage("assets/img/Background.png");

        this.x = 200 + Math.random() * 500;
    }
}

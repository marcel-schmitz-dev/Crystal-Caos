class Golem extends MovableObject {
    constructor() {
        super().loadImage("assets/img/golem.png");

        this.x = 200 + Math.random() * 500;
    }

    werfen() {}
}

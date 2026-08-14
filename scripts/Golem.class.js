class Golem extends MovableObject {
    constructor() {
        super().loadImage("assets/img/golem-left.png");

        this.x = 300 + Math.random() * 500;
    }

    werfen() {}
}

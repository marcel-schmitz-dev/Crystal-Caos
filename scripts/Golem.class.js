class Golem extends MovableObject {
    constructor() {
        super().loadImage("assets/img/golem-left.png");

        this.x = 200 + Math.random() * 500;
    }

    werfen() {}
}

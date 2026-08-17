class Golem extends MovableObject {
    height = 60;
    width = 80;
    constructor() {
        super().loadImage("assets/img/monster/golem_left.png");

        this.x = 400 + Math.random() * 500;
        this.y = 530;
    }
}

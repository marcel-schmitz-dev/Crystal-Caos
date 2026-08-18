class Ghost extends MovableObject {
    height = 350;
    width = 300;
    constructor() {
        super().loadImage("assets/img/monster/Ghost.png");

        this.x = 2500;
        this.y = 250;
    }

    werfen() {}
}

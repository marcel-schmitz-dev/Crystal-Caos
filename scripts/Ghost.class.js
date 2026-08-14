class Ghost extends MovableObject {
    constructor() {
        super().loadImage("assets/img/Ghost.png");

        this.x = 200 + Math.random() * 500;
    }

    werfen() {}
}

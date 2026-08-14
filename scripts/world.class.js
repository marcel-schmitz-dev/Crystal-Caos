class World {
    character = new Character();
    enemies = [new Golem(), new Golem(), new Golem(), new Ghost()];

    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.draw();
    }

    draw() {
        this.ctx.drawImage(
            this.character.img,
            this.character.x,
            this.character.y,
            this.character.height,
            this.character.width,
        );
    }
}

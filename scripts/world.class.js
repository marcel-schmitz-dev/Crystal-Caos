class World {
    character = new Character();
    enemies = [new Golem(), new Golem(), new Golem(), new Ghost()];

    backgroundObjects = [new BackgroundObjekt("assets/img/Background.png", 0)];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.draw();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.backgroundObjects.forEach((bg) => {
            this.ctx.drawImage(bg.img, bg.x, bg.y, bg.width, bg.height);
        });

        this.ctx.drawImage(
            this.character.img,
            this.character.x,
            this.character.y,
            this.character.width,
            this.character.height,
        );

        this.enemies.forEach((enemy) => {
            this.ctx.drawImage(
                enemy.img,
                enemy.x,
                enemy.y,
                enemy.width,
                enemy.height,
            );
        });

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}

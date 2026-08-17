class World {
    character = new Character();
    enemies = [
        new Golem(),
        new Golem(),
        new Golem(),
        new Golem(),
        new Golem(),
        new Ghost(),
    ];

    backgroundObjects = [
        new BackgroundObjekt("assets/img/background/background.png", 0),
    ];

    clouds = [new cloud(), new cloud(), new cloud()];
    canvas;
    ctx;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.draw();

        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.backgroundObjects.forEach((bg) => {
            this.ctx.drawImage(bg.img, bg.x, bg.y, bg.width, bg.height);
        });

        this.clouds.forEach((cloud) => {
            this.ctx.drawImage(
                cloud.img,
                cloud.x,
                cloud.y,
                cloud.width,
                cloud.height,
            );
        });

        this.ctx.drawImage(
            this.character.img,
            this.character.x,
            this.character.y,
            this.character.width,
            this.character.height,
        );

        this.enemies.forEach((enemy) => {
            // Prüfen, ob das Bild geladen ist und existiert, bevor es gezeichnet wird
            if (
                enemy.img &&
                enemy.img.complete &&
                enemy.img.naturalWidth !== 0
            ) {
                this.ctx.drawImage(
                    enemy.img,
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height,
                );
            }
        });

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}

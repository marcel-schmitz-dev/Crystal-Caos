class World {
    character = new Character();

    portal = new Portal(1100, 380);

    enemies = [new Ghost()];

    backgroundObjects = [
        new BackgroundObjekt("assets/img/background/background1.png", 0),
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

        this.setGolemSpawner();
    }

    setGolemSpawner() {
        setInterval(() => {
            let golemCount = this.enemies.filter(
                (e) => e instanceof Golem,
            ).length;

            if (golemCount < 8) {
                let newGolem = new Golem();
                newGolem.x = this.portal.x + 20;
                newGolem.y = this.portal.y + 140;
                this.enemies.push(newGolem);
            }
        }, 5000);
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
            this.portal.img,
            this.portal.x,
            this.portal.y,
            this.portal.width,
            this.portal.height,
        );

        this.ctx.save();
        if (this.character.otherDirection) {
            this.ctx.translate(this.character.x + this.character.width, 0);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                this.character.img,
                0,
                this.character.y,
                this.character.width,
                this.character.height,
            );
        } else {
            this.ctx.drawImage(
                this.character.img,
                this.character.x,
                this.character.y,
                this.character.width,
                this.character.height,
            );
        }
        this.ctx.restore();

        // Gegner zeichnen
        this.enemies.forEach((enemy) => {
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

class World {
    character = new Character();
    level = level1;

    portal = level1.portal;
    enemies = level1.enemies;
    backgroundObjects = level1.backgroundObjacts;
    clouds = level1.clouds;

    canvas;
    ctx;
    camera_x = 0;

    constructor(canvas) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.portal = this.level.portal;
        this.enemies = this.level.enemies;
        this.backgroundObjects = this.level.backgroundObjacts;
        this.clouds = this.level.clouds;

        this.draw();
        this.character.world = this;

        this.level.setGolemSpawner();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.camera_x = -this.character.x + 100; 

        this.ctx.translate(this.camera_x, 0);

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

        this.level.portals.forEach((portal) => {
            this.ctx.drawImage(
                portal.img,
                portal.x,
                portal.y,
                portal.width,
                portal.height,
            );
        });

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

        this.ctx.translate(-this.camera_x, 0);

        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}

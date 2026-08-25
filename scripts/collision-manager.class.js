import { Golem } from "./Golem.class.js";
import { CrystalDrop } from "./crystal-dropp.class.js";
import { Ghost } from "./Ghost.class.js";

export class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    checkAllCollisions() {
        if (this.world.character.energy <= 0) return;

        this.checkCollisionsWithEnemies();
        this.checkCollisionsWithProjectiles();
        this.checkCollisionsWithDrops();
    }

    checkCollisionsWithEnemies() {
        this.world.enemies.forEach((enemy, index) => {
            if (enemy instanceof Golem) {
                let isJumpingOnGolem =
                    this.world.character.isColliding(enemy) &&
                    this.world.character.speedY < 0 &&
                    this.world.character.y + this.world.character.height - 30 <=
                        enemy.y + 20;

                if (isJumpingOnGolem) {
                    let drop = new CrystalDrop(enemy.x, enemy.y + 20);
                    this.world.crystalDrops.push(drop);

                    this.world.enemies.splice(index, 1);

                    this.world.character.speedY = 15;
                } else if (this.world.character.isColliding(enemy)) {
                    this.world.character.hit(1);
                    console.log(
                        "Character wurde von Golem seitlich getroffen!",
                    );
                }
            }
        });
    }

    checkCollisionsWithProjectiles() {
        this.world.throwableObjects.forEach((projectile, pIndex) => {
            if (projectile.isPlayerCore) {
                this.world.enemies.forEach((enemy, eIndex) => {
                    if (
                        enemy instanceof Ghost &&
                        projectile.isColliding(enemy)
                    ) {
                        console.log("Boss wurde mit Core getroffen!");
                        this.world.enemies.splice(eIndex, 1);
                        this.world.throwableObjects.splice(pIndex, 1);
                        return;
                    }
                });
            }

            if (projectile.isPlayerCore) return;

            let charBox = {
                x: this.world.character.x,
                y: this.world.character.y,
                width: this.world.character.width,
                height: this.world.character.height,
            };

            if (this.world.keyboard.DOWN) {
                charBox.y += 60;
                charBox.height = 90;
            }

            if (
                charBox.x + charBox.width > projectile.x &&
                charBox.y + charBox.height > projectile.y &&
                charBox.x < projectile.x + projectile.width &&
                charBox.y < projectile.y + projectile.height
            ) {
                this.world.character.hit(1);
                console.log("Character wurde vom Boss-Kristall getroffen!");
                this.world.throwableObjects.splice(pIndex, 1);
            }
        });
    }

    checkCollisionsWithDrops() {
        this.world.crystalDrops.forEach((drop, index) => {
            if (this.world.character.isColliding(drop)) {
                this.world.character.crystals++;
                console.log(
                    "Kristall eingesammelt! Anz.:",
                    this.world.character.crystals,
                );
                this.world.crystalDrops.splice(index, 1);
            }
        });
    }
}

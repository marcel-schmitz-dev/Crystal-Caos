import { Golem } from "./Golem.class.js";
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
            if (enemy instanceof Ghost) {
                if (enemy.isDead) return;

                let distanceToBoss = enemy.x - this.world.character.x;
                if (distanceToBoss < 900 && distanceToBoss > -200) {
                    enemy.isActivated = true;
                }

                if (this.world.character.isColliding(enemy)) {
                    this.world.character.hit(1);
                    this.world.audioHub.playPlayerHit();
                }
            }

            if (enemy instanceof Golem) {
                let isJumpingOnGolem =
                    this.world.character.isColliding(enemy) &&
                    this.world.character.speedY < 0 &&
                    this.world.character.y + this.world.character.height - 30 <=
                        enemy.y + 20;

                if (isJumpingOnGolem) {
                    let drop = enemy.createDrop();
                    this.world.crystalDrops.push(drop);

                    this.world.enemies.splice(index, 1);

                    this.world.character.speedY = 15;
                } else if (this.world.character.isColliding(enemy)) {
                    this.world.character.hit(1);
                    this.world.audioHub.playPlayerHit();
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
                        enemy.isActivated &&
                        !enemy.isDead &&
                        projectile.isColliding(enemy)
                    ) {
                        console.log("Boss wurde mit Core getroffen!");

                        enemy.hit(1);
                        this.world.audioHub.playBossHit();

                        this.world.throwableObjects.splice(pIndex, 1);

                        return;
                    }
                });
                return;
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
                this.world.audioHub.playPlayerHit();
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

        if (this.world.level && this.world.level.coins) {
            this.world.level.coins.forEach((coin, index) => {
                if (this.world.character.isColliding(coin)) {
                    this.world.character.coins =
                        (this.world.character.coins || 0) + 1;

                    if (this.world.character.coins > 5) {
                        this.world.character.coins = 5;
                    }

                    console.log(
                        "Coin eingesammelt! Anz.:",
                        this.world.character.coins,
                    );
                    this.world.level.coins.splice(index, 1);
                }
            });
        }
    }
}

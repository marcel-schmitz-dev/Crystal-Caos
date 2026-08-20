import { Golem } from "./Golem.class.js";
import { CrystalDrop } from "./crystal-dropp.class.js";

export class CollisionManager {
    constructor(world) {
        this.world = world;
    }

    // Alle Kollisionsprüfungen bündeln
    checkAllCollisions() {
        // Wenn der Charakter tot ist, keine Kollisionen mehr prüfen!
        if (this.world.character.energy <= 0) return;

        this.checkCollisionsWithEnemies();
        this.checkCollisionsWithProjectiles();
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

                    // Golem entfernen
                    this.world.enemies.splice(index, 1);

                    // Bounce-Sprung
                    this.world.character.speedY = 15;
                } else if (this.world.character.isColliding(enemy)) {
                    this.world.character.hit(1); // 1 Schaden durch Golem
                    console.log(
                        "Character wurde von Golem seitlich getroffen!",
                    );
                }
            }
        });
    }

    checkCollisionsWithProjectiles() {
        this.world.throwableObjects.forEach((projectile, index) => {
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
                this.world.character.hit(2); // 2 Schaden durch Boss-Projektil
                console.log("Character wurde von Kristall getroffen!");
                this.world.throwableObjects.splice(index, 1);
            }
        });
    }
}

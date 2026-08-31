import { Golem } from "./Golem.class.js";
import { Ghost } from "./Ghost.class.js";
import { Spider } from "./spider.class.js";

/**
 * Manages collision detections between the character, enemies, projectiles, and items.
 */
export class CollisionManager {
    /**
     * Creates a collision manager instance.
     * @param {World} world - Reference to the game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks all game collision types in a single frame.
     */
    checkAllCollisions() {
        if (this.world.character.energy <= 0) return;
        this.checkCollisionsWithEnemies();
        this.checkCollisionsWithProjectiles();
        this.checkCollisionsWithDrops();
    }

    /**
     * Evaluates collisions between character and active enemies.
     */
    checkCollisionsWithEnemies() {
        this.world.enemies.forEach((enemy, index) => {
            if (enemy instanceof Ghost) this.handleGhostCollision(enemy);
            if (enemy instanceof Golem) this.handleGolemCollision(enemy, index);
            if (enemy instanceof Spider)
                this.handleSpiderCollision(enemy, index);
        });
    }

    /**
     * Handles interactions and collisions with Ghost boss.
     * @param {Ghost} enemy - Ghost boss instance.
     */
    handleGhostCollision(enemy) {
        if (enemy.isDead) return;
        let distanceToBoss = enemy.x - this.world.character.x;
        if (distanceToBoss < 900 && distanceToBoss > -200)
            enemy.isActivated = true;
        if (this.world.character.isColliding(enemy)) {
            this.world.character.hit(1);
            this.world.audioHub.playPlayerHit();
        }
    }

    /**
     * Handles interactions and combat jumps on Golems.
     * @param {Golem} enemy - Golem instance.
     * @param {number} index - Index in enemies array.
     */
    handleGolemCollision(enemy, index) {
        let isJumpingOnGolem =
            this.world.character.isColliding(enemy) &&
            this.world.character.speedY < 0 &&
            this.world.character.y + this.world.character.height - 30 <=
                enemy.y + 20;

        if (isJumpingOnGolem) {
            this.world.crystalDrops.push(enemy.createDrop());
            this.world.enemies.splice(index, 1);
            this.world.character.speedY = 15;
        } else if (this.world.character.isColliding(enemy)) {
            this.world.character.hit(1);
            this.world.audioHub.playPlayerHit();
        }
    }

    /**
     * Handles interactions and combat jumps on Spiders.
     * @param {Spider} enemy - Spider instance.
     * @param {number} index - Index in enemies array.
     */
    handleSpiderCollision(enemy, index) {
        if (enemy.isDead) return;
        let distanceToSpider = enemy.x - this.world.character.x;
        if (distanceToSpider < 700 && distanceToSpider > -200)
            enemy.isActivated = true;
        if (!enemy.hasLanded) return;

        let isJumpingOnSpider =
            this.world.character.isColliding(enemy) &&
            this.world.character.speedY < 0 &&
            this.world.character.y + this.world.character.height - 30 <=
                enemy.y + 20;

        if (isJumpingOnSpider) {
            enemy.isDead = true;
            this.world.crystalDrops.push(enemy.createDrop());
            this.world.enemies.splice(index, 1);
            this.world.character.speedY = 20;
        } else if (this.world.character.isColliding(enemy)) {
            this.world.character.hit(1);
            this.world.audioHub.playPlayerHit();
        }
    }

    /**
     * Checks projectile hits on targets and player.
     */
    checkCollisionsWithProjectiles() {
        this.world.throwableObjects.forEach((projectile, pIndex) => {
            if (projectile.isPlayerCore) {
                this.checkPlayerCoreHits(projectile, pIndex);
            } else {
                this.checkBossProjectileHits(projectile, pIndex);
            }
        });
    }

    /**
     * Checks if player core hits the boss.
     * @param {CrystalProjectile} projectile - Projectile.
     * @param {number} pIndex - Projectile array index.
     */
    checkPlayerCoreHits(projectile, pIndex) {
        this.world.enemies.forEach((enemy) => {
            if (
                enemy instanceof Ghost &&
                enemy.isActivated &&
                !enemy.isDead &&
                projectile.isColliding(enemy)
            ) {
                enemy.hit(1);
                this.world.audioHub.playBossHit();
                this.world.throwableObjects.splice(pIndex, 1);
            }
        });
    }

    /**
     * Checks if boss projectile hits the character.
     * @param {CrystalProjectile} projectile - Projectile.
     * @param {number} pIndex - Projectile array index.
     */
    checkBossProjectileHits(projectile, pIndex) {
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
        if (this.isBoxColliding(charBox, projectile)) {
            this.world.character.hit(1);
            this.world.audioHub.playPlayerHit();
            this.world.throwableObjects.splice(pIndex, 1);
        }
    }

    /**
     * Helper to check basic bounding box collision.
     * @param {Object} box1 - First box.
     * @param {Object} box2 - Second box.
     * @returns {boolean} True if colliding.
     */
    isBoxColliding(box1, box2) {
        return (
            box1.x + box1.width > box2.x &&
            box1.y + box1.height > box2.y &&
            box1.x < box2.x + box2.width &&
            box1.y < box2.y + box2.height
        );
    }

    /**
     * Checks collections of drops and coins.
     */
    checkCollisionsWithDrops() {
        this.world.crystalDrops.forEach((drop, index) => {
            if (this.world.character.isColliding(drop)) {
                this.world.character.crystals++;
                this.world.crystalDrops.splice(index, 1);
            }
        });
        if (this.world.level?.coins) {
            this.world.level.coins.forEach((coin, index) => {
                if (this.world.character.isColliding(coin)) {
                    this.world.character.coins = Math.min(
                        5,
                        (this.world.character.coins || 0) + 1,
                    );
                    this.world.level.coins.splice(index, 1);
                }
            });
        }
    }
}

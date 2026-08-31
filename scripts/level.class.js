import { ImageHub } from "./image.hub.js";
import { Golem } from "./Golem.class.js";

/**
 * Represents a game level containing enemies, portals, clouds, background objects, and coins.
 */
export class Level {
    enemies;
    portals;
    clouds;
    backgroundObjacts;
    coins;
    level_end_x = 4500;

    /**
     * Creates a level instance.
     * @param {Array} enemies - Array of enemy instances.
     * @param {Array} portals - Array of portal instances.
     * @param {Array} clouds - Array of cloud instances.
     * @param {Array} backgroundObjacts - Array of background object instances.
     * @param {Array} [coins=[]] - Array of coin instances.
     */
    constructor(enemies, portals, clouds, backgroundObjacts, coins = []) {
        this.enemies = enemies;
        this.portals = portals;
        this.clouds = clouds;
        this.backgroundObjacts = backgroundObjacts;
        this.coins = coins;
    }

    /**
     * Initializes the golem spawner interval.
     */
    setGolemSpawner() {
        this.spawnGolem();

        setInterval(() => {
            this.spawnGolem();
        }, 8000);
    }

    /**
     * Spawns new golems at portal locations if the limit is not reached.
     */
    spawnGolem() {
        this.portals.forEach((portal) => {
            let golemCount = this.enemies.filter(
                (e) => e instanceof Golem,
            ).length;

            if (golemCount < 10) {
                let newGolem = new Golem();
                newGolem.x = portal.x + 20;
                newGolem.y = portal.y + 140;
                this.enemies.push(newGolem);
            }
        });
    }
}

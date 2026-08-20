import { ImageHub } from "./image.hub.js";
import { Golem } from "./Golem.class.js";

export class Level {
    enemies;
    portals;
    clouds;
    backgroundObjacts;
    level_end_x = 2900;

    constructor(enemies, portals, clouds, backgroundObjacts) {
        this.enemies = enemies;
        this.portals = portals;
        this.clouds = clouds;
        this.backgroundObjacts = backgroundObjacts;
    }

    setGolemSpawner() {
        this.spawnGolem();

        setInterval(() => {
            this.spawnGolem();
        }, 8000);
    }

    spawnGolem() {
        this.portals.forEach((portal) => {
            let golemCount = this.enemies.filter(
                (e) => e instanceof Golem,
            ).length;

            let newGolem = new Golem();

            if (golemCount < 10) {
                let newGolem = new Golem();
                newGolem.x = portal.x + 20;
                newGolem.y = portal.y + 140;
                this.enemies.push(newGolem);
            }
        });
    }
}

class Level {
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
        setInterval(() => {
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
        }, 5000);
    }
}

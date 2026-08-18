class Level {
    enemies;
    portal;
    clouds;
    backgroundObjacts;

    constructor(enemies, portal, clouds, backgroundObjacts) { 
        this.enemies = enemies;
        this.portal = portal;
        this.clouds = clouds;
        this.backgroundObjacts = backgroundObjacts;
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
}

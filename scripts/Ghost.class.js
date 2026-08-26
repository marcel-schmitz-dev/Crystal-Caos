import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

export class Ghost extends MovableObject {
    height = 450;
    width = 400;
    energy = 5;
    isActivated = false;
    isHurt = false; // Neu: Flag, um zu prüfen, ob er gerade getroffen wurde

    IMAGES_WALKING = [
        "./assets/img/monster/ghost_boss1.png",
        "./assets/img/monster/ghost_boss2.png",
        "./assets/img/monster/ghost_boss3.png",
        "./assets/img/monster/ghost_boss.png",
    ];

    attackToggle = false;
    world;
    lastImageIndex = -1;
    intervalId = null;

    constructor(x, y) {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage("./assets/img/monster/ghost_boss.png");

        this.x = 3300;
        this.y = 180;

        this.animate();
    }

    animate() {
        this.intervalId = setInterval(() => {
            if (!this.world || !this.world.gameStarted) return;

            // Wenn er gerade getroffen wurde, überspringen wir die Laufanimation kurz
            if (!this.isHurt) {
                this.playAnimation(this.IMAGES_WALKING);
                let currentIndex = this.currentImage % this.IMAGES_WALKING.length;

                if (currentIndex === 2 && this.lastImageIndex !== 2) {
                    this.throwCrystal();
                }
                this.lastImageIndex = currentIndex;
            }
        }, 600);
    }

    throwCrystal() {
        if (!this.world) return;

        this.attackToggle = !this.attackToggle;

        let crystalY = this.attackToggle ? this.y + 250 : this.y + 340;
        let crystalX = this.x - 40;

        let crystal = new CrystalProjectile(crystalX, crystalY, this.world, -1);
        crystal.loadImage("./assets/img/waffen/crystal_geschoss.png");

        this.world.throwableObjects.push(crystal);
    }

    hit(damage = 1) {
        if (!this.isActivated) return;

        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.stopAnimation();
        } else {
            this.playHurtAnimation(); // Neu: Aktiviert den Treffer-Effekt
        }
        console.log("Boss HP:", this.energy);
    }

    // Neu: Methode für die Schadensreaktion
    playHurtAnimation() {
        this.isHurt = true;
        this.loadImage(ImageHub.BOSS.HURT); // Lädt das neue dmg_reaction_boss.png

        // Nach 300ms wechselt er wieder zurück in den normalen Modus
        setTimeout(() => {
            this.isHurt = false;
        }, 300);
    }

    stopAnimation() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}
import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class StatusBar extends DrawableObject {
    percentage = 100;
    type = "hp"; // "hp", "boss_hp", "coins"

    constructor(type, x, y, width = 200, height = 50) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setPercentage(5); // Startwert (z.B. 5 Leben/Stufen)
    }

    /**
     * Updates the status bar image based on given value.
     * @param {number} currentVal - Current value (e.g. 0-5).
     */
    setPercentage(currentVal) {
        let clampedVal = Math.max(0, Math.min(currentVal, 5));
        let path = this.resolveImageIndex(clampedVal);
        this.loadImage(path);
    }

    /**
     * Selects the correct image path from ImageHub based on bar type.
     */
    resolveImageIndex(val) {
        if (this.type === "hp") {
            return ImageHub.CHARACTER.HUD.HP_BARS[val];
        } else if (this.type === "boss_hp") {
            return ImageHub.BOSS_HP_BARS[val];
        } else if (this.type === "coins") {
            // Beispiel für Coin-Bar (kannst du im ImageHub anlegen oder anpassen)
            return ImageHub.CHARACTER.HUD.HP_BARS[val]; // Fallback, bis Coin-Bilder da sind
        }
    }
}
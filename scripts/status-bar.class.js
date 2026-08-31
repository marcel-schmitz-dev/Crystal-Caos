import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Represents on-screen UI status bars (HP, coins, cores, boss health).
 */
export class StatusBar extends DrawableObject {
    percentage = 5;
    type = "hp";

    /**
     * Creates a status bar instance.
     * @param {string} type - Type descriptor ('hp', 'boss_hp', 'cores', 'coins').
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} [width=200] - Width.
     * @param {number} [height=50] - Height.
     */
    constructor(type, x, y, width = 200, height = 50) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setPercentage(5);
    }

    /**
     * Sets status bar percentage value and resolves corresponding sprite image.
     * @param {number} currentVal - Current value quantity.
     */
    setPercentage(currentVal) {
        let clampedVal = Math.max(0, Math.min(currentVal, 5));
        this.percentage = clampedVal;
        let path = this.resolveImageIndex(clampedVal);
        this.loadImage(path);
    }

    /**
     * Resolves the correct image asset path depending on bar type and value.
     * @param {number} val - Clamped value index.
     * @returns {string} Path to image asset.
     */
    resolveImageIndex(val) {
        if (this.type === "hp") return ImageHub.CHARACTER.HUD.HP_BARS[val];
        if (this.type === "boss_hp") return ImageHub.BOSS.BOSS_HP_BARS[val];
        if (this.type === "cores") return ImageHub.HUD.CORE_BARS[val];
        if (this.type === "coins") return ImageHub.HUD.COIN_BARS[val];
    }
}

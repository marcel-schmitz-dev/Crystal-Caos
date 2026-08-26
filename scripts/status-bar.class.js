import { DrawableObject } from "./drawable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class StatusBar extends DrawableObject {
    percentage = 5;
    type = "hp";

    constructor(type, x, y, width = 200, height = 50) {
        super();
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.setPercentage(5);
    }

    setPercentage(currentVal) {
        let clampedVal = Math.max(0, Math.min(currentVal, 5));
        this.percentage = clampedVal;
        let path = this.resolveImageIndex(clampedVal);
        this.loadImage(path);
    }

    resolveImageIndex(val) {
        if (this.type === "hp") {
            return ImageHub.CHARACTER.HUD.HP_BARS[val];
        } else if (this.type === "boss_hp") {
            return ImageHub.BOSS_HP_BARS[val];
        } else if (this.type === "cores") {
            return ImageHub.CORE_BARS[val];
        } else if (this.type === "coins") {
            return ImageHub.COIN_BARS[val];
        }
    }
}

import { ImageHub } from "./image.hub.js";
import { MovableObject } from "./movable-object.class.js";

export class CrystalDrop extends MovableObject {
    width = 80;
    height = 80;

    constructor(x, y) {
        super().loadImage("./assets/img/drops/Core_amBoden.png");
        this.x = x;
        this.y = y;
    }
}

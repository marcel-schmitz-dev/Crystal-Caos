import { ImageHub } from './image.hub.js';
import { MovableObject } from './movable-object.class.js';

export class CrystalDrop extends MovableObject {
    width = 60;
    height = 60;

    constructor(x, y) {
        super().loadImage("assets/img/drops/crystal_drop.png");
        this.x = x;
        this.y = y;
    }
}
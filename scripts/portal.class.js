import { ImageHub } from './image.hub.js';
import { MovableObject } from './movable-object.class.js';

export class Portal extends MovableObject {
    height = 200;
    width = 150;

    constructor(x, y) {
        super().loadImage("assets/img/waffen/portal.png");
        this.x = x;
        this.y = y;
    }
}

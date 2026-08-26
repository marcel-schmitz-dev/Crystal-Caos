import { MovableObject } from "./movable-object.class.js";
import { ImageHub } from "./image.hub.js";

export class Coin extends MovableObject {
    width = 40;
    height = 40;

    constructor(x, y) {
        super().loadImage(ImageHub.COINS[0]);
        this.loadImages(ImageHub.COINS);
        this.x = x;
        this.y = y;
        
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(ImageHub.COINS);
        }, 150); 
    }
}
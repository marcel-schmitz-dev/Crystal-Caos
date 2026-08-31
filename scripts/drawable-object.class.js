/**
 * Base class for all objects rendered on the canvas context.
 */
export class DrawableObject {
    x = 120;
    y = 420;
    height = 150;
    width = 150;
    img;
    imgCache = {};
    currentImage = 0;

    /**
     * Draws the object onto the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth !== 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads a single image into cache and sets current image.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        if (this.imgCache[path]) {
            this.img = this.imgCache[path];
        } else {
            this.img = new Image();
            this.img.src = path;
            this.imgCache[path] = this.img;
        }
    }

    /**
     * Loads an array of image paths into the cache for animations.
     * @param {string[]} arr - Array of image file paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }
}

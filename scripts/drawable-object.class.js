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
     * @param {CanvasRenderingContext2D} ctx - The canvas context.
     */
    draw(ctx) {
        if (this.img && this.img.complete && this.img.naturalWidth !== 0) {
            ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    }

    /**
     * Loads a single image (with cache check).
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
     * Loads a cache of images for animations.
     * @param {string[]} arr - Array of image paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imgCache[path] = img;
        });
    }
}
class BackgroundObjekt extends MovableObject {
    width = 1280;
    height = 720;

    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 0;
    }
}

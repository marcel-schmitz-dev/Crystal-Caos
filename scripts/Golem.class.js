// class Golem extends MovableObject {
//     height = 60;
//     width = 80;

//     constructor() {
//         super().loadImage("assets/img/monster/golem1.png");

//         this.x = 400 + Math.random() * 500;
//         this.y = 530;
//     }
// }

class Golem extends MovableObject {
    height = 80;
    width = 80;

    IMAGES_WALKING = [
        "assets/img/monster/golem1.png",
        "assets/img/monster/golem2.png",
        "assets/img/monster/golem3.png",
        "assets/img/monster/golem4.png",
        "assets/img/monster/golem5.png",
        "assets/img/monster/golem6.png",
        "assets/img/monster/golem7.png",
        "assets/img/monster/golem8.png",
    ];

    currentImage = 0;

    constructor() {
        super();
        this.loadImages(this.IMAGES_WALKING);
        this.loadImage("assets/img/monster/golem1.png");

        this.x = 400 + Math.random() * 500;
        this.y = 530;

        this.animate();
    }

    animate() {
        // 1. Bewegung nach links (auf den Spieler zu)
        setInterval(() => {
            this.x -= 0.8;
        }, 1000 / 60);

        // 2. Animations-Loop für die Golem-Schritte
        setInterval(() => {
            let path = this.IMAGES_WALKING[this.currentImage];
            this.loadImage(path);
            this.currentImage =
                (this.currentImage + 1) % this.IMAGES_WALKING.length;
        }, 1000 / 8);
    }
}

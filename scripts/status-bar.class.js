import { ImageHub } from "./image.hub.js";

export class StatusBar {
    x = 20;
    y = 20;
    width = 200;
    height = 40;

    percentage = 100; // Startet bei 100% (10 HP)

    IMAGES = [
        "assets/img/HP/hp_container_leer.png", // 0% (oder verschiedene Zustände)
        // Alternativ: Wir laden direkt das volle und leere Bild
    ];

    constructor() {
        this.loadImage("assets/img/HP/hp_container_voll.png");
    }

    // Setzt den Prozentwert basierend auf den HP des Characters (0 bis 100)
    setPercentage(percentage) {
        this.percentage = percentage; // 0 - 100
        let path = this.resolveImageIndex();
        this.loadImage(path);
    }

    // Hier kannst du steuern, ab welchem HP-Wert welches Bild angezeigt wird
    resolveImageIndex() {
        if (this.percentage === 100) {
            return "assets/img/HP/hp_container_voll.png";
        } else {
            return "assets/img/HP/hp_container_leer.png"; // Oder eine Logik für Zwischenschritte
        }
    }

    // Hilfsfunktion zum Laden (falls nicht von MovableObject geerbt)
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
}

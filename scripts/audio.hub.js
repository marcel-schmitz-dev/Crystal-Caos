export class AudioHub {
    constructor() {
        this.gameOverSound = new Audio("./assets/audio/character_death.mp3");
        this.gameOverSound.loop = true;
        this.gameOverSound.volume = 0.4;

        this.backgroundMusic = new Audio(
            "./assets/audio/background_sound5.wav",
        );
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.5; // 30% Lautstärke, damit sie angenehm im Hintergrund läuft
    }

    playGameOver() {
        if (this.gameOverSound.paused) {
            this.gameOverSound
                .play()
                .catch((error) => console.log("Audio error:", error));
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.play().catch((error) => {
                console.log(
                    "Hintergrundmusik konnte wegen Browser-Richtlinien nicht automatisch abgespielt werden:",
                    error,
                );
            });
        }
    }

    stopAll() {
        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;

        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }
}

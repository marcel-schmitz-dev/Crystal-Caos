export class AudioHub {
    constructor() {
        this.isMuted = false;
        this.masterVolume = 0.3;

        this.gameOverSound = new Audio("./assets/audio/character_death.mp3");
        this.gameOverSound.loop = true;

        this.backgroundMusic = new Audio(
            "./assets/audio/background_sound5.wav",
        );
        this.backgroundMusic.loop = true;
        this.backgroundMusic.load();

        this.ambientMusic = new Audio("./assets/audio/boss_room_ambient.wav");
        this.ambientMusic.loop = true;

        this.bossMusic = new Audio("./assets/audio/boss_fight_.wav");
        this.bossMusic.loop = true;

        this.jumpSound = new Audio("./assets/audio/sprung.wav");
        this.crawlingSound = new Audio("./assets/audio/krabbeln.wav");
        this.crawlingSound.loop = true;

        this.playerHitSound = new Audio("./assets/audio/spieler_getroffen.wav");
        this.bossHitSound = new Audio("./assets/audio/boss_getroffen.wav");

        this.currentMusicTrack = null;

        this.playerThrowSound = new Audio(
            "./assets/audio/character_core_abfeuern.wav",
        );
        this.bossShootSound = new Audio(
            "./assets/audio/boss_crystal_abfeuern.wav",
        );
        this.golemWalkSound = new Audio("./assets/audio/golem_walk.wav");
        this.golemWalkSound.loop = true;

        this.winSound = new Audio("./assets/audio/you_win.wav");

        this.characterWalkSound = new Audio(
            "./assets/audio/character_walk.wav",
        );
        this.characterWalkSound.loop = true;

        this.updateAllVolumes();
    }

    setVolume(volume) {
        this.masterVolume = volume;
        this.updateAllVolumes();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateAllVolumes();
        return this.isMuted;
    }

    updateAllVolumes() {
        const currentVol = this.isMuted ? 0 : this.masterVolume;
        const isMuteActive = this.isMuted;

        const audioObjects = [
            this.gameOverSound,
            this.backgroundMusic,
            this.ambientMusic,
            this.bossMusic,
            this.jumpSound,
            this.crawlingSound,
            this.playerHitSound,
            this.bossHitSound,
            this.playerThrowSound,
            this.bossShootSound,
            this.golemWalkSound,
            this.winSound,
            this.characterWalkSound,
        ];

        audioObjects.forEach((audio) => {
            if (audio) {
                audio.volume = currentVol;
                audio.muted = isMuteActive;
            }
        });

        if (this.currentMusicTrack) {
            this.currentMusicTrack.volume = currentVol;
            this.currentMusicTrack.muted = isMuteActive;
        }
    }

    playWin() {
        this.winSound.currentTime = 0;
        this.winSound.volume = this.isMuted ? 0 : this.masterVolume;
        this.winSound.play().catch((e) => console.log(e));
    }

    playCharacterWalk(isWalking) {
        if (isWalking) {
            if (this.characterWalkSound.paused) {
                this.characterWalkSound.volume = this.isMuted
                    ? 0
                    : this.masterVolume;
                this.characterWalkSound.play().catch((e) => console.log(e));
            } else {
                this.characterWalkSound.volume = this.isMuted
                    ? 0
                    : this.masterVolume;
            }
        } else {
            this.characterWalkSound.pause();
            this.characterWalkSound.currentTime = 0;
        }
    }

    playPlayerThrow() {
        this.playerThrowSound.currentTime = 0;
        this.playerThrowSound.volume = this.isMuted ? 0 : this.masterVolume;
        this.playerThrowSound.play().catch((e) => console.log(e));
    }

    playBossShoot() {
        this.bossShootSound.currentTime = 0;
        this.bossShootSound.volume = this.isMuted ? 0 : this.masterVolume;
        this.bossShootSound.play().catch((e) => console.log(e));
    }

    playGolemWalk(isMoving) {
        if (isMoving) {
            if (this.golemWalkSound.paused) {
                this.golemWalkSound.volume = this.isMuted
                    ? 0
                    : this.masterVolume;
                this.golemWalkSound.play().catch((e) => console.log(e));
            } else {
                this.golemWalkSound.volume = this.isMuted
                    ? 0
                    : this.masterVolume;
            }
        } else {
            this.golemWalkSound.pause();
            this.golemWalkSound.currentTime = 0;
        }
    }

    playJump() {
        this.jumpSound.currentTime = 0;
        this.jumpSound.volume = this.isMuted ? 0 : this.masterVolume;
        this.jumpSound.play().catch((e) => console.log(e));
    }

    playCrawling(isCrawling) {
        if (isCrawling) {
            if (this.crawlingSound.paused) {
                this.crawlingSound.volume = this.isMuted
                    ? 0
                    : this.masterVolume;
                this.crawlingSound.play().catch((e) => console.log(e));
            } else {
                this.crawlingSound.volume = this.isMuted
                    ? 0
                    : this.masterVolume;
            }
        } else {
            this.crawlingSound.pause();
            this.crawlingSound.currentTime = 0;
        }
    }

    playPlayerHit() {
        this.playerHitSound.currentTime = 0;
        this.playerHitSound.volume = this.isMuted ? 0 : this.masterVolume;
        this.playerHitSound.play().catch((e) => console.log(e));
    }

    playBossHit() {
        this.bossHitSound.currentTime = 0;
        this.bossHitSound.volume = this.isMuted ? 0 : this.masterVolume;
        this.bossHitSound.play().catch((e) => console.log(e));
    }

    playGameOver() {
        if (this.gameOverSound.paused) {
            this.stopAllBackgroundMusic();
            this.gameOverSound.volume = this.isMuted ? 0 : this.masterVolume;
            this.gameOverSound
                .play()
                .catch((error) => console.log("Audio error:", error));
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.volume = this.isMuted ? 0 : this.masterVolume;
            this.backgroundMusic.play().catch((e) => console.log(e));
        }
    }

    checkMusicZone(characterX) {
        let targetTrack = this.backgroundMusic;

        if (characterX >= 3840) {
            targetTrack = this.bossMusic;
        } else if (characterX >= 2560) {
            targetTrack = this.ambientMusic;
        }

        if (this.currentMusicTrack !== targetTrack) {
            this.stopAllBackgroundMusic();
            this.currentMusicTrack = targetTrack;
            this.currentMusicTrack.volume = this.isMuted
                ? 0
                : this.masterVolume;
            this.currentMusicTrack.play().catch((error) => {
                console.log("Audio play blocked by browser policies:", error);
            });
        } else {
            this.currentMusicTrack.volume = this.isMuted
                ? 0
                : this.masterVolume;
        }
    }

    stopAllBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;

        this.ambientMusic.pause();
        this.ambientMusic.currentTime = 0;

        this.bossMusic.pause();
        this.bossMusic.currentTime = 0;
    }

    stopAll() {
        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;
        this.stopAllBackgroundMusic();
    }
}

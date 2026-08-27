export class AudioHub {
    constructor() {
        this.gameOverSound = new Audio("./assets/audio/character_death.mp3");
        this.gameOverSound.loop = true;
        this.gameOverSound.volume = 0.4;

        this.backgroundMusic = new Audio("./assets/audio/background_sound5.wav");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.4;
        this.backgroundMusic.load();
        
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.4;

        this.ambientMusic = new Audio("./assets/audio/boss_room_ambient.wav");
        this.ambientMusic.loop = true;
        this.ambientMusic.volume = 0.4;

        this.bossMusic = new Audio("./assets/audio/boss_fight_.wav");
        this.bossMusic.loop = true;
        this.bossMusic.volume = 0.4;

        this.jumpSound = new Audio("./assets/audio/sprung.wav");
        this.jumpSound.volume = 0.4;

        this.crawlingSound = new Audio("./assets/audio/krabbeln.wav");
        this.crawlingSound.loop = true;
        this.crawlingSound.volume = 0.4;

        this.playerHitSound = new Audio("./assets/audio/spieler_getroffen.wav");
        this.playerHitSound.volume = 0.4;

        this.bossHitSound = new Audio("./assets/audio/boss_getroffen.wav");
        this.bossHitSound.volume = 0.4;

        this.currentMusicTrack = null;

        this.playerThrowSound = new Audio(
            "./assets/audio/character_core_abfeuern.wav",
        );
        this.playerThrowSound.volume = 0.3;

        this.bossShootSound = new Audio(
            "./assets/audio/boss_crystal_abfeuern.wav",
        );
        this.bossShootSound.volume = 0.3;

        this.golemWalkSound = new Audio("./assets/audio/golem_walk.wav");
        this.golemWalkSound.loop = true;
        this.golemWalkSound.volume = 0.3;

        this.winSound = new Audio("./assets/audio/you_win.wav");
        this.winSound.volume = 0.5;

        this.characterWalkSound = new Audio("./assets/audio/character_walk.wav"); 
        this.characterWalkSound.loop = true;
        this.characterWalkSound.volume = 0.3;
    }
    
    playWin() {
        this.winSound.currentTime = 0;
        this.winSound.play().catch(e => console.log(e));
    }

    playCharacterWalk(isWalking) {
        if (isWalking) {
            if (this.characterWalkSound.paused) {
                this.characterWalkSound.play().catch(e => console.log(e));
            }
        } else {
            this.characterWalkSound.pause();
            this.characterWalkSound.currentTime = 0;
        }
    }

    playPlayerThrow() {
        this.playerThrowSound.currentTime = 0;
        this.playerThrowSound.play().catch((e) => console.log(e));
    }

    playBossShoot() {
        this.bossShootSound.currentTime = 0;
        this.bossShootSound.play().catch((e) => console.log(e));
    }

    playGolemWalk(isMoving) {
        if (isMoving) {
            if (this.golemWalkSound.paused) {
                this.golemWalkSound.play().catch((e) => console.log(e));
            }
        } else {
            this.golemWalkSound.pause();
            this.golemWalkSound.currentTime = 0;
        }
    }

    playJump() {
        this.jumpSound.currentTime = 0;
        this.jumpSound.play().catch((e) => console.log(e));
    }

    playCrawling(isCrawling) {
        if (isCrawling) {
            if (this.crawlingSound.paused) {
                this.crawlingSound.play().catch((e) => console.log(e));
            }
        } else {
            this.crawlingSound.pause();
            this.crawlingSound.currentTime = 0;
        }
    }

    playPlayerHit() {
        this.playerHitSound.currentTime = 0;
        this.playerHitSound.play().catch((e) => console.log(e));
    }

    playBossHit() {
        this.bossHitSound.currentTime = 0;
        this.bossHitSound.play().catch((e) => console.log(e));
    }

    playGameOver() {
        if (this.gameOverSound.paused) {
            this.stopAllBackgroundMusic();
            this.gameOverSound
                .play()
                .catch((error) => console.log("Audio error:", error));
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
            this.currentMusicTrack.play().catch((error) => {
                console.log("Audio play blocked by browser policies:", error);
            });
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

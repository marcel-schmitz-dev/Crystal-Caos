/**
 * Manages all game audio tracks, sound effects, volume levels, and music zones.
 */
export class AudioHub {
    /**
     * Initializes the audio hub with all sound effects and background tracks.
     */
    constructor() {
        this.isMuted = localStorage.getItem("isMuted") === "true";
        this.masterVolume = 0.1;
        this.currentMusicTrack = null;
        this.initAudioElements();
        this.updateAllVolumes();
    }

    /**
     * Instantiates all audio objects used in the game.
     */
    initAudioElements() {
        this.gameOverSound = this.createAudio(
            "./assets/audio/character_death.mp3",
            true,
        );
        this.backgroundMusic = this.createAudio(
            "./assets/audio/background_sound5.mp3",
            true,
            true,
        );
        this.ambientMusic = this.createAudio(
            "./assets/audio/boss_room_ambient.mp3",
            true,
        );
        this.bossMusic = this.createAudio(
            "./assets/audio/boss_fight_.mp3",
            true,
        );
        this.crawlingSound = this.createAudio(
            "./assets/audio/krabbeln.wav",
            true,
        );
        this.golemWalkSound = this.createAudio(
            "./assets/audio/golem_walk.wav",
            true,
        );
        this.characterWalkSound = this.createAudio(
            "./assets/audio/character_walk.mp3",
            true,
        );

        this.jumpSound = this.createAudio("./assets/audio/sprung.wav");
        this.playerHitSound = this.createAudio(
            "./assets/audio/spieler_getroffen.wav",
        );
        this.bossHitSound = this.createAudio(
            "./assets/audio/boss_getroffen.wav",
        );
        this.playerThrowSound = this.createAudio(
            "./assets/audio/character_core_abfeuern.wav",
        );
        this.bossShootSound = this.createAudio(
            "./assets/audio/boss_crystal_abfeuern.wav",
        );
        this.winSound = this.createAudio("./assets/audio/you_win.mp3");
    }

    /**
     * Helper to create and configure an audio element.
     * @param {string} path - Path to the audio file.
     * @param {boolean} [isLoop=false] - Whether the audio should loop.
     * @param {boolean} [shouldLoad=false] - Whether to call load explicitly.
     * @returns {HTMLAudioElement} The configured audio element.
     */
    createAudio(path, isLoop = false, shouldLoad = false) {
        let audio = new Audio(path);
        audio.loop = isLoop;
        if (shouldLoad) audio.load();
        return audio;
    }

    /**
     * Sets the master volume level.
     * @param {number} value - Volume value (0-100 from slider or 0-1 direct).
     */
    setVolume(value) {
        if (value > 1) {
            let linear = value / 100;
            this.masterVolume = linear * linear;
        } else {
            this.masterVolume = value;
        }
        this.updateAllVolumes();
    }

    /**
     * Toggles the mute state of all audio and saves it to local storage.
     * @returns {boolean} The new mute state.
     */
    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem("isMuted", this.isMuted);
        this.updateAllVolumes();
        return this.isMuted;
    }

    /**
     * Updates volume and mute properties for all audio instances.
     */
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

        audioObjects.forEach((audio) =>
            this.applyVolumeToAudio(audio, currentVol, isMuteActive),
        );
        if (this.currentMusicTrack) {
            this.applyVolumeToAudio(
                this.currentMusicTrack,
                currentVol,
                isMuteActive,
            );
        }
    }

    /**
     * Applies volume and mute settings to a single audio element.
     * @param {HTMLAudioElement} audio - The audio element.
     * @param {number} volume - Target volume.
     * @param {boolean} isMuted - Target mute state.
     */
    applyVolumeToAudio(audio, volume, isMuted) {
        if (audio) {
            audio.volume = volume;
            audio.muted = isMuted;
        }
    }

    /**
     * Plays a specific sound effect safely, catching playback block errors.
     * @param {HTMLAudioElement} audio - The sound to play.
     */
    playSound(audio) {
        audio.currentTime = 0;
        audio.volume = this.isMuted ? 0 : this.masterVolume;
        audio.play().catch(() => {});
    }

    playWin() {
        this.playSound(this.winSound);
    }
    playJump() {
        this.playSound(this.jumpSound);
    }
    playPlayerThrow() {
        this.playSound(this.playerThrowSound);
    }
    playBossShoot() {
        this.playSound(this.bossShootSound);
    }
    playPlayerHit() {
        this.playSound(this.playerHitSound);
    }
    playBossHit() {
        this.playSound(this.bossHitSound);
    }

    /**
     * Manages looping movement sound playback (e.g. walking or crawling).
     * @param {HTMLAudioElement} audio - The loop audio element.
     * @param {boolean} isActive - Whether movement is active.
     */
    handleLoopingSound(audio, isActive) {
        if (isActive) {
            if (audio.paused) {
                audio.volume = this.isMuted ? 0 : this.masterVolume;
                audio.play().catch(() => {});
            } else {
                audio.volume = this.isMuted ? 0 : this.masterVolume;
            }
        } else {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    playCharacterWalk(isWalking) {
        this.handleLoopingSound(this.characterWalkSound, isWalking);
    }
    playGolemWalk(isMoving) {
        this.handleLoopingSound(this.golemWalkSound, isMoving);
    }
    playCrawling(isCrawling) {
        this.handleLoopingSound(this.crawlingSound, isCrawling);
    }

    /**
     * Plays the game over sound sequence.
     */
    playGameOver() {
        if (this.gameOverSound.paused) {
            this.stopAllBackgroundMusic();
            this.gameOverSound.volume = this.isMuted ? 0 : this.masterVolume;
            this.gameOverSound.play().catch(() => {});
        }
    }

    /**
     * Plays the default background music track.
     */
    playBackgroundMusic() {
        if (this.backgroundMusic.paused) {
            this.backgroundMusic.volume = this.isMuted ? 0 : this.masterVolume;
            this.backgroundMusic.play().catch(() => {});
        }
    }

    /**
     * Changes background tracks depending on the character's map position.
     * @param {number} characterX - Current X coordinate of the character.
     */
    checkMusicZone(characterX) {
        let targetTrack = this.backgroundMusic;
        if (characterX >= 3840) targetTrack = this.bossMusic;
        else if (characterX >= 2560) targetTrack = this.ambientMusic;

        if (this.currentMusicTrack !== targetTrack) {
            this.switchMusicTrack(targetTrack);
        } else if (this.currentMusicTrack) {
            this.currentMusicTrack.volume = this.isMuted
                ? 0
                : this.masterVolume;
        }
    }

    /**
     * Switches the active background track.
     * @param {HTMLAudioElement} targetTrack - The track to switch to.
     */
    switchMusicTrack(targetTrack) {
        this.stopAllBackgroundMusic();
        this.currentMusicTrack = targetTrack;
        this.currentMusicTrack.volume = this.isMuted ? 0 : this.masterVolume;
        this.currentMusicTrack.play().catch(() => {});
    }

    /**
     * Pauses and resets all background music tracks.
     */
    stopAllBackgroundMusic() {
        [this.backgroundMusic, this.ambientMusic, this.bossMusic].forEach(
            (track) => {
                track.pause();
                track.currentTime = 0;
            },
        );
    }

    /**
     * Stops all sounds and music across the entire game.
     */
    stopAll() {
        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;
        this.stopAllBackgroundMusic();
        [
            this.bossHitSound,
            this.playerHitSound,
            this.golemWalkSound,
            this.crawlingSound,
        ].forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
        });
    }
}
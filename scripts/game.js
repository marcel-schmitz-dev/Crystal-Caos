import { World } from "./world.class.js";
import { Keyboard } from "./keyboard.class.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";
import { AudioHub } from "./audio.hub.js";

let canvas;
let world;
let keyboard = new Keyboard();
let audioHub;

/**
 * Changes global audio volume level.
 * @param {string|number} val - Volume input value.
 */
function changeVolume(val) {
    if (window.audioHub) window.audioHub.setVolume(parseFloat(val));
}

/**
 * Toggles global audio mute state and updates UI button text.
 */
function toggleMute() {
    if (window.audioHub) {
        let muted = window.audioHub.toggleMute();
        let btn = document.getElementById("mute-btn");
        if (btn) btn.innerHTML = muted ? "🔇 Mute" : "🔊 Sound";
    }
}

/**
 * Initializes canvas, audio hub, game world, and fullscreen logic.
 */
function init() {
    canvas = document.getElementById("canvas");
    audioHub = new AudioHub();

    // Prüfen, ob der AudioHub durch den LocalStorage stummgeschaltet wurde
    let btn = document.getElementById("mute-btn");
    if (btn) {
        btn.innerHTML = audioHub.isMuted ? "🔇 Mute" : "🔊 Sound";
    }

    audioHub.setVolume(0.3);
    window.audioHub = audioHub;
    world = new World(canvas, keyboard);
    initFullscreen();
}

/**
 * Sets up fullscreen toggle event listener.
 */
function initFullscreen() {
    const fullscreenBtn = document.getElementById("fullscreen-btn");
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
            if (!document.fullscreenElement) {
                document.documentElement
                    .requestFullscreen()
                    .catch((err) =>
                        console.error("Fullscreen error:", err.message),
                    );
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        });
    }
}

window.init = init;
window.restartGame = () => location.reload();
window.nextLevel = () => alert("Next Level kommt bald!");
window.changeVolume = changeVolume;
window.toggleMute = toggleMute;

window.addEventListener("keydown", (e) => handleKeyDown(e));
window.addEventListener("keyup", (e) => handleKeyUp(e));

/**
 * Handles keydown events for movement and shooting.
 * @param {KeyboardEvent} e - Keyboard event.
 */
function handleKeyDown(e) {
    if (["d", "D"].includes(e.key)) keyboard.RIGHT = true;
    if (["a", "A"].includes(e.key)) keyboard.LEFT = true;
    if (["s", "S"].includes(e.key)) keyboard.DOWN = true;
    if (["w", "W"].includes(e.key)) keyboard.UP = true;
    if (e.key === "Enter") {
        e.preventDefault();
        keyboard.ENTER = true;
    }
    if (e.code === "Space") {
        e.preventDefault();
        keyboard.SPACE = true;
    }
    if (["l", "L"].includes(e.key)) handleCharacterThrow();
}

/**
 * Handles character crystal throwing action from keyboard shortcut.
 */
function handleCharacterThrow() {
    if (world?.character) {
        let success = world.character.throwCrystal();
        if (success) {
            setTimeout(() => {
                let direction = world.character.otherDirection ? -1 : 1;
                let projectileX =
                    direction === 1
                        ? world.character.x + world.character.width + 20
                        : world.character.x - 70;
                let throwable = new CrystalProjectile(
                    projectileX,
                    world.character.y + 60,
                    world,
                    direction,
                    true,
                );
                world.throwableObjects.push(throwable);
            }, 250);
        }
    }
}

/**
 * Handles keyup events to stop movement.
 * @param {KeyboardEvent} e - Keyboard event.
 */
function handleKeyUp(e) {
    if (["d", "D"].includes(e.key)) keyboard.RIGHT = false;
    if (["a", "A"].includes(e.key)) keyboard.LEFT = false;
    if (["s", "S"].includes(e.key)) keyboard.DOWN = false;
    if (["w", "W"].includes(e.key)) keyboard.UP = false;
    if (e.key === "Enter") keyboard.ENTER = false;
    if (e.code === "Space") keyboard.SPACE = false;
}

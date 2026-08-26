import { World } from "./world.class.js";
import { Keyboard } from "./keyboard.class.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

let canvas;
let world;
let keyboard = new Keyboard();

function init() {
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
}

window.init = init;

window.addEventListener("keydown", (e) => {
    if (e.key === "d" || e.key === "D") keyboard.RIGHT = true;
    if (e.key === "a" || e.key === "A") keyboard.LEFT = true;
    if (e.key === "s" || e.key === "S") keyboard.DOWN = true;
    if (e.key === "w" || e.key === "W") keyboard.UP = true;

    if (e.key === "Enter") {
        e.preventDefault();
        keyboard.ENTER = true;
    }

    if (e.key === "l" || e.key === "L") {
        if (world && world.character) {
            let success = world.character.throwCrystal();
            if (success) {
                setTimeout(() => {
                    let direction = world.character.otherDirection ? -1 : 1;

                    let projectileX =
                        direction === 1
                            ? world.character.x + world.character.width + 20
                            : world.character.x - 70;
                    let projectileY = world.character.y + 60;

                    let throwable = new CrystalProjectile(
                        projectileX,
                        projectileY,
                        world,
                        direction,
                        true,
                    );

                    world.throwableObjects.push(throwable);
                }, 250);
            }
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key === "d" || e.key === "D") keyboard.RIGHT = false;
    if (e.key === "a" || e.key === "A") keyboard.LEFT = false;
    if (e.key === "s" || e.key === "S") keyboard.DOWN = false;
    if (e.key === "w" || e.key === "W") keyboard.UP = false;

    if (e.key === "Enter") {
        keyboard.ENTER = false;
    }
});

function restartGame() {
    location.reload();
}

function nextLevel() {
    alert("Next Level kommt bald!");
}

window.restartGame = restartGame;
window.nextLevel = nextLevel;

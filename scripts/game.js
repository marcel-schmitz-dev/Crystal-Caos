import { World } from "./world.class.js";
import { Keyboard } from "./keyboard.class.js";

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
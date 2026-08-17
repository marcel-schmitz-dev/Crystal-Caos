let canvas;
let world;
let keyboard = {
    RIGHT: false,
    LEFT: false,
    UP: false,
    DOWN: false,
};

function init() {
    canvas = document.getElementById("canvas");

    world = new World(canvas);
}

window.addEventListener("keydown", (e) => {
    if (e.key === "d" || e.key === "D") keyboard.RIGHT = true;
    if (e.key === "a" || e.key === "A") keyboard.LEFT = true;
    if (e.key === "w" || e.key === "W") keyboard.UP = true;
    if (e.key === "s" || e.key === "S") keyboard.DOWN = true;
});

window.addEventListener("keyup", (e) => {
    if (e.key === "d" || e.key === "D") keyboard.RIGHT = false;
    if (e.key === "a" || e.key === "A") keyboard.LEFT = false;
    if (e.key === "w" || e.key === "W") keyboard.UP = false;
    if (e.key === "s" || e.key === "S") keyboard.DOWN = false;
});

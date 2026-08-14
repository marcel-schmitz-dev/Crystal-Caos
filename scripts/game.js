let canvas = document.getElementById("canvas");
let world = new World(canvas);

function init() {
    world = new World(canvas);
    canvas = document.getElementById("canvas");

    console.log("My Character is", world.character);
}

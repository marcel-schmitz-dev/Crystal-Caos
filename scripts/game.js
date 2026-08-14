let canvas;
let world;

function init() {
    // 1. Zuerst das Canvas-Element holen
    canvas = document.getElementById("canvas");
    
    // 2. Dann die Welt initialisieren und das Canvas übergeben
    world = new World(canvas);

    console.log("My Character is", world.character);
}
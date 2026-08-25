import { Character } from "./character.class.js";
import { Level } from "./level.class.js";
import { Keyboard } from "./keyboard.class.js";
import { level1 } from "../levels/level1.js";
import { Ghost } from "./Ghost.class.js";
import { StartScreen } from "./start-screen.class.js";
import { CollisionManager } from "./collision-manager.class.js";
import { ImageHub } from "./image.hub.js";

/**
 * Manages the game world, rendering loop, entities, and UI elements.
 */
export class World {
    character = new Character();
    level = level1;
    hpLoadedImages = [];

    portal = level1.portal;
    enemies = level1.enemies;
    backgroundObjects = level1.backgroundObjacts;
    clouds = level1.clouds;

    canvas;
    ctx;
    camera_x = 0;
    throwableObjects = [];
    crystalDrops = [];

    startScreen = new StartScreen(1280, 720);
    gameStarted = false;
    collisionManager;
    crystalBarIcon;

    /**
     * Initializes the world, assets, event listeners, and game loops.
     * @param {HTMLCanvasElement} canvas - The main game canvas.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.initHpImages();
        this.initLevelEntities();
        this.initCrystalIcon();
        this.initGameSystems();
        this.initMenuClickListener();

        this.run();
        this.draw();
    }

    /**
     * Loads the HP bar images from the image hub.
     */
    initHpImages() {
        const hpPaths = ImageHub?.CHARACTER?.HUD?.HP_BARS || [];
        this.hpLoadedImages = hpPaths.map((path) => {
            let img = new Image();
            img.src = path;
            return img;
        });
    }

    /**
     * Maps level entities and references.
     */
    initLevelEntities() {
        this.portal = this.level.portal;
        this.enemies = this.level.enemies;
        this.backgroundObjects = this.level.backgroundObjacts;
        this.clouds = this.level.clouds;
    }

    /**
     * Loads the UI core icon image.
     */
    initCrystalIcon() {
        this.crystalBarIcon = new Image();
        this.crystalBarIcon.src = "./assets/img/drops/Core_amBoden.png";
    }

    /**
     * Connects core systems like character world reference and collisions.
     */
    initGameSystems() {
        this.character.world = this;
        this.collisionManager = new CollisionManager(this);
        this.enemies.forEach((enemy) => {
            if (enemy instanceof Ghost) enemy.world = this;
        });
    }

    /**
     * Sets up the start screen click listener.
     */
    initMenuClickListener() {
        let menuClickListener = (event) => {
            if (this.gameStarted) return;
            let action = this.evaluateMenuClick(event);
            if (action === "start") this.startGameSession(menuClickListener);
            if (action === "exit") window.location.reload();
        };
        this.canvas.addEventListener("click", menuClickListener);
    }

    /**
     * Evaluates click coordinates on the start screen.
     * @param {MouseEvent} event - The click event.
     * @returns {string|null} The resulting action command.
     */
    evaluateMenuClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;
        return this.startScreen.handleClick(clickX, clickY);
    }

    /**
     * Starts the game session and cleans up menu listeners.
     * @param {Function} listener - The listener to remove.
     */
    startGameSession(listener) {
        this.gameStarted = true;
        this.level.setGolemSpawner();
        this.canvas.removeEventListener("click", listener);
    }

    /**
     * Starts the core collision check interval.
     */
    run() {
        setInterval(() => {
            if (!this.gameStarted) return;
            this.collisionManager.checkAllCollisions();
        }, 1000 / 60);
    }

    /**
     * Main render loop for clearing screen, mapping objects, and drawing UI.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateCameraPosition();

        this.ctx.translate(this.camera_x, 0);
        this.drawWorldEntities();
        this.ctx.translate(-this.camera_x, 0);

        this.drawUserInterface();
        this.drawStartScreenIfNeeded();

        requestAnimationFrame(() => this.draw());
    }

    /**
     * Updates camera offset based on character position.
     */
    updateCameraPosition() {
        this.camera_x = -this.character.x + 100;
    }

    /**
     * Draws all active world objects onto the canvas map.
     */
    drawWorldEntities() {
        this.drawCollection(this.backgroundObjects);
        this.drawCollection(this.throwableObjects);
        this.drawCollection(this.clouds);
        this.drawCollection(this.level.portals);
        this.drawCollection(this.crystalDrops);
        this.drawCharacter();
        this.drawCollection(this.enemies);
    }

    /**
     * Helper to draw a collection of standard objects.
     * @param {Array} collection - Array of renderable objects.
     */
    drawCollection(collection) {
        collection.forEach((item) => {
            if (item.img && item.img.complete && item.img.naturalWidth !== 0) {
                this.ctx.drawImage(
                    item.img,
                    item.x,
                    item.y,
                    item.width,
                    item.height,
                );
            }
        });
    }

    /**
     * Draws the player character considering orientation direction.
     */
    drawCharacter() {
        this.ctx.save();
        if (this.character.otherDirection) {
            this.ctx.translate(this.character.x + this.character.width, 0);
            this.ctx.scale(-1, 1);
        }
        if (
            this.character.img &&
            this.character.img.complete &&
            this.character.img.naturalWidth !== 0
        ) {
            let drawX = this.character.otherDirection ? 0 : this.character.x;
            this.ctx.drawImage(
                this.character.img,
                drawX,
                this.character.y,
                this.character.width,
                this.character.height,
            );
        }
        this.ctx.restore();
    }

    /**
     * Draws overlay UI elements if game has started.
     */
    drawUserInterface() {
        if (!this.gameStarted) return;
        this.drawHpBar();
        this.drawCrystalCounter();
    }

    /**
     * Draws the player's health status bar.
     */
    drawHpBar() {
        let currentEnergy = Math.max(0, Math.min(this.character.energy, 5));
        let hpImg = this.hpLoadedImages[currentEnergy];
        if (hpImg && hpImg.complete && hpImg.naturalWidth !== 0) {
            this.ctx.drawImage(hpImg, 20, 20, 220, 60);
        }
    }

    /**
     * Draws the crystal drop counter HUD element.
     */
    drawCrystalCounter() {
        let iconX = 20;
        let iconY = 90;
        let iconSize = 80;

        if (
            this.crystalBarIcon &&
            this.crystalBarIcon.complete &&
            this.crystalBarIcon.naturalWidth !== 0
        ) {
            this.ctx.drawImage(
                this.crystalBarIcon,
                iconX,
                iconY,
                iconSize,
                iconSize,
            );
        }

        this.ctx.font = "32px Arial";
        this.ctx.fillStyle = "gold";
        this.ctx.fillText(
            "x " + this.character.crystals,
            iconX + iconSize + 10,
            iconY + iconSize / 2 + 8,
        );
    }

    /**
     * Draws the start menu screen if the game hasn't launched yet.
     */
    drawStartScreenIfNeeded() {
        if (!this.gameStarted) {
            this.startScreen.draw(this.ctx);
        }
    }
}

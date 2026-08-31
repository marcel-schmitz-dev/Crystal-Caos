import { Character } from "./character.class.js";
import { Level } from "./level.class.js";
import { Keyboard } from "./keyboard.class.js";
import { level1 } from "../levels/level1.js";
import { Ghost } from "./Ghost.class.js";
import { StartScreen } from "./start-screen.class.js";
import { CollisionManager } from "./collision-manager.class.js";
import { ImageHub } from "./image.hub.js";
import { StatusBar } from "./status-bar.class.js";
import { AudioHub } from "./audio.hub.js";
import { CrystalProjectile } from "./crystal-projectile.class.js";

/**
 * Manages the game world, rendering loop, entities, and UI elements.
 */
export class World {
    character = new Character();
    level = level1;
    hpLoadedImages = [];
    bossHpLoadedImages = [];
    get audioHub() {
        return window.audioHub;
    }

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
    bossBarUnlocked = false;
    collisionManager;

    statusBar = new StatusBar("hp", 10, 20, 300, 60);
    coinStatusBar = new StatusBar("coins", 10, 150, 280, 60);
    bossStatusBar = new StatusBar("boss_hp", 0, 20, 350, 100);
    coreStatusBar = new StatusBar("cores", 10, 90, 280, 50);

    /**
     * Initializes the world, assets, event listeners, and game loops.
     * @param {HTMLCanvasElement} canvas - The main game canvas.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.keyboard = keyboard;

        this.initLevelEntities();
        this.initGameSystems();
        this.initMenuClickListener();
        this.initMenuTouchListener();
        this.initMouseMoveListener();

        this.run();
        this.draw();
    }

    /**
     * Sets up the mouse move listener for hover effects on the start screen.
     */
    initMouseMoveListener() {
        this.canvas.addEventListener("mousemove", (event) => {
            if (this.gameStarted) return;
            const rect = this.canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;

            if (this.startScreen) {
                this.startScreen.handleMouseMove(x, y);
            }
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
     * Sets up the start screen touch listener for mobile devices.
     */
    initMenuTouchListener() {
        let menuTouchListener = (event) => {
            if (this.gameStarted) return;
            event.preventDefault();

            const rect = this.canvas.getBoundingClientRect();
            const touch = event.touches[0];

            const clickX = touch.clientX - rect.left;
            const clickY = touch.clientY - rect.top;

            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            let action = this.startScreen.handleClick(
                clickX * scaleX,
                clickY * scaleY,
            );

            if (action === "start") {
                this.startGameSession();
                this.canvas.removeEventListener(
                    "touchstart",
                    menuTouchListener,
                );
            }
            if (action === "exit") window.location.reload();
        };

        this.canvas.addEventListener("touchstart", menuTouchListener, {
            passive: false,
        });
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
        if (listener) {
            this.canvas.removeEventListener("click", listener);
        }
        this.audioHub.playBackgroundMusic();
    }

    /**
     * Starts the core game interval loops.
     */
    run() {
        setInterval(() => {
            if (!this.gameStarted) return;
            this.audioHub.checkMusicZone(this.character.x);
            this.collisionManager.checkAllCollisions();
            this.checkCoinCollisions();
            this.checkThrowObjects();
            this.checkGameWin();
            this.checkGameOver();
        }, 1000 / 60);
    }

    lastThrowTime = 0;

    /**
     * Checks if the character wants to throw a core projectile (using SPACE).
     */
    checkThrowObjects() {
        if (this.keyboard.SPACE) {
            let currentTime = new Date().getTime();
            if (currentTime - this.lastThrowTime < 500) return;

            if (
                this.character &&
                typeof this.character.throwCrystal === "function"
            ) {
                let success = this.character.throwCrystal();
                if (success) {
                    this.lastThrowTime = currentTime;
                    setTimeout(() => {
                        let direction = this.character.otherDirection ? -1 : 1;

                        let projectileX =
                            direction === 1
                                ? this.character.x + this.character.width + 20
                                : this.character.x - 70;
                        let projectileY = this.character.y + 60;

                        let throwable = new CrystalProjectile(
                            projectileX,
                            projectileY,
                            this,
                            direction,
                            true,
                        );

                        this.throwableObjects.push(throwable);
                    }, 250);
                }
            }
        }
    }

    /**
     * Checks if the character collects any coins on the map.
     */
    checkCoinCollisions() {
        if (!this.level.coins) return;

        this.level.coins.forEach((coin, index) => {
            if (this.character.isColliding(coin)) {
                this.character.coins = (this.character.coins || 0) + 1;
                if (this.character.coins > 5) this.character.coins = 5;
                this.level.coins.splice(index, 1);
            }
        });
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
        this.drawCollection(this.level.coins);
        this.drawCharacter();
        this.drawCollection(this.enemies);
    }

    /**
     * Helper to draw a collection of standard objects.
     * @param {Array} collection - Array of renderable objects.
     */
    drawCollection(collection) {
        if (!collection) return;
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

        this.statusBar.setPercentage(this.character.energy);
        this.statusBar.draw(this.ctx);

        this.coreStatusBar.setPercentage(this.character.crystals);
        this.coreStatusBar.draw(this.ctx);

        this.coinStatusBar.setPercentage(this.character.coins || 0);
        this.coinStatusBar.draw(this.ctx);

        let boss = this.enemies.find((e) => e instanceof Ghost);
        if (boss) {
            if (this.character.x > 3840) {
                this.bossBarUnlocked = true;
            }

            if (this.bossBarUnlocked) {
                this.bossStatusBar.x =
                    this.canvas.width / 2 - this.bossStatusBar.width / 2;
                this.bossStatusBar.setPercentage(boss.energy);
                this.bossStatusBar.draw(this.ctx);
            }
        }
    }

    /**
     * Draws the start menu screen if the game hasn't launched yet.
     */
    drawStartScreenIfNeeded() {
        if (!this.gameStarted) {
            this.startScreen.draw(this.ctx);
        }
    }

    /**
     * Shows the win screen overlay when the boss is defeated.
     */
    checkGameWin() {
        let boss = this.level.enemies.find((e) => e instanceof Ghost);
        if (boss && boss.energy <= 0) {
            let winScreen = document.getElementById("win-screen");
            if (winScreen) {
                winScreen.style.display = "flex";
            }
            this.audioHub.stopAll();
            this.audioHub.playWin();
        }
    }

    checkGameOver() {
        if (this.character && this.character.energy <= 0) {
            let gameOverScreen = document.getElementById("game-over-screen");
            if (gameOverScreen) {
                gameOverScreen.style.display = "flex";
            }
            this.audioHub.backgroundMusic.pause();
            this.audioHub.playGameOver();
        }
    }

    /**
     * Resets the game state seamlessly without showing the start screen.
     */
    resetGame() {
        let gameOverScreen = document.getElementById("game-over-screen");
        let winScreen = document.getElementById("win-screen");
        if (gameOverScreen) gameOverScreen.style.display = "none";
        if (winScreen) winScreen.style.display = "none";

        this.audioHub.stopAll();

        this.character.energy = 100;
        this.character.x = 100;
        this.character.y = 220;
        this.character.coins = 0;
        this.character.crystals = 0;
        this.bossBarUnlocked = false;

        this.level = level1;
        this.initLevelEntities();
        this.initGameSystems();

        this.gameStarted = true;
    }
}

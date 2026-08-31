import { Level } from "../scripts/level.class.js";
import { Ghost } from "../scripts/Ghost.class.js";
import { Golem } from "../scripts/Golem.class.js";
import { Spider } from '../scripts/spider.class.js';
import { Cloud } from "../scripts/cloud.class.js";
import { BackgroundObjekt } from "../scripts/background.class.js";
import { Coin } from "../scripts/coin.class.js";

/**
 * Generates a random set of coins distributed across the map.
 * @param {number} count - Number of coins to generate.
 * @returns {Coin[]} Array of Coin instances.
 */
function createRandomCoins(count = 7) {
    let coinsArray = [];
    for (let i = 0; i < count; i++) {
        let randomX = Math.floor(Math.random() * 1900) + 400;
        let fixedY = 550;
        coinsArray.push(new Coin(randomX, fixedY));
    }
    return coinsArray;
}


/**
 * Creates the background objects array for level 1.
 * @returns {BackgroundObjekt[]} Array of background objects.
 */
function createBackgroundObjects() {
    return [
        new BackgroundObjekt("assets/img/background/background_lvl1.webp", -1280),
        new BackgroundObjekt("assets/img/background/background_lvl1.webp", 0),
        new BackgroundObjekt("assets/img/background/background_lvl1.webp", 1280),
        new BackgroundObjekt("assets/img/background/background_lvl1.webp", 2560),
        new BackgroundObjekt("assets/img/background/background_boss.webp", 3840),
        new BackgroundObjekt("assets/img/background/background_boss.webp", 5120),
    ];
}


/**
 * Creates the cloud objects array for level 1.
 * @returns {Cloud[]} Array of cloud objects.
 */
function createClouds() {
    return [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(1500),
        new Cloud(2000),
        new Cloud(2600),
    ];
}


/**
 * Creates the initial enemy array for level 1.
 * @returns {Array} Array of enemy instances.
 */
function createEnemies() {
    return [
        new Ghost(),
        new Spider(),
        new Spider(),
        new Spider(),
        new Spider(),
        new Spider()
    ];
}


/**
 * Creates the portal array for level 1.
 * @returns {Array} Array of portal instances.
 */
function createPortals() {
    return [
        Golem.createPortal(900, 380),
        Golem.createPortal(2200, 380)
    ];
}


export const level1 = new Level(
    createEnemies(),
    createPortals(),
    createClouds(),
    createBackgroundObjects(),
    createRandomCoins(7)
);
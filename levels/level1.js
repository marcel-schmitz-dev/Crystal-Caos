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

export const level1 = new Level(
    [new Ghost(), new Spider(), new Spider(), new Spider(), new Spider(), new Spider()],
    [Golem.createPortal(900, 380), Golem.createPortal(2200, 380)],

    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(1500),
        new Cloud(2000),
        new Cloud(2600),
    ],
    [
        new BackgroundObjekt(
            "assets/img/background/background_lvl1.webp",
            -1280,
        ),
        new BackgroundObjekt("assets/img/background/background_lvl1.webp", 0),
        new BackgroundObjekt(
            "assets/img/background/background_lvl1.webp",
            1280,
        ),
        new BackgroundObjekt(
            "assets/img/background/background_lvl1.webp",
            2560,
        ),
        new BackgroundObjekt(
            "assets/img/background/background_boss.webp",
            3840,
        ),
        new BackgroundObjekt(
            "assets/img/background/background_boss.webp",
            5120,
        ),
    ],
    createRandomCoins(7),
);

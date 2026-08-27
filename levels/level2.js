import { Level } from "../scripts/level.class.js";
import { Cloud } from "../scripts/cloud.class.js";
import { BackgroundObjekt } from "../scripts/background.class.js";
import { Coin } from "../scripts/coin.class.js";

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
    [new Ghost()],
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
            "assets/img/background/background_lvl1.png",
            -1280,
        ),
        new BackgroundObjekt("assets/img/level2/background_lvl2.png", 0),
        new BackgroundObjekt("assets/img/level2/background_lvl2.png", 1280),
        new BackgroundObjekt("assets/img/background/background_boss.png", 2560),
        new BackgroundObjekt("assets/img/background/background_boss.png", 3840),
    ],
    createRandomCoins(7),
);
import { Level } from "../scripts/level.class.js";
import { Ghost } from "../scripts/Ghost.class.js";
import { Golem } from "../scripts/Golem.class.js"; // Neu statt Portal
import { Cloud } from "../scripts/cloud.class.js";
import { BackgroundObjekt } from "../scripts/background.class.js";

export const level1 = new Level(
    [new Ghost()],
    [
        Golem.createPortal(900, 380), 
        Golem.createPortal(2200, 380)
    ],
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
        new BackgroundObjekt("assets/img/background/background_lvl1.png", 0),
        new BackgroundObjekt("assets/img/background/background_lvl1.png", 1280),
        new BackgroundObjekt("assets/img/background/background_boss.png", 2560),
        new BackgroundObjekt("assets/img/background/background_boss.png", 3840),
    ],
);
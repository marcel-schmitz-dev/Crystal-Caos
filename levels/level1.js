const level1 = new Level(
    [new Ghost()],

    [new Portal(1100, 380), new Portal(2200, 380)],

    [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(1500),
        new Cloud(2000),
        new Cloud(2600),
    ],

    [
        new BackgroundObjekt("assets/img/background/background1.png", -1280),
        new BackgroundObjekt("assets/img/background/background1.png", 0),
        new BackgroundObjekt("assets/img/background/background1.png", 1280),
        new BackgroundObjekt("assets/img/background/background1.png", 2560),
        new BackgroundObjekt("assets/img/background/background1.png", 3840),
    ],
);

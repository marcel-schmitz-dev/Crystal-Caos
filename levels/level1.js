const level1 = new Level(
    [new Ghost()],

    new Portal(1100, 380),

    [new cloud(), new cloud(), new cloud()],

    [
        new BackgroundObjekt("assets/img/background/background1.png", 0),
        new BackgroundObjekt("assets/img/background/background1.png", 1280),
        new BackgroundObjekt("assets/img/background/background1.png", 2560),
    ],
);

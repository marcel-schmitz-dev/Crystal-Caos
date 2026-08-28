export class StartScreen {
    activeSubMenu = null;
    bgImage = new Image();

    /**
     * Creates an instance of StartScreen.
     * @param {number} canvasWidth
     * @param {number} canvasHeight
     */
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;
        this.bgImage.src = "./assets/img/icon/Matzemon3.webp";
        this.mousePos = { x: -1, y: -1 };
    }

    handleMouseMove(x, y) {
        this.mousePos = { x, y };
    }

    /**
     * Draws the start screen or options menu on the canvas.
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.drawBackgroundOverlay(ctx);

        const panelWidth = 600;
        const panelHeight = 400;
        const panelX = this.width / 2 - panelWidth / 2;
        const panelY = this.height / 2 - panelHeight / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(panelX, panelY, panelWidth, panelHeight);
        ctx.clip();

        this.drawImagePanel(ctx, panelX, panelY, panelWidth, panelHeight);
        ctx.restore();

        this.drawPanelBorder(ctx, panelX, panelY, panelWidth, panelHeight);
        this.drawMenuContent(ctx, panelX, panelY);
    }

    /**
     * Draws the dark background overlay.
     * @param {CanvasRenderingContext2D} ctx
     */
    drawBackgroundOverlay(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Draws the background image inside the panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    drawImagePanel(ctx, panelX, panelY, panelWidth, panelHeight) {
        if (this.bgImage.complete && this.bgImage.naturalWidth !== 0) {
            const imgWidth = this.bgImage.naturalWidth;
            const imgHeight = this.bgImage.naturalHeight;
            const imgRatio = imgWidth / imgHeight;
            const panelRatio = panelWidth / panelHeight;

            let drawWidth = panelWidth;
            let drawHeight = panelHeight;
            let offsetX = panelX;
            let offsetY = panelY;

            if (imgRatio > panelRatio) {
                drawWidth = panelHeight * imgRatio;
                offsetX = panelX - (drawWidth - panelWidth) / 2;
            } else {
                drawHeight = panelWidth / imgRatio;
                offsetY = panelY - (drawHeight - panelHeight) / 2;
            }

            ctx.drawImage(
                this.bgImage,
                offsetX,
                offsetY,
                drawWidth,
                drawHeight,
            );
        } else {
            ctx.fillStyle = "#1a0033";
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    }

    /**
     * Draws the neon border around the panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    drawPanelBorder(ctx, panelX, panelY, panelWidth, panelHeight) {
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 15;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        ctx.shadowBlur = 0;
    }

    /**
     * Draws either the options menu, impressum or the main menu content.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     */
    drawMenuContent(ctx, panelX, panelY) {
        ctx.textAlign = "center";

        if (this.activeSubMenu === "options") {
            this.drawOptionsMenu(ctx, panelY);
        } else if (this.activeSubMenu === "impressum") {
            this.drawImpressumMenu(ctx, panelY);
        } else {
            this.drawMainMenu(ctx, panelY);
        }

        ctx.textAlign = "left";
    }

    /**
     * Draws the options/controls menu.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawOptionsMenu(ctx, panelY) {
        ctx.textAlign = "center";

        let titleGradient = ctx.createLinearGradient(
            this.width / 2 - 200,
            panelY + 25,
            this.width / 2 + 200,
            panelY + 65,
        );
        titleGradient.addColorStop(0, "#00f0ff");
        titleGradient.addColorStop(1.0, "#ff00ff");

        ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 2;

        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = titleGradient;
        ctx.fillText("TASTENBELEGUNG", this.width / 2, panelY + 45);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#ffffff";

        ctx.fillText("A / D – Gehen", this.width / 2, panelY + 75);
        ctx.fillText("W – Springen", this.width / 2, panelY + 98);
        ctx.fillText("S – Ducken", this.width / 2, panelY + 121);
        ctx.fillText("S + A – Links krabbeln", this.width / 2, panelY + 144);
        ctx.fillText("S + D – Rechts krabbeln", this.width / 2, panelY + 167);
        ctx.fillText("L – Core werfen", this.width / 2, panelY + 190);
        ctx.fillText(
            "Auf Golems springen = Core",
            this.width / 2,
            panelY + 210,
        );
        ctx.fillText(
            "Core auf Ghost-Boss werfen",
            this.width / 2,
            panelY + 240,
        );

        ctx.font = "italic 14px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText(
            "Klicke irgendwo, um zurückzugehen",
            this.width / 2,
            panelY + 310,
        );

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the Impressum menu according to § 5 DDG.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawImpressumMenu(ctx, panelY) {
        ctx.textAlign = "center";

        let titleGradient = ctx.createLinearGradient(
            this.width / 2 - 200,
            panelY + 25,
            this.width / 2 + 200,
            panelY + 65,
        );
        titleGradient.addColorStop(0, "#00f0ff");
        titleGradient.addColorStop(1.0, "#ff00ff");

        ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = 4;

        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = titleGradient;
        ctx.fillText("IMPRESSUM", this.width / 2, panelY + 45);

        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Angaben gemäß § 5 DDG:", this.width / 2, panelY + 75);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Marcel Schmitz", this.width / 2, panelY + 98);
        ctx.fillText("[Straße und Hausnummer]", this.width / 2, panelY + 118);
        ctx.fillText("[PLZ Ort]", this.width / 2, panelY + 138);

        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Kontakt:", this.width / 2, panelY + 165);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
            "E-Mail: m.schmitz.dev@gmail.com",
            this.width / 2,
            panelY + 185,
        );

        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Urheberrecht & Assets:", this.width / 2, panelY + 212);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(
            "Icons & Grafiken: KI (ChatGPT, Gemini)",
            this.width / 2,
            panelY + 232,
        );
        ctx.fillText("sowie Icons8 / Flaticon", this.width / 2, panelY + 250);
        ctx.fillText(
            "Sounds: KI (ChatGPT) & Pixabay",
            this.width / 2,
            panelY + 268,
        );

        // Mehr Abstand zum Zurück-Text unten
        ctx.font = "italic 14px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText(
            "Klicke irgendwo, um zurückzugehen",
            this.width / 2,
            panelY + 315,
        );

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the main menu buttons (with text shadow).
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawMainMenu(ctx, panelY) {
        let titleGradient = ctx.createLinearGradient(
            this.width / 2 - 150,
            panelY + 40,
            this.width / 2 + 150,
            panelY + 100,
        );
        titleGradient.addColorStop(0, "#00f0ff");
        titleGradient.addColorStop(1.0, "#ff00ff");

        ctx.shadowColor = "rgba(0, 0, 0, 0.9)";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 10;

        ctx.font = "bold 32px 'Press Start 2P', monospace";
        ctx.fillStyle = titleGradient;
        ctx.fillText("CRYSTAL CAOS", this.width / 2, panelY + 80);

        const panelX = this.width / 2 - 300;

        const isHoverStart =
            this.mousePos.x > panelX + 100 &&
            this.mousePos.x < panelX + 500 &&
            this.mousePos.y > panelY + 130 &&
            this.mousePos.y < panelY + 175;

        const isHoverOptions =
            this.mousePos.x > panelX + 100 &&
            this.mousePos.x < panelX + 500 &&
            this.mousePos.y > panelY + 195 &&
            this.mousePos.y < panelY + 240;

        const isHoverImpressum =
            this.mousePos.x > panelX + 100 &&
            this.mousePos.x < panelX + 500 &&
            this.mousePos.y > panelY + 260 &&
            this.mousePos.y < panelY + 305;

        // --- Button 1: SPIEL STARTEN ---
        let startGradient = ctx.createLinearGradient(
            this.width / 2 - 100,
            panelY + 130,
            this.width / 2 + 100,
            panelY + 175,
        );
        if (isHoverStart) {
            startGradient.addColorStop(0, "#ff00ff");
            startGradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 15;
        } else {
            startGradient.addColorStop(0, "#ffffff");
            startGradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 6;
        }

        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = startGradient;
        ctx.fillText("SPIEL STARTEN", this.width / 2, panelY + 160);

        // --- Button 2: STEUERUNG ---
        let optionsGradient = ctx.createLinearGradient(
            this.width / 2 - 100,
            panelY + 195,
            this.width / 2 + 100,
            panelY + 240,
        );
        if (isHoverOptions) {
            optionsGradient.addColorStop(0, "#ff00ff");
            optionsGradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 15;
        } else {
            optionsGradient.addColorStop(0, "#ffffff");
            optionsGradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 6;
        }

        ctx.fillStyle = optionsGradient;
        ctx.fillText("STEUERUNG", this.width / 2, panelY + 225);

        // --- Button 3: IMPRESSUM ---
        let impressumGradient = ctx.createLinearGradient(
            this.width / 2 - 100,
            panelY + 260,
            this.width / 2 + 100,
            panelY + 305,
        );
        if (isHoverImpressum) {
            impressumGradient.addColorStop(0, "#ff00ff");
            impressumGradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 15;
        } else {
            impressumGradient.addColorStop(0, "#ffffff");
            impressumGradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 6;
        }

        ctx.fillStyle = impressumGradient;
        ctx.fillText("IMPRESSUM", this.width / 2, panelY + 290);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Handles clicks on the start screen menu.
     * @param {number} x
     * @param {number} y
     * @returns {string|null} Action string or null.
     */
    handleClick(x, y) {
        const panelX = this.width / 2 - 300;
        const panelY = this.height / 2 - 200;

        if (this.activeSubMenu !== null) {
            this.activeSubMenu = null;
        } else {
            if (x > panelX + 100 && x < panelX + 500) {
                if (y > panelY + 130 && y < panelY + 175) {
                    return "start";
                }
                if (y > panelY + 195 && y < panelY + 240) {
                    this.activeSubMenu = "options";
                }
                if (y > panelY + 260 && y < panelY + 305) {
                    this.activeSubMenu = "impressum";
                }
            }
        }
        return null;
    }
}
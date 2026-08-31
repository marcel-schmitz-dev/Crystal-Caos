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

    /**
     * Updates the current mouse position.
     * @param {number} x
     * @param {number} y
     */
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
            this.drawCompleteImagePanel(
                ctx,
                panelX,
                panelY,
                panelWidth,
                panelHeight,
            );
        } else {
            this.drawFallbackImagePanel(
                ctx,
                panelX,
                panelY,
                panelWidth,
                panelHeight,
            );
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    }

    /**
     * Draws the loaded background image scaled into the panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    drawCompleteImagePanel(ctx, panelX, panelY, panelWidth, panelHeight) {
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

        ctx.drawImage(this.bgImage, offsetX, offsetY, drawWidth, drawHeight);
    }

    /**
     * Draws a fallback color when the image is not yet loaded.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    drawFallbackImagePanel(ctx, panelX, panelY, panelWidth, panelHeight) {
        ctx.fillStyle = "#1a0033";
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
     * Creates a standard title gradient for menus.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @returns {CanvasGradient}
     */
    createTitleGradient(ctx, panelY) {
        let titleGradient = ctx.createLinearGradient(
            this.width / 2 - 200,
            panelY + 25,
            this.width / 2 + 200,
            panelY + 65,
        );
        titleGradient.addColorStop(0, "#00f0ff");
        titleGradient.addColorStop(1.0, "#ff00ff");
        return titleGradient;
    }

    /**
     * Configures shadow settings for headings.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} [blur=2]
     */
    setHeadingShadow(ctx, blur = 2) {
        ctx.shadowColor = "rgba(0, 0, 0, 0.95)";
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 3;
        ctx.shadowBlur = blur;
    }

    /**
     * Resets shadow settings.
     * @param {CanvasRenderingContext2D} ctx
     */
    resetShadow(ctx) {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
    }

    /**
     * Draws the options/controls menu.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawOptionsMenu(ctx, panelY) {
        ctx.textAlign = "center";
        let titleGradient = this.createTitleGradient(ctx, panelY);

        this.setHeadingShadow(ctx, 2);

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

        this.resetShadow(ctx);
    }

    /**
     * Draws the Impressum menu according to § 5 DDG.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawImpressumMenu(ctx, panelY) {
        ctx.textAlign = "center";
        let titleGradient = this.createTitleGradient(ctx, panelY);

        this.setHeadingShadow(ctx, 4);

        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = titleGradient;
        ctx.fillText("IMPRESSUM", this.width / 2, panelY + 45);

        this.drawImpressumTextContent(ctx, panelY);

        ctx.font = "italic 14px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText(
            "Klicke irgendwo, um zurückzugehen",
            this.width / 2,
            panelY + 315,
        );

        this.resetShadow(ctx);
    }

    /**
     * Draws the text sections of the impressum menu.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawImpressumTextContent(ctx, panelY) {
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
    }

    /**
     * Draws the main menu buttons (with text shadow).
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawMainMenu(ctx, panelY) {
        this.drawMainMenuTitle(ctx, panelY);
        const panelX = this.width / 2 - 300;
        const hovers = this.calculateMainHoverStates(panelX, panelY);

        this.drawButtonStart(ctx, panelY, hovers.isHoverStart);
        this.drawButtonOptions(ctx, panelY, hovers.isHoverOptions);
        this.drawButtonImpressum(ctx, panelY, hovers.isHoverImpressum);

        this.resetShadow(ctx);
    }

    /**
     * Draws the main menu title.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawMainMenuTitle(ctx, panelY) {
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
    }

    /**
     * Calculates the hover states for main menu buttons.
     * @param {number} panelX
     * @param {number} panelY
     * @returns {Object}
     */
    calculateMainHoverStates(panelX, panelY) {
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

        return { isHoverStart, isHoverOptions, isHoverImpressum };
    }

    /**
     * Prepares gradient and shadow styles for a menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     * @param {boolean} isHover
     * @returns {CanvasGradient}
     */
    setupButtonStyles(ctx, startX, startY, endX, endY, isHover) {
        let gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        if (isHover) {
            gradient.addColorStop(0, "#ff00ff");
            gradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 15;
        } else {
            gradient.addColorStop(0, "#ffffff");
            gradient.addColorStop(1, "#00f0ff");
            ctx.shadowBlur = 6;
        }

        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.font = "bold 22px 'Press Start 2P', monospace";
        return gradient;
    }

    /**
     * Draws the start game menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {boolean} isHover
     */
    drawButtonStart(ctx, panelY, isHover) {
        let startGradient = this.setupButtonStyles(
            ctx,
            this.width / 2 - 100,
            panelY + 130,
            this.width / 2 + 100,
            panelY + 175,
            isHover,
        );
        ctx.fillStyle = startGradient;
        ctx.fillText("SPIEL STARTEN", this.width / 2, panelY + 160);
    }

    /**
     * Draws the options menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {boolean} isHover
     */
    drawButtonOptions(ctx, panelY, isHover) {
        let optionsGradient = this.setupButtonStyles(
            ctx,
            this.width / 2 - 100,
            panelY + 195,
            this.width / 2 + 100,
            panelY + 240,
            isHover,
        );
        ctx.fillStyle = optionsGradient;
        ctx.fillText("STEUERUNG", this.width / 2, panelY + 225);
    }

    /**
     * Draws the impressum menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {boolean} isHover
     */
    drawButtonImpressum(ctx, panelY, isHover) {
        let impressumGradient = this.setupButtonStyles(
            ctx,
            this.width / 2 - 100,
            panelY + 260,
            this.width / 2 + 100,
            panelY + 305,
            isHover,
        );
        ctx.fillStyle = impressumGradient;
        ctx.fillText("IMPRESSUM", this.width / 2, panelY + 290);
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
            return this.handleMainMenuClick(x, y, panelX, panelY);
        }
        return null;
    }

    /**
     * Handles clicks specifically within the main menu state.
     * @param {number} x
     * @param {number} y
     * @param {number} panelX
     * @param {number} panelY
     * @returns {string|null}
     */
    handleMainMenuClick(x, y, panelX, panelY) {
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
        return null;
    }
}

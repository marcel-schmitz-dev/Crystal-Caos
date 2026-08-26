import { ImageHub } from "./image.hub.js";

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
        this.bgImage.src = "./assets/img/icon/Matzemon3.png";
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

        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
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
     * Draws either the options menu or the main menu content.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     */
    drawMenuContent(ctx, panelX, panelY) {
        ctx.textAlign = "center";

        if (this.activeSubMenu === "options") {
            this.drawOptionsMenu(ctx, panelY);
        } else {
            this.drawMainMenu(ctx, panelY);
        }

        ctx.textAlign = "left";
    }

    /**
     * Draws the options/controls menu (updated to Space instead of E).
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     */
    drawOptionsMenu(ctx, panelY) {
        let titleGradient = ctx.createLinearGradient(
            this.width / 2 - 200,
            panelY + 25,
            this.width / 2 + 200,
            panelY + 65,
        );
        titleGradient.addColorStop(0, "#ffffff");
        titleGradient.addColorStop(1, "#00f0ff");

        ctx.fillStyle = titleGradient;
        ctx.font = "bold 32px Arial";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 8;
        ctx.fillText("TASTENBELEGUNG", this.width / 2, panelY + 50);

        let textGradient = ctx.createLinearGradient(
            this.width / 2 - 150,
            panelY + 80,
            this.width / 2 + 150,
            panelY + 330,
        );
        textGradient.addColorStop(0, "#ffffff");
        textGradient.addColorStop(1, "#00f0ff");

        ctx.font = "16px Arial";
        ctx.fillStyle = textGradient;
        ctx.fillText(
            "A / D - Nach links / rechts gehen",
            this.width / 2,
            panelY + 85,
        );
        ctx.fillText("W - Springen", this.width / 2, panelY + 120);
        ctx.fillText("S - Ducken / Ausweichen", this.width / 2, panelY + 155);
        ctx.fillText("L - Core-Projektil werfen", this.width / 2, panelY + 190);
        ctx.fillText(
            "Auf Golems springen - Golem besiegen, Core einsammeln",
            this.width / 2,
            panelY + 225,
        );
        ctx.fillText(
            "Core auf Ghost-Boss werfen - Boss besiegen",
            this.width / 2,
            panelY + 260,
        );

        ctx.font = "14px Arial";
        ctx.fillStyle = "#a0e0e5";
        ctx.fillText(
            "Klicke irgendwo, um zurückzugehen",
            this.width / 2,
            panelY + 315,
        );
        ctx.shadowBlur = 0;
    }

    /**
     * Draws the main menu buttons.
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

        ctx.shadowColor = "#000000";
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 10;

        ctx.font = "bold 52px Arial";
        ctx.fillStyle = titleGradient;
        ctx.fillText("CRYSTAL CAOS", this.width / 2, panelY + 90);

        let buttonGradient = ctx.createLinearGradient(
            this.width / 2 - 100,
            panelY + 160,
            this.width / 2 + 100,
            panelY + 290,
        );
        buttonGradient.addColorStop(0, "#ffffff");
        buttonGradient.addColorStop(1, "#00f0ff");

        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowBlur = 6;

        ctx.font = "bold 32px Arial";
        ctx.fillStyle = buttonGradient;
        ctx.fillText("SPIEL STARTEN", this.width / 2, panelY + 200);
        ctx.fillText("STEUERUNG", this.width / 2, panelY + 280);

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

        if (this.activeSubMenu === "options") {
            this.activeSubMenu = null;
        } else {
            if (x > panelX + 100 && x < panelX + 500) {
                if (y > panelY + 165 && y < panelY + 210) {
                    return "start";
                }
                if (y > panelY + 245 && y < panelY + 290) {
                    this.activeSubMenu = "options";
                }
            }
        }
        return null;
    }
}

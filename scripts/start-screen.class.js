import { MenuContentHelper } from "./menu-content.helper.js";
import { StartScreenRenderer } from "./start-screen-renderer.helper.js";

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
        StartScreenRenderer.drawBackgroundAndPanel(
            ctx,
            this.width,
            this.height,
            this.bgImage,
        );

        const panelWidth = 600;
        const panelHeight = 400;
        const panelX = this.width / 2 - panelWidth / 2;
        const panelY = this.height / 2 - panelHeight / 2;

        this.drawMenuContent(ctx, panelX, panelY);
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
            MenuContentHelper.drawOptionsMenu(
                ctx,
                panelY,
                this.width,
                (c, p) => this.createTitleGradient(c, p),
                (c, b) => this.setHeadingShadow(c, b),
                (c) => this.resetShadow(c),
            );
        } else if (this.activeSubMenu === "impressum") {
            MenuContentHelper.drawImpressumMenu(
                ctx,
                panelY,
                this.width,
                (c, p) => this.createTitleGradient(c, p),
                (c, b) => this.setHeadingShadow(c, b),
                (c) => this.resetShadow(c),
            );
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
     * @param {number} textX
     * @param {number} textY
     * @param {boolean} isHover
     * @returns {CanvasGradient}
     */
    setupButtonStyles(ctx, textX, textY, isHover) {
        let btnWidth = 360;
        let btnHeight = 46;
        let btnX = textX - btnWidth / 2;
        let btnY = textY - 32;

        ctx.save();
        ctx.fillStyle = isHover
            ? "rgba(0, 240, 255, 0.15)"
            : "rgba(20, 20, 35, 0.65)";
        ctx.fillRect(btnX, btnY, btnWidth, btnHeight);

        ctx.strokeStyle = isHover ? "#ff00ff" : "#00f0ff";
        ctx.lineWidth = 2;
        ctx.shadowColor = isHover ? "#ff00ff" : "#00f0ff";
        ctx.shadowBlur = isHover ? 12 : 6;
        ctx.strokeRect(btnX, btnY, btnWidth, btnHeight);
        ctx.restore();

        let gradient = ctx.createLinearGradient(
            textX - 100,
            textY,
            textX + 100,
            textY,
        );
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
        ctx.font = "bold 20px 'Press Start 2P', monospace";
        return gradient;
    }

    /**
     * Draws the start game menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {boolean} isHover
     */
    drawButtonStart(ctx, panelY, isHover) {
        let textX = this.width / 2;
        let textY = panelY + 160;
        let startGradient = this.setupButtonStyles(ctx, textX, textY, isHover);
        ctx.fillStyle = startGradient;
        ctx.fillText("SPIEL STARTEN", textX, textY);
    }

    /**
     * Draws the options menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {boolean} isHover
     */
    drawButtonOptions(ctx, panelY, isHover) {
        let textX = this.width / 2;
        let textY = panelY + 225;
        let optionsGradient = this.setupButtonStyles(
            ctx,
            textX,
            textY,
            isHover,
        );
        ctx.fillStyle = optionsGradient;
        ctx.fillText("STEUERUNG", textX, textY);
    }

    /**
     * Draws the impressum menu button.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {boolean} isHover
     */
    drawButtonImpressum(ctx, panelY, isHover) {
        let textX = this.width / 2;
        let textY = panelY + 290;
        let impressumGradient = this.setupButtonStyles(
            ctx,
            textX,
            textY,
            isHover,
        );
        ctx.fillStyle = impressumGradient;
        ctx.fillText("IMPRESSUM", textX, textY);
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

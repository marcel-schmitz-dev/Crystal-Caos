export class StartScreenRenderer {
    /**
     * Draws the complete visual background and panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     * @param {HTMLImageElement} bgImage
     */
    static drawBackgroundAndPanel(ctx, width, height, bgImage) {
        this.drawBackgroundOverlay(ctx, width, height);

        const panelWidth = 600;
        const panelHeight = 400;
        const panelX = width / 2 - panelWidth / 2;
        const panelY = height / 2 - panelHeight / 2;

        ctx.save();
        ctx.beginPath();
        ctx.rect(panelX, panelY, panelWidth, panelHeight);
        ctx.clip();

        this.drawImagePanel(ctx, bgImage, panelX, panelY, panelWidth, panelHeight);
        ctx.restore();

        this.drawPanelBorder(ctx, panelX, panelY, panelWidth, panelHeight);
    }

    /**
     * Draws the dark background overlay.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} width
     * @param {number} height
     */
    static drawBackgroundOverlay(ctx, width, height) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        ctx.fillRect(0, 0, width, height);
    }

    /**
     * Draws the background image inside the panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLImageElement} bgImage
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    static drawImagePanel(ctx, bgImage, panelX, panelY, panelWidth, panelHeight) {
        if (bgImage.complete && bgImage.naturalWidth !== 0) {
            this.drawCompleteImagePanel(ctx, bgImage, panelX, panelY, panelWidth, panelHeight);
        } else {
            ctx.fillStyle = "#1a0033";
            ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
        }

        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(panelX, panelY, panelWidth, panelHeight);
    }

    /**
     * Draws the loaded background image scaled into the panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {HTMLImageElement} bgImage
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    static drawCompleteImagePanel(ctx, bgImage, panelX, panelY, panelWidth, panelHeight) {
        const imgWidth = bgImage.naturalWidth;
        const imgHeight = bgImage.naturalHeight;
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

        ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
    }

    /**
     * Draws the neon border around the panel.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelX
     * @param {number} panelY
     * @param {number} panelWidth
     * @param {number} panelHeight
     */
    static drawPanelBorder(ctx, panelX, panelY, panelWidth, panelHeight) {
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 4;
        ctx.shadowColor = "#00f0ff";
        ctx.shadowBlur = 15;
        ctx.strokeRect(panelX, panelY, panelWidth, panelHeight);
        ctx.shadowBlur = 0;
    }
}
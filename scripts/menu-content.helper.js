export class MenuContentHelper {
    /**
     * Draws the options/controls menu.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {number} width
     * @param {Function} createTitleGradient
     * @param {Function} setHeadingShadow
     * @param {Function} resetShadow
     */
    static drawOptionsMenu(ctx, panelY, width, createTitleGradient, setHeadingShadow, resetShadow) {
        ctx.textAlign = "center";
        let titleGradient = createTitleGradient(ctx, panelY);

        setHeadingShadow(ctx, 2);

        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = titleGradient;
        ctx.fillText("TASTENBELEGUNG", width / 2, panelY + 45);

        ctx.font = "bold 20px sans-serif";
        ctx.fillStyle = "#ffffff";

        ctx.fillText("A / D – Gehen", width / 2, panelY + 75);
        ctx.fillText("W – Springen", width / 2, panelY + 98);
        ctx.fillText("S – Ducken", width / 2, panelY + 121);
        ctx.fillText("S + A – Links krabbeln", width / 2, panelY + 144);
        ctx.fillText("S + D – Rechts krabbeln", width / 2, panelY + 167);
        ctx.fillText("L – Core werfen", width / 2, panelY + 190);
        ctx.fillText("Auf Golems springen = Core", width / 2, panelY + 210);
        ctx.fillText("Core auf Ghost-Boss werfen", width / 2, panelY + 240);

        ctx.font = "italic 14px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Klicke irgendwo, um zurückzugehen", width / 2, panelY + 310);

        resetShadow(ctx);
    }

    /**
     * Draws the Impressum menu according to § 5 DDG.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {number} width
     * @param {Function} createTitleGradient
     * @param {Function} setHeadingShadow
     * @param {Function} resetShadow
     */
    static drawImpressumMenu(ctx, panelY, width, createTitleGradient, setHeadingShadow, resetShadow) {
        ctx.textAlign = "center";
        let titleGradient = createTitleGradient(ctx, panelY);

        setHeadingShadow(ctx, 4);

        ctx.font = "bold 22px 'Press Start 2P', monospace";
        ctx.fillStyle = titleGradient;
        ctx.fillText("IMPRESSUM", width / 2, panelY + 45);

        this.drawImpressumTextContent(ctx, panelY, width);

        ctx.font = "italic 14px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Klicke irgendwo, um zurückzugehen", width / 2, panelY + 315);

        resetShadow(ctx);
    }

    /**
     * Draws the text sections of the impressum menu.
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} panelY
     * @param {number} width
     */
    static drawImpressumTextContent(ctx, panelY, width) {
        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Angaben gemäß § 5 DDG:", width / 2, panelY + 75);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Marcel Schmitz", width / 2, panelY + 98);
        ctx.fillText("[Straße und Hausnummer]", width / 2, panelY + 118);
        ctx.fillText("[PLZ Ort]", width / 2, panelY + 138);

        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Kontakt:", width / 2, panelY + 165);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("E-Mail: m.schmitz.dev@gmail.com", width / 2, panelY + 185);

        ctx.font = "bold 20px 'Press Start 2P', monospace";
        ctx.fillStyle = "#00f0ff";
        ctx.fillText("Urheberrecht & Assets:", width / 2, panelY + 212);

        ctx.font = "20px sans-serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("Icons & Grafiken: KI (ChatGPT, Gemini)", width / 2, panelY + 232);
        ctx.fillText("sowie Icons8 / Flaticon", width / 2, panelY + 250);
        ctx.fillText("Sounds: KI (ChatGPT) & Pixabay", width / 2, panelY + 268);
    }
}
export class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    ENTER = false;
    SPACE = false; // Hinzugefügt für Schießen / Werfen

    constructor() {
        this.initTouchListeners();
    }

    initTouchListeners() {
        const bindButton = (id, property) => {
            const btn = document.getElementById(id);
            if (!btn) return;

            const activate = (e) => {
                e.preventDefault();
                this[property] = true;
            };

            const deactivate = (e) => {
                e.preventDefault();
                this[property] = false;
            };

            btn.addEventListener("touchstart", activate, { passive: false });
            btn.addEventListener("touchend", deactivate, { passive: false });
            btn.addEventListener("touchcancel", deactivate, { passive: false });
            
            // Für Desktop-Tests mit der Maus
            btn.addEventListener("mousedown", activate);
            btn.addEventListener("mouseup", deactivate);
            btn.addEventListener("mouseleave", deactivate);
        };

        // Verknüpfung der Touch-Buttons mit den Keyboard-Eigenschaften
        bindButton("btn-left", "LEFT");
        bindButton("btn-right", "RIGHT");
        bindButton("btn-jump", "UP");
        bindButton("btn-duck", "DOWN");
        bindButton("btn-throw", "SPACE");
    }
}

/**
 * Manages keyboard states and touch/mouse control bindings.
 */
export class Keyboard {
    LEFT = false;
    RIGHT = false;
    UP = false;
    DOWN = false;
    ENTER = false;
    SPACE = false;

    /**
     * Initializes keyboard state and touch listener bindings.
     */
    constructor() {
        this.initTouchListeners();
    }

    /**
     * Initializes touch and mouse button event listeners for UI controls.
     */
    initTouchListeners() {
        this.bindControl("btn-left", "LEFT");
        this.bindControl("btn-right", "RIGHT");
        this.bindControl("btn-jump", "UP");
        this.bindControl("btn-duck", "DOWN");
        this.bindControl("btn-throw", "SPACE");
    }

    /**
     * Binds touch and mouse events to a specific DOM button element.
     * @param {string} id - DOM element ID.
     * @param {string} property - Keyboard property to toggle.
     */
    bindControl(id, property) {
        const btn = document.getElementById(id);
        if (!btn) return;
        this.addTouchEvents(btn, property);
        this.addMouseEvents(btn, property);
    }

    /**
     * Adds mobile touch event listeners.
     * @param {HTMLElement} btn - Button element.
     * @param {string} property - Property to modify.
     */
    addTouchEvents(btn, property) {
        btn.addEventListener(
            "touchstart",
            (e) => this.activateKey(e, property),
            { passive: false },
        );
        btn.addEventListener(
            "touchend",
            (e) => this.deactivateKey(e, property),
            { passive: false },
        );
        btn.addEventListener(
            "touchcancel",
            (e) => this.deactivateKey(e, property),
            { passive: false },
        );
    }

    /**
     * Adds desktop mouse event listeners.
     * @param {HTMLElement} btn - Button element.
     * @param {string} property - Property to modify.
     */
    addMouseEvents(btn, property) {
        btn.addEventListener("mousedown", (e) => this.activateKey(e, property));
        btn.addEventListener("mouseup", (e) => this.deactivateKey(e, property));
        btn.addEventListener("mouseleave", (e) =>
            this.deactivateKey(e, property),
        );
    }

    /**
     * Sets key state to true.
     * @param {Event} e - Event object.
     * @param {string} property - Property to modify.
     */
    activateKey(e, property) {
        e.preventDefault();
        this[property] = true;
    }

    /**
     * Sets key state to false.
     * @param {Event} e - Event object.
     * @param {string} property - Property to modify.
     */
    deactivateKey(e, property) {
        e.preventDefault();
        this[property] = false;
    }
}

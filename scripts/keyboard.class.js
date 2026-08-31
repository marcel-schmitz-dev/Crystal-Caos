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
    D = false;

    // Menü-Steuerung
    mousePos = { x: -1, y: -1 };

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

    /**
     * Initializes mouse and touch listeners for the start screen on the canvas.
     * @param {HTMLCanvasElement} canvas
     * @param {StartScreen} startScreen
     * @param {Function} onStartCallback
     */
    initMenuListeners(canvas, startScreen, onStartCallback) {
        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            this.mousePos = { x, y };
            if (startScreen) startScreen.handleMouseMove(x, y);
        });

        const handleMenuClick = (event, isTouch = false) => {
            const rect = canvas.getBoundingClientRect();
            let clientX = isTouch ? event.touches[0].clientX : event.clientX;
            let clientY = isTouch ? event.touches[0].clientY : event.clientY;
            
            let clickX = clientX - rect.left;
            let clickY = clientY - rect.top;

            if (isTouch) {
                clickX *= canvas.width / rect.width;
                clickY *= canvas.height / rect.height;
            }

            let action = startScreen.handleClick(clickX, clickY);
            if (action === "start") {
                onStartCallback();
            }
            if (action === "exit") {
                window.location.reload();
            }
        };

        canvas.addEventListener("click", (e) => handleMenuClick(e, false));
        canvas.addEventListener("touchstart", (e) => {
            e.preventDefault();
            handleMenuClick(e, true);
        }, { passive: false });
    }
}
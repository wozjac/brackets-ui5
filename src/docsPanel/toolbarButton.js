define((require, exports) => {
    "use strict";

    const strings = require("strings");

    let toolbarButton;

    function createButtonElement() {
        return $(document.createElement("a"))
            .attr("id", "brackets-ui5-docs-panel-icon")
            .attr("href", "#")
            .attr("title", strings.TOOLBAR_BUTTON)
            .appendTo($("#main-toolbar .buttons"));
    }

    class ToolbarButton {
        constructor(isEnabled = false) {
            this.buttonElement = createButtonElement();
            this.onClickHandlers = [];

            this.buttonElement.on("click", () => {
                this.onClickHandlers.forEach((callback) => {
                    callback(this.enabled);
                });
            });

            this.setEnabled(isEnabled);
        }

        setEnabled(isEnabled) {
            this.enabled = isEnabled;
            this.buttonElement.toggleClass("enabled", isEnabled);
        }

        addOnClickHandler(callback) {
            this.onClickHandlers.push(callback);
        }
    }

    function create() {
        if (!toolbarButton) {
            toolbarButton = new ToolbarButton();
        }

        return toolbarButton;
    }

    exports.create = create;
    exports.get = toolbarButton;
});

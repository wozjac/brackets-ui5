define((require, exports, module) => {
    "use strict";

    const InlineWidget = brackets.getModule("editor/InlineWidget").InlineWidget,
        KeyEvent = brackets.getModule("utils/KeyEvent"),
        Mustache = brackets.getModule("thirdparty/mustache/mustache"),
        fileLoader = require("src/main/fileLoader"),
        strings = require("strings"),
        SCROLL_LINE_HEIGHT = 40;

    const inlineEditorTemplate = fileLoader.readTextFileSync(module, "templates/inlineDocsViewer.html"),
        membersTemplate = fileLoader.readTextFileSync(module, "templates/members.html");

    function InlineDocsViewer(objects) {
        InlineWidget.call(this);

        const html = Mustache.render(inlineEditorTemplate, {
            objects,
            strings
        }, {
            membersTemplate
        });

        this.$wrapperDiv = $(html);
        this.$htmlContent.append(this.$wrapperDiv);

        this._sizeEditorToContent = this._sizeEditorToContent.bind(this);
        this._handleWheelScroll = this._handleWheelScroll.bind(this);

        this.$scroller = this.$wrapperDiv.find(".scroller");
        this.$scroller.on("mousewheel", this._handleWheelScroll);
        this._onKeydown = this._onKeydown.bind(this);

        this._expanded = false;
        this._bindExpandCollapseAction(this.$wrapperDiv.find(".brackets-ui5-docs-expand"));
        this.id = "ui5-docs";
    }

    InlineDocsViewer.prototype = Object.create(InlineWidget.prototype);
    InlineDocsViewer.prototype.constructor = InlineDocsViewer;
    InlineDocsViewer.prototype.parentClass = InlineWidget.prototype;

    InlineDocsViewer.prototype.$wrapperDiv = null;
    InlineDocsViewer.prototype.$scroller = null;

    InlineDocsViewer.prototype._handleScrolling = function (event, scrollingUp, scroller) {
        // We need to block the event from both the host CodeMirror code (by stopping bubbling) and the
        // browser's native behavior (by preventing default). We preventDefault() *only* when the docs
        // scroller is at its limit (when an ancestor would get scrolled instead); otherwise we'd block
        // normal scrolling of the docs themselves.
        event.stopPropagation();

        if (scrollingUp && scroller.scrollTop === 0) {
            event.preventDefault();
            return true;
        } else if (!scrollingUp && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight) {
            event.preventDefault();
            return true;
        }

        return false;
    };

    /* Don't allow scrollwheel/trackpad to bubble up to host editor - makes scrolling docs painful */
    InlineDocsViewer.prototype._handleWheelScroll = function (event) {
        const scrollingUp = (event.originalEvent.wheelDeltaY > 0),
            scroller = event.currentTarget;

        // If content has no scrollbar, let host editor scroll normally
        if (scroller.clientHeight >= scroller.scrollHeight) {
            return;
        }

        this._handleScrolling(event, scrollingUp, scroller);
    };

    InlineDocsViewer.prototype._onKeydown = function (event) {
        const keyCode = event.keyCode,
            scroller = this.$scroller[0];
        let scrollPos;

        // Ignore key events with modifier keys
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return false;
        }

        // Handle keys that we're interested in
        scrollPos = scroller.scrollTop;

        switch (keyCode) {
            case KeyEvent.DOM_VK_UP:
                scrollPos = Math.max(0, scrollPos - SCROLL_LINE_HEIGHT);
                break;
            case KeyEvent.DOM_VK_PAGE_UP:
                scrollPos = Math.max(0, scrollPos - scroller.clientHeight);
                break;
            case KeyEvent.DOM_VK_DOWN:
                scrollPos = Math.min(scroller.scrollHeight - scroller.clientHeight,
                    scrollPos + SCROLL_LINE_HEIGHT);
                break;
            case KeyEvent.DOM_VK_PAGE_DOWN:
                scrollPos = Math.min(scroller.scrollHeight - scroller.clientHeight,
                    scrollPos + scroller.clientHeight);
                break;
            default:
                // Ignore other keys
                return false;
        }

        scroller.scrollTop = scrollPos;

        // Disallow further processing
        event.stopPropagation();
        event.preventDefault();
        return true;
    };

    InlineDocsViewer.prototype.onAdded = function (...args) {
        InlineDocsViewer.prototype.parentClass.onAdded.apply(this, args);

        // Set height initially, and again whenever width might have changed (word wrap)
        this._sizeEditorToContent();
        $(window).on("resize", this._sizeEditorToContent);

        // Set focus
        //this.$scroller[0].focus();
        this.$wrapperDiv[0].addEventListener("keydown", this._onKeydown, true);
    };

    InlineDocsViewer.prototype.onClosed = function (...args) {
        InlineDocsViewer.prototype.parentClass.onClosed.apply(this, args);

        $(window).off("resize", this._sizeEditorToContent);
        this.$wrapperDiv[0].removeEventListener("keydown", this._onKeydown, true);
    };

    InlineDocsViewer.prototype._sizeEditorToContent = function () {
        this.hostEditor.setInlineWidgetHeight(this, this.$wrapperDiv.height() + 20, true);
    };

    InlineDocsViewer.prototype._bindExpandCollapseAction = function (element) {
        element.on("click", () => {
            if (this._expanded === true) {
                this._expanded = false;
                element.text("Show descriptions");
                this.setDescriptionsVisibility();
            } else {
                this._expanded = true;
                element.text("Hide descriptions");
                this.setDescriptionsVisibility();
            }
        });
    };

    InlineDocsViewer.prototype.setDescriptionsVisibility = function () {
        if (this._expanded === false) {
            $(".brackets-ui5-qdocs-api-description").hide();
        } else {
            $(".brackets-ui5-qdocs-api-description").show();
        }
    };

    module.exports = InlineDocsViewer;
});

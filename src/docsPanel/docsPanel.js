define((require, exports) => {
    "use strict";

    const Mustache = brackets.getModule("thirdparty/mustache/mustache"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Resizer = brackets.getModule("utils/Resizer"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        ui5ApiService = require("src/core/ui5ApiService"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        codeEditor = require("src/editor/codeEditor"),
        toolbarButton = require("src/docsPanel/toolbarButton"),
        strings = require("strings"),
        constants = require("src/core/constants"),
        docsPanelTemplate = require("text!src/docsPanel/templates/panel.html"),
        hitlistEntryTemplate = require("text!src/docsPanel/templates/hitlistEntry.html"),
        objectApiTemplate = require("text!src/docsPanel/templates/objectApiEntry.html");

    let docsPanel;

    class DocsPanel {
        constructor() {
            this._visible = false;
            this._searchTimeout = 0;
            this._toolbarButton = toolbarButton.create();
            this.searchedObjectLimit = 25;

            this._elements = {
                docsPanelElement: $(Mustache.render(docsPanelTemplate, strings)),
                searchInputElement: null,
                docsListElement: null,
                messagesElement: null,
                hitlistElement: null,
                apiDocsElement: null
            };

            this._toolbarButton.addOnClickHandler((isEnabled) => {
                if (isEnabled) {
                    this.hidePanel();
                } else {
                    this.showPanel();
                }
            });

            this._elements.docsPanelElement.on("click", "#brackets-ui5-docs-panel-close", () => {
                this.hidePanel();
            });
        }

        showPanel() {
            if (!this._visible) {
                this._showPanelGui();
                this._visible = true;
                this._toolbarButton.setEnabled(true);

                const command = CommandManager.get(constants.commands.UI5_API_REFERENCE_ID);
                command.setChecked(true);

                this._elements.searchInputElement = $("#brackets-ui5-docs-panel-search");
                this._elements.docsListElement = $("#brackets-ui5-docs-panel-list");
                this._elements.messagesElement = $("#brackets-ui5-docs-panel-message");
                this._elements.hitlistElement = $("#brackets-ui5-docs-panel-hits").hide();
                this._elements.apiDocsElement = $("#brackets-ui5-docs-panel-api");

                this._elements.searchInputElement.keyup(() => {
                    this._handleSearchInput();
                });
            }
        }

        hidePanel() {
            if (this._visible) {
                this._removePanelGui();
                this._visible = false;
                this._toolbarButton.setEnabled(false);

                const command = CommandManager.get(constants.commands.UI5_API_REFERENCE_ID);
                command.setChecked(false);
            }
        }

        isVisible() {
            return this._visible;
        }

        _handleSearchInput() {
            clearTimeout(this._searchTimeout);
            const input = this._elements.searchInputElement.val();

            if (!input) {
                this._setMessage(null);
                return;
            }

            this._processSearch(input);
        }

        _processSearch(searchInput) {
            this._searchTimeout = setTimeout(() => {
                const ui5Objects = ui5ApiFinder.findUi5ApiObjects({
                    path: searchInput
                });

                if (ui5Objects && ui5Objects.length > 0) {
                    if (ui5Objects.length > this.searchedObjectLimit) {
                        this._elements.hitlistElement.hide();
                        this._setMessage(`${strings.FOUND} ${ui5Objects.length} objects. ${strings.NARROW_SEARCH}`);
                    } else if (ui5Objects.length > 1 && ui5Objects.length <= this.searchedObjectLimit) {
                        this._setMessage(null);
                        this._showHitList(ui5Objects);
                    } else {
                        this._elements.hitlistElement.hide();
                        this._setMessage(null);
                        this._displayObjectApi(ui5Objects[0].path);
                    }
                } else {
                    this._setMessage(strings.NOT_FOUND);
                }

            }, 500);
        }

        _resize() {
            const toolbarPx = $("#main-toolbar:visible").width() || 0;
            $(".content").css("right", ($("#brackets-ui5-docs-panel").width() || 0) + toolbarPx + "px");
        }

        _showPanelGui() {
            const toolbarPx = $("#main-toolbar:visible").width() || 0;
            $(".main-view").append(this._elements.docsPanelElement);
            this._elements.docsPanelElement.css("right", `${toolbarPx}px`);
            this._elements.docsPanelElement.addClass("brackets-ui5-docs-panel-main quiet-scrollbars");
            Resizer.makeResizable(this._elements.docsPanelElement, "horz", "left", 150);
            this._elements.docsPanelElement.on("panelResizeUpdate.brackets-ui5-docs-panel-list", this._resize);
            this._resize();
        }

        _removePanelGui() {
            this._elements.docsPanelElement.detach();

            this._elements.docsPanelElement.css({
                "display": "",
                "height": "",
                "right": "",
                "width": ""
            });

            this._elements.docsPanelElement.removeClass("brackets-ui5-docs-panel-main quiet-scrollbars");
            this._elements.docsPanelElement.off("panelResizeUpdate.brackets-ui5-docs-panel-list", this._resize);
            Resizer.removeSizable(this._elements.docsPanelElement);
            this._resize();
        }

        _setMessage(message) {
            if (message) {
                this._elements.messagesElement.show();
                this._elements.messagesElement.find("span").text(message);
            } else {
                this._elements.messagesElement.hide();
            }
        }

        _showHitList(ui5Objects) {
            this._elements.hitlistElement.empty();
            this._elements.hitlistElement.append(`<span class="brackets-ui5-docs-panel-hitlist-title">${strings.HITLIST_TITLE}</span>`);

            let htmlElement;
            for (const ui5Object of ui5Objects) {
                htmlElement = $(Mustache.render(hitlistEntryTemplate, {
                    path: ui5Object.path
                }));

                htmlElement.on("click", {
                    path: ui5Object.path
                }, (event) => {
                    this._displayObjectApi(event.data.path);
                });

                htmlElement.appendTo(this._elements.hitlistElement);
            }

            this._elements.hitlistElement.append("<hr class=\"brackets-ui5-docs-panel-hr\"/>");
            this._elements.hitlistElement.show();
        }

        _displayObjectApi(ui5ObjectPath) {
            this._unregisterUi5ObjectLinkHandlers();
            this._elements.apiDocsElement.empty();
            this._elements.apiDocsElement.append(`<p style="margin-left: 5px">${strings.LOADING}</p>`);

            const objects = [];

            ui5ApiService.getUi5ObjectDesignApi(ui5ObjectPath).then((designApi) => {
                objects.push(ui5ApiFormatter.getFormattedObjectApi(designApi, true));

                const html = Mustache.render(objectApiTemplate, {
                    objects,
                    strings
                });

                this._elements.apiDocsElement.empty();
                this._elements.apiDocsElement.append(html);
                this._setMessage(null);
                this._registerUi5ObjectLinkHandlers();

            }, (error) => {
                this._setMessage(error);
            });
        }

        _registerUi5ObjectLinkHandlers() {
            this._elements.apiDocsElement.find("#brackets-ui5-panel-insert-link").on("click", (event) => {
                codeEditor.insertInDefine($(event.target).attr("data-ui5path"));
            });

            this._elements.apiDocsElement.find("#brackets-ui5-panel-insert-path-link").on("click", (event) => {
                codeEditor.insertAtPosition($(event.target).attr("data-ui5path"));
            });

            this._elements.apiDocsElement.find("#brackets-ui5-panel-insert-replace-link").on("click", (event) => {
                codeEditor.insertWithSlash($(event.target).attr("data-ui5path"));
            });

            this._elements.apiDocsElement.on("click", ".brackets-ui5-expand-link", (event) => {
                this._handleExpandCollapse($(event.target));
            });
        }

        _unregisterUi5ObjectLinkHandlers() {
            this._elements.apiDocsElement.off("click", ".brackets-ui5-expand-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-panel-insert-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-panel-insert-path-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-panel-insert-replace-link");
        }

        _handleExpandCollapse(linkElement) {
            const targetDescription = linkElement.attr("data-target-description");
            const sign = linkElement.text();

            if (sign === "[+]") {
                linkElement.text("[-]");
                $(document.getElementById(targetDescription)).show();
            } else {
                linkElement.text("[+]");
                $(document.getElementById(targetDescription)).hide();
            }
        }
    }

    function create() {
        if (!docsPanel) {
            docsPanel = new DocsPanel();
        }

        return docsPanel;
    }

    exports.create = create;

    exports.get = () => {
        return docsPanel;
    };
});

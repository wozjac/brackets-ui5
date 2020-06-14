define((require, exports, module) => {
    "use strict";

    const Mustache = brackets.getModule("thirdparty/mustache/mustache"),
        CommandManager = brackets.getModule("command/CommandManager"),
        Resizer = brackets.getModule("utils/Resizer"),
        NativeApp = brackets.getModule("utils/NativeApp"),
        ui5ApiFinder = require("src/core/ui5ApiFinder"),
        ui5ApiService = require("src/core/ui5ApiService"),
        ui5ApiFormatter = require("src/core/ui5ApiFormatter"),
        codeEditor = require("src/editor/codeEditor"),
        toolbarButton = require("src/docsPanel/toolbarButton"),
        strings = require("strings"),
        constants = require("src/core/constants"),
        fileLoader = require("src/main/fileLoader");

    const docsPanelTemplate = fileLoader.readTextFileSync(module, "templates/panel.html"),
        hitlistEntryTemplate = fileLoader.readTextFileSync(module, "templates/hitlistEntry.html"),
        objectApiTemplate = fileLoader.readTextFileSync(module, "templates/objectApiEntry.html"),
        membersTemplate = fileLoader.readTextFileSync(module, "templates/members.html");

    let docsPanel;

    class DocsPanel {
        constructor() {
            this._visible = false;
            this._searchTimeout = 0;
            this._searchedObjectName = "";
            this._previousSearchedObjectName = "";
            this._toolbarButton = toolbarButton.create();
            this._visibleObjectName = null;
            this._memberSearchString = null;
            this._memberGroupFilter = null;

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

        openPanelWithUi5Object(ui5Object) {
            if (!this.isVisible()) {
                this.showPanel();
            }

            this._elements.searchInputElement.val(ui5Object);
            this._displayObjectApi(ui5Object);
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
                const parts = searchInput.split(" ");
                this._previousSearchedObjectName = this._searchedObjectName;
                this._searchedObjectName = parts[0];

                if (parts.length === 2 && parts[1]) {
                    this._memberSearchString = parts[1];
                    const match = this._memberSearchString.match(/(\?[mpeac])(.*)/i);

                    if (match) {
                        this._memberGroupFilter = match[1].replace("?", "").toLowerCase();
                        const memberSearchPart = match[2].trim();

                        if (memberSearchPart
                            && this._memberGroupFilter !== constants.memberGroupFilter.construct) {

                            this._memberSearchString = memberSearchPart;
                        } else {
                            this._memberSearchString = null;
                        }
                    } else {
                        this._memberGroupFilter = null;
                    }
                } else {
                    if (this._previousSearchedObjectName !== this._searchedObjectName) {
                        this._elements.apiDocsElement.empty();
                        this._visibleObjectName = null;
                    }

                    this._memberSearchString = null;
                    this._memberGroupFilter = null;
                }

                //skip single ? sign
                if (this._memberSearchString === "?") {
                    this._memberSearchString = null;
                }

                const ui5Objects = ui5ApiFinder.findUi5ApiObjects({
                    name: parts[0]
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
                        this._displayObjectApi(ui5Objects[0].name);
                    }
                } else {
                    this._setMessage(strings.NOT_FOUND);
                }

                if (this._visibleObjectName && this._memberSearchString) {
                    this._displayObjectApi(this._visibleObjectName);
                } else if (this._visibleObjectName) {
                    this._displayObjectApi(this._visibleObjectName);
                }

                $("#brackets-ui5-docs-panel-list").scrollTop(0);

            }, 500);
        }

        _resize() {
            const toolbarPx = $("#main-toolbar:visible").width() || 0;
            const size = ($("#brackets-ui5-docs-panel").width() || 0) + toolbarPx;
            $(".content").css("right", `${size}px`);
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
                    path: ui5Object.name
                }));

                htmlElement.on("click", {
                    name: ui5Object.name
                }, (event) => {
                    this._displayObjectApi(event.data.name);
                    this._visibleObjectName = event.data.name;
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
            const apiDocs = this._getDesignApi(ui5ObjectPath);

            if (!apiDocs) {
                this._elements.apiDocsElement.empty();
                this._elements.apiDocsElement.append(`<p style="margin-left: 5px">${strings.DESIGN_API_NOT_FOUND}</p>`);
                return;
            }

            objects.push(this._getDesignApi(ui5ObjectPath));

            const html = Mustache.render(objectApiTemplate, {
                objects,
                strings
            }, {
                membersTemplate
            });

            this._elements.apiDocsElement.empty();
            this._elements.apiDocsElement.append(html);
            this._setMessage(null);
            this._registerUi5ObjectLinkHandlers();
            this._removeEmptyBorrowedSections();
            this._visibleObjectName = ui5ObjectPath;
        }

        _getDesignApi(ui5ObjectPath) {
            let designApi = ui5ApiService.getUi5ObjectDesignApi(ui5ObjectPath);

            if (!designApi) {
                return;
            }

            if (this._memberSearchString || this._memberGroupFilter) {
                designApi = ui5ApiFormatter.filterApiMembers(designApi, this._memberSearchString, this._memberGroupFilter);
            }

            designApi = ui5ApiFormatter.getFormattedObjectApi(designApi, true, true);

            return designApi;
        }

        _removeEmptyBorrowedSections() {
            const inheritedElements = jQuery(".brackets-ui5-docs-panel-borrowed");

            inheritedElements.each((index, element) => {
                if ($(element).children().length === 1) {
                    $(element).hide();
                }
            });
        }

        _registerUi5ObjectLinkHandlers() {
            const objectNameLink = this._elements.apiDocsElement.find(".brackets-ui5-docs-panel-name");
            objectNameLink.on("click", (event) => {
                codeEditor.insertAtPosition(this._prepareInsertName(event));
            });

            objectNameLink.on("contextmenu", (event) => {
                NativeApp.openURLInDefaultBrowser($(event.target).attr("data-apiDocUrl"));
            });

            this._elements.apiDocsElement.find("#brackets-ui5-docs-panel-insert-define-link").on("click", (event) => {
                codeEditor.insertInDefine(this._prepareInsertName(event));
            });

            this._elements.apiDocsElement.find("#brackets-ui5-docs-panel-insert-replace-link").on("click", (event) => {
                codeEditor.insertWithSlash(this._prepareInsertName(event));
            });

            this._elements.apiDocsElement.on("click", ".brackets-ui5-docs-panel-expand-link", (event) => {
                this._handleExpandCollapse($(event.target));
            });

            this._elements.apiDocsElement.on("click", ".brackets-ui5-docs-panel-return-type-link", (event) => {
                this._displayObjectApi($(event.target).attr("data-object-name"));
            });

            const extendsLinkElement = this._elements.apiDocsElement.find("#brackets-ui5-docs-panel-extends-link");

            if (extendsLinkElement) {
                extendsLinkElement.on("click", () => {
                    this._displayObjectApi($(event.target).text().trim());
                });
            }
        }

        _prepareInsertName(event) {
            let name = $(event.target).attr("data-name");

            if (name.indexOf("module:") !== -1) {
                name = ui5ApiFormatter.convertModuleNameToPath(name);
            }

            return name;
        }

        _unregisterUi5ObjectLinkHandlers() {
            this._elements.apiDocsElement.off("click", ".brackets-ui5-docs-panel-name");
            this._elements.apiDocsElement.off("click", ".brackets-ui5-docs-panel-expand-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-docs-panel-extends-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-docs-panel-insert-define-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-panel-insert-path-link");
            this._elements.apiDocsElement.off("click", "#brackets-ui5-docs-panel-insert-replace-link");
        }

        _handleExpandCollapse(linkElement) {
            const targetElementId = linkElement.attr("data-target-description");
            const sign = linkElement.text().trim();
            const descriptionElement = $(document.getElementById(targetElementId));

            if (sign === "[+]") {
                linkElement.text("[-]");
                descriptionElement.show();
                descriptionElement.children().show();
            } else {
                linkElement.text("[+]");
                descriptionElement.hide();
                descriptionElement.children().hide();
            }
        }
    }

    function create() {
        if (!docsPanel) {
            docsPanel = new DocsPanel();
        }

        return docsPanel;
    }

    function destroy() {
        if (docsPanel) {
            docsPanel = null;
        }
    }

    exports.create = create;
    exports.destroy = destroy;

    exports.get = () => {
        return docsPanel;
    };
});

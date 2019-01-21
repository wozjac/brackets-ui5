define((require, exports, module) => {
    "use strict";

    const LanguageManager = brackets.getModule("language/LanguageManager"),
        DocumentManager = brackets.getModule("document/DocumentManager"),
        WorkspaceManager = brackets.getModule("view/WorkspaceManager"),
        Editor = brackets.getModule("editor/Editor").Editor,
        EditorManager = brackets.getModule("editor/EditorManager"),
        MainViewManager = brackets.getModule("view/MainViewManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        FileSystem = brackets.getModule("filesystem/FileSystem");

    const EDITOR_USE_TABS = false,
        EDITOR_SPACE_UNITS = 4;

    function createMockActiveDocument(options) {
        const filename = options.filename,
            content = options.content || "";

        // Use unique filename to avoid collissions in open documents list
        const dummyFile = FileSystem.getFileForPath(filename);
        const docToShim = new DocumentManager.Document(dummyFile, new Date(), content);

        // Prevent adding doc to working set by not dispatching "dirtyFlagChange".
        // Other functionality here needs to be kept in sync with Document._handleEditorChange().
        // we should fix things so that we either don't need mock documents or that this
        // is factored so it will just run in both.
        docToShim._handleEditorChange = function (event, editor, changeList) {
            this.isDirty = !editor._codeMirror.isClean();
            this._notifyDocumentChange(changeList);
        };

        docToShim.notifySaved = function () {
            throw new Error("Cannot notifySaved() a unit-test dummy Document");
        };

        return docToShim;
    }

    function createMockDocument(initialContent, languageId, filename) {
        const language = LanguageManager.getLanguage(languageId) || LanguageManager.getLanguage("javascript");
        if (!filename) {
            filename = `${ExtensionUtils.getModulePath(module)}12345.${language._fileExtensions[0]}`;
        }

        const options = {
            language,
            content: initialContent,
            filename
        };

        const docToShim = createMockActiveDocument(options);

        // Prevent adding doc to global 'open docs' list; prevents leaks or collisions if a test
        // fails to clean up properly (if test fails, or due to an apparent bug with afterEach())
        docToShim.addRef = function () {};
        docToShim.releaseRef = function () {};
        docToShim._ensureMasterEditor = function () {
            if (!this._masterEditor) {
                // Don't let Document create an Editor itself via EditorManager; the unit test can't clean that up
                throw new Error("Use create/destroyMockEditor() to test edit operations");
            }
        };

        return docToShim;
    }

    function createMockElement() {
        return $("<div/>")
            .css({
                position: "absolute",
                left: "-10000px",
                top: "-10000px"
            })
            .appendTo($("body"));
    }

    function createEditorInstance(doc, pane, visibleRange) {
        const $editorHolder = pane.$el || pane; // To handle actual pane mock or a fake container
        const editor = new Editor(doc, true, $editorHolder.get(0), visibleRange);

        Editor.setUseTabChar(EDITOR_USE_TABS);
        Editor.setSpaceUnits(EDITOR_SPACE_UNITS);

        if (pane.addView) {
            pane.addView(editor);
            editor._paneId = pane.id;
        }

        EditorManager._notifyActiveEditorChanged(editor);

        return editor;
    }

    function createMockEditorForDocument(doc, visibleRange) {
        // Initialize EditorManager/WorkspaceManager and position the editor-holder offscreen
        // (".content" may not exist, but that's ok for headless tests where editor height doesn't matter)
        const $editorHolder = createMockElement().css("width", "1000px").attr("id", "hidden-editors");
        WorkspaceManager._setMockDOM($(".content"), $editorHolder);

        // create Editor instance
        return createEditorInstance(doc, $editorHolder, visibleRange);
    }

    function createMockEditor(initialContent, languageId, visibleRange) {
        // create dummy Document, then Editor tied to it
        const doc = createMockDocument(initialContent, languageId);
        return {
            doc,
            editor: createMockEditorForDocument(doc, visibleRange)
        };
    }

    function destroyMockEditor(doc) {
        EditorManager._notifyActiveEditorChanged(null);
        MainViewManager._destroyEditorIfNotNeeded(doc);

        // Clear editor holder so EditorManager doesn't try to resize destroyed object
        $("#hidden-editors").remove();
    }

    function mockCurrentDocument(code) {
        spyOn(DocumentManager, "getCurrentDocument").andCallFake(() => {
            return createMockDocument(code, "javascript");
        });
    }

    exports.createMockDocument = createMockDocument;
    exports.createMockEditor = createMockEditor;
    exports.destroyMockEditor = destroyMockEditor;
    exports.mockCurrentDocument = mockCurrentDocument;
});

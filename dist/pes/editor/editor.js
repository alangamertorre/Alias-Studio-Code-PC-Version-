window.iniciarEditor = async function () {
  const editores = document.querySelectorAll(".editor");
  const editor = [...editores].find((el) => !el.dataset.monacoInit);

  if (!editor) {
    return;
  }

  editor.dataset.monacoInit = "true";

  function crearEditor() {
    monaco.editor.defineTheme("ac-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#121314" },
    });

    window.editorInstances = window.editorInstances || {};
    window.editorInstances[editor.id] = monaco.editor.create(editor, {
      value: "",
      language: "plaintext",
      theme: "ac-dark",
      automaticLayout: true,
      lineNumbersMinChars: 3,
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 0,
    });
  }

  if (!window.__monacoRequireConfig) {
    window.__monacoRequireConfig = true;
    require.config({
      paths: { vs: "./vs" },
      ignoreDuplicateModules: ["vs/editor/editor.main"],
    });
    window.MonacoEnvironment = {
      getWorkerUrl: function () {
        return `data:text/javascript;charset=utf-8,
          self.MonacoEnvironment = { baseUrl: './vs/' };
          importScripts('./vs/base/worker/workerMain.js');`;
      },
    };
  }

  if (window.monaco) {
    crearEditor();
  } else {
    require(["vs/editor/editor.main"], crearEditor);
  }
};

window.iniciarEditor();

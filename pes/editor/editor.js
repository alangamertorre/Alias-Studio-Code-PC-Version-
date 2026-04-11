(function () {
  if (window.__monacoInit) return;
  window.__monacoInit = true;

  require.config({
    paths: { vs: "./vs" },
    // ✅ Esto suprime el warning de módulo duplicado
    ignoreDuplicateModules: ["vs/editor/editor.main"],
  });

  window.MonacoEnvironment = {
    getWorkerUrl: function () {
      return `data:text/javascript;charset=utf-8,
        self.MonacoEnvironment = { baseUrl: './vs/' };
        importScripts('./vs/base/worker/workerMain.js');`;
    },
  };

  require(["vs/editor/editor.main"], function () {
    window.editorInstance = monaco.editor.create(
      document.getElementById("editor"),
      {
        value: "",
        language: "plaintext",
        theme: "vs-dark",
        automaticLayout: true,

        lineNumbersMinChars: 3,
        glyphMargin: false,
        folding: false,
        lineDecorationsWidth: 0,
      },
    );
  });
})();

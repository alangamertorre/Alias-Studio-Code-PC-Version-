document.addEventListener("DOMContentLoaded", () => {
  const { invoke } = window.__TAURI_INTERNALS__;
  const cerrarBtn = document.getElementById("btn-close");
  const minimizarBtn = document.getElementById("btn-min");
  const btn_aux = document.getElementById("btn-maximize");
  const maximizarBtn = document.getElementById("btn-max");
  // Cerrar ventana
  cerrarBtn?.addEventListener("click", async () => {
    await invoke("plugin:window|close");
  });
  // Minimizar ventana
  minimizarBtn?.addEventListener("click", async () => {
    await invoke("plugin:window|minimize");
  });
  // Maximizar / restaurar ventana
  let minimizada = false;
  maximizarBtn?.addEventListener("click", async () => {
    if (!minimizada) {
      btn_aux.style.backgroundImage = "img/bar-sis-no-full.svg";
      await invoke("plugin:window|maximize");
      minimizada = true;
    } else {
      btn_aux.style.backgroundImage = "img/bar-sis-maximize.svg";
      await invoke("plugin:window|unmaximize");
      minimizada = false;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar elementos existentes
  const caja1 = document.querySelector(".caja1-np");
  const caja2 = document.querySelector(".caja2-np");
  const logo = document.querySelector(".logo-np");
  const txtContent = document.querySelector(".txt-content1-np");
  const h1 = document.querySelector(".h1-np");
  const h2 = document.querySelector(".h2-np");
  const contArch = document.querySelector(".cont-arch-np");

  // Obtener o crear slots para archivos recientes (modificar futuramente)
  let slots = contArch ? Array.from(contArch.querySelectorAll("p")) : [];
  if (contArch && slots.length === 0) {
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("p");
      p.id = `a${i + 1}`;
      contArch.appendChild(p);
      slots.push(p);
    }
  }

  // Renderizador de la lista en los slots
  function renderRecent(list) {
    if (!slots.length) return;
    if (!list || list.length === 0) {
      slots.forEach(
        (p, i) => (p.textContent = i === 0 ? "Sin archivos recientes" : ""),
      );
      return;
    }
    slots.forEach((p, i) => {
      const name = list[i] || "";
      p.textContent = name;
      p.style.cursor = name ? "pointer" : "default";
      p.onclick = name ? () => console.log("Abrir archivo:", name) : null;
    });
  }

  // Cargar desde localStorage y renderizar
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem("recentFiles") || "[]");
  } catch (e) {
    recent = [];
  }
  renderRecent(recent.slice(0, 8));

  // Funciones públicas para gestionar recientes
  window.addRecentFile = function (name) {
    if (!name) return;
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem("recentFiles") || "[]");
    } catch (e) {
      list = [];
    }
    const updated = [name, ...list.filter((x) => x !== name)].slice(0, 50);
    localStorage.setItem("recentFiles", JSON.stringify(updated));
    renderRecent(updated.slice(0, 8));
  };

  window.clearRecentFiles = function () {
    localStorage.removeItem("recentFiles");
    renderRecent([]);
  };
});

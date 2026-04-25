//----------------------------
// DOM
//----------------------------
const barra1 = document.querySelector(".barra1");

const todos_btn_barra1 = document.querySelectorAll(".btn");
const Archivos = document.getElementById("archivos");
const Busqueda = document.getElementById("busqueda");
const GH = document.getElementById("gh");
const IA = document.getElementById("ia");
const Complementos = document.getElementById("complementos");
const Lenguaje = document.getElementById("lenguaje");

const InfoCode = document.querySelector(".InfoDelCodigo");

const barra3 = document.querySelector(".barra3");
const margen2 = document.querySelector(".margen2");
const crearPestana = document.querySelector(".crear-pestaña");
const limpiarPestana = document.querySelector(".limpiar-pestaña");

const cajaVisualizacion = document.querySelector(".caja-visualizacion");

const barra4 = document.querySelector(".barra4");
const ancho_barra4 = document.querySelector(".w-bar");
const function_btn1 = document.querySelector(".func-btn1");
const menu_btn1 = document.querySelectorAll(".y");
const btn1_open = document.getElementById("btn1-open");

// IDs únicos
const btn_open_barra4 = document.getElementById("btn-open-barra4");
const btn_open = document.querySelectorAll(".btn-open-inicio");

const opt1_btn_open = document.querySelectorAll(".opt1-btn-open");
const opt2_btn_open = document.querySelectorAll(".opt2-btn-open");

const txt_adv = document.querySelectorAll(".txt-adv");
const txt_adv1 = document.getElementById("txt_adv1");
const txt_adv2 = document.getElementById("txt_adv2");
const txt_adv3 = document.getElementById("txt_adv3");

const btn_min = document.getElementById("btn-min");
const btn_max = document.getElementById("btn-max");
const btn_close = document.getElementById("btn-close");

//----------------------------
// Estado de pestañas
//----------------------------
let tp_pes = null;
let pestanaActiva = null;

//----------------------------
// Crear elemento visualizador en el DOM según tipo
//----------------------------
let tipoSintetizado;
async function crearElementoVisualizador(tipo, pestanaId) {
  const el = document.createElement("div");
  el.className = "visualizador";

  tipoSintetizado = tipo === "n_pes" ? "n-pes" : "editor";
  el.id = `vis-${tipoSintetizado}-${pestanaId}`;

  el.innerHTML =
    tipo === "n_pes"
      ? `
    <div class="caja1-np">
      <div class="logo-np"></div>
      <div class="txt-content1-np">
        <h1 class="h1-np">¿En qué trabajaremos?</h1>
        <h2 class="h2-np" style="font-size:larger;">Alias Studio Code</h2>
        <button class="btn-open-inicio">
          Abrir carpeta
          <div class="btn-open2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              aria-hidden="true" class="svg-btn-open">
              <polyline points="6,10 12,16 18,10" fill="none" stroke="white"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </button>
        <div class="menu-des-btn-open">
          <button class="opt1-btn-open">Abrir archivo</button>
          <div style="height:1px;width:100%;background-color:rgba(21,50,78,0.959)" class="lin-barra4"></div>
          <button class="opt2-btn-open">Abrir proyecto</button>
        </div>
      </div>
    </div>
    <div class="caja2-np">
      <h2 class="txt-h2-files-np">Archivos recientes</h2>
      <div class="cont-arch-np">
        ${Array.from({ length: 8 }, (_, i) => `<p id="a${i + 1}"></p>`).join("")}
      </div>
    </div>
  `
      : `
     <div class="editor" id="editor-${pestanaId}" style="width:100%; height:100%;"></div>;
  `;

  cajaVisualizacion.appendChild(el);

  if (tipo === "editor") {
    if (window.iniciarEditor) {
      window.iniciarEditor();
    } else {
      await import("./pes/editor/editor.js");
    }
  }

  return el;
}

function getVisualizador(tipo, pestanaId) {
  return crearElementoVisualizador(tipo, pestanaId);
}

//----------------------------
// Mostrar visualizador con animación
//----------------------------
function mostrarVisualizador(tipo, pestanaId) {
  const tipoSint = tipo === "n_pes" ? "n-pes" : "editor";
  const element = document.getElementById(`vis-${tipoSint}-${pestanaId}`);
  if (!element) return;

  element.style.display = "flex";
  element.style.opacity = 0;

  anime({
    targets: element,
    duration: 200,
    opacity: [0, 1],
    easing: "easeInOutQuad",
    complete: () => {
      // Forzar layout de Monaco si hay una instancia en este visualizador
      const editorEl = element.querySelector(".editor");
      if (editorEl && editorEl.id && window.editorInstances?.[editorEl.id]) {
        window.editorInstances[editorEl.id].layout();
      }
    },
  });
}

//----------------------------
// Ocultar visualizador con animación
//----------------------------
function ocultarVisualizador(tipo, pestanaId) {
  const tipoSint = tipo === "n_pes" ? "n-pes" : "editor";
  const element = document.getElementById(`vis-${tipoSint}-${pestanaId}`);
  if (!element) return;

  anime({
    targets: element,
    duration: 200,
    opacity: [1, 0],
    easing: "easeInOutQuad",
    complete: () => {
      element.style.display = "none";
    },
  });
}

//----------------------------
// Actualizar visualizador
//----------------------------
function actualizarVisualizador(animar = false) {
  const hayPestañas = document.querySelectorAll(".pestaña").length > 0;
  if (!hayPestañas || !pestanaActiva) {
    document.querySelectorAll(".visualizador").forEach((vis) => {
      vis.style.display = "none";
      vis.style.opacity = 0;
    });
    return;
  }

  const id = pestanaActiva.dataset.id;
  const tipo = pestanaActiva.dataset.tipo;
  const tipoSint = tipo === "n_pes" ? "n-pes" : "editor";
  const idActivo = `vis-${tipoSint}-${id}`;

  // Ocultar todos los que no sean el activo — fuera del flujo
  document.querySelectorAll(".visualizador").forEach((vis) => {
    if (vis.id !== idActivo) {
      vis.style.display = "none";
      vis.style.opacity = 0;
    }
  });

  // Mostrar el activo
  if (animar) {
    mostrarVisualizador(tipo, id);
  } else {
    const el = document.getElementById(idActivo);
    if (el) {
      el.style.display = "flex";
      el.style.opacity = 1;
    }
  }
}

//----------------------------
// Seleccionar pestaña activa
//----------------------------
function seleccionarPestana(pestana) {
  document
    .querySelectorAll(".pestaña")
    .forEach((p) => p.classList.remove("activa"));

  pestana.classList.add("activa");
  pestanaActiva = pestana;
  tp_pes = pestana.dataset.tipo;

  actualizarVisualizador(false);
}

//----------------------------
// Crear nueva pestaña
//----------------------------
let pestanaCounter = 0;

function crearNuevaPestana(tp) {
  const pestanaId = ++pestanaCounter;
  const esPrimera = document.querySelectorAll(".pestaña").length === 0;

  const nuevaPestana = document.createElement("div");
  nuevaPestana.className = "pestaña";
  nuevaPestana.dataset.id = pestanaId;
  nuevaPestana.dataset.tipo = tp;

  const btnCerrar = document.createElement("div");
  btnCerrar.className = "BtnPestaña";

  const texto = document.createElement("span");
  texto.textContent = tp === "n_pes" ? "Nueva Pestaña" : "Editor";

  const icono = document.createElement("div");
  icono.className = "iconoNPestaña";

  nuevaPestana.appendChild(btnCerrar);
  nuevaPestana.appendChild(texto);
  nuevaPestana.appendChild(icono);

  barra3.insertBefore(nuevaPestana, margen2);

  getVisualizador(tp, pestanaId);

  pestanaActiva = nuevaPestana;
  tp_pes = tp;
  document
    .querySelectorAll(".pestaña")
    .forEach((p) => p.classList.remove("activa"));
  nuevaPestana.classList.add("activa");

  actualizarVisualizador(esPrimera);

  nuevaPestana.addEventListener("click", () =>
    seleccionarPestana(nuevaPestana),
  );

  anime({
    targets: nuevaPestana,
    translateX: [-(nuevaPestana.offsetWidth + 50), 0],
    opacity: [0, 1],
    duration: 400,
    easing: "easeInOutQuad",
  });

  btnCerrar.addEventListener("click", (e) => {
    e.stopPropagation();
    eliminarPestana(nuevaPestana);
  });
}

//----------------------------
// Eliminar una pestaña concreta
//----------------------------
function eliminarPestana(pestana) {
  const eraActiva = pestana === pestanaActiva;

  const tipo = pestana.dataset.tipo;
  const id = pestana.dataset.id;
  const tipoSintetizado = tipo === "n_pes" ? "n-pes" : "editor";
  const visualizador = document.getElementById(`vis-${tipoSintetizado}-${id}`);
  const pestañas = document.querySelectorAll(".pestaña");

  // Cambiar pestaña activa ANTES de animar, para que el visualizador aparezca ya
  if (eraActiva) {
    const restantes = [...pestañas].filter((p) => p !== pestana);
    if (restantes.length > 0) {
      seleccionarPestana(restantes[restantes.length - 1]);
    } else {
      pestanaActiva = null;
      tp_pes = null;
    }
  }

  // Animar y eliminar el visualizador
  if (visualizador) {
    if (pestañas.length <= 1) {
      anime({
        targets: visualizador,
        duration: 400,
        opacity: [1, 0],
        easing: "easeInOutQuad",
        complete: () => visualizador.remove(),
      });
    } else {
      visualizador.remove();
    }
  }

  // Animar y eliminar la pestaña
  anime({
    targets: pestana,
    translateX: -(pestana.offsetWidth + 50),
    opacity: [1, 0],
    duration: 400,
    easing: "easeInOutQuad",
    complete: () => {
      pestana.remove();

      const restantes = document.querySelectorAll(".pestaña");
      if (restantes.length === 0) {
        actualizarVisualizador(true);
      }

      anime({
        targets: restantes,
        translateX: -pestana.offsetWidth,
        duration: 400,
        easing: "easeInOutQuad",
      });
    },
  });
}

//----------------------------
// Evento crear pestaña
//----------------------------
crearPestana.addEventListener("click", () => crearNuevaPestana("n_pes"));

//----------------------------
// Atajos de teclado
//----------------------------
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && !e.altKey && e.key.toLowerCase() === "t") {
    e.preventDefault();
    crearNuevaPestana("n_pes");
  }
  if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "t") {
    e.preventDefault();
    crearNuevaPestana("editor");
  }
  if (e.ctrlKey && e.key.toLowerCase() === "w") {
    e.preventDefault();
    e.stopPropagation();
    if (pestanaActiva) eliminarPestana(pestanaActiva);
  }
  if (e.ctrlKey && !e.altKey) {
    const num = parseInt(e.key);
    if (!isNaN(num) && num >= 1) {
      e.preventDefault();
      const pestañas = document.querySelectorAll(".pestaña");
      const pestana = pestañas[num - 1]; // Ctrl+1 → índice 0
      if (pestana) seleccionarPestana(pestana);
    }
  }
});

//----------------------------
// Limpiar todas las pestañas
//----------------------------
let animacionLimpiar = false;

limpiarPestana.addEventListener("click", () => {
  if (animacionLimpiar) return;
  animacionLimpiar = true;

  const pestañas = document.querySelectorAll(".pestaña");
  const visualizador = document.querySelectorAll(".visualizador");
  visualizador.forEach((el) => {
    anime({
      targets: el,
      duration: 400,
      opacity: [1, 0],
      complete: () => {
        el.remove();
      },
    });
  });

  anime({
    targets: pestañas,
    translateX: (p) => -(p.offsetWidth + 50),
    opacity: 0,
    duration: 400,
    easing: "easeInOutQuad",
    complete: () => {
      pestañas.forEach((p) => p.remove());
      pestanaActiva = null;
      tp_pes = null;
      animacionLimpiar = false;
      actualizarVisualizador(true);
    },
  });
});

//----------------------
// Sistema barra 4 — resize
//----------------------
let mouse_barra4 = false;

ancho_barra4.addEventListener("mousedown", () => {
  mouse_barra4 = true;
});

document.addEventListener("mousemove", (e) => {
  if (!mouse_barra4) return;
  let nuevoAncho = e.clientX - barra4.offsetLeft;
  if (nuevoAncho < 120) nuevoAncho = 120;
  if (nuevoAncho > window.innerWidth * 0.8)
    nuevoAncho = window.innerWidth * 0.8;
  barra4.style.width = nuevoAncho + "px";
});

document.addEventListener("mouseup", () => {
  mouse_barra4 = false;
});

//----------------------
// Barra lateral (estilo VS Code)
//----------------------
const CLAVES_PANEL = [
  "archivos",
  "busqueda",
  "gh",
  "ia",
  "complementos",
  "lenguaje",
];
const elementosPaneles = [Archivos, Busqueda, GH, IA, Complementos, Lenguaje];

let barra4_abierta = false;
let panelActivo = null;
let animando = false;

todos_btn_barra1.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    if (animando) return;
    const panelClickado = CLAVES_PANEL[index];
    if (!barra4_abierta) {
      abrirBarra4(panelClickado);
    } else if (panelActivo === panelClickado) {
      cerrarBarra4();
    } else {
      cambiarPanel(panelClickado);
    }
  });
});

elementosPaneles.forEach((el, index) => {
  el.addEventListener("click", () => {
    if (animando) return;
    cambiarPanel(CLAVES_PANEL[index]);
  });
});

function abrirBarra4(panel) {
  animando = true;
  panelActivo = panel;
  barra4.style.display = "flex";
  actualizarUI();

  anime({
    targets: barra4,
    duration: 400,
    opacity: [0, 1],
    translateX: [-150, 0],
    easing: "easeInOutQuad",
    complete: () => {
      barra4_abierta = true;
      animando = false;
    },
  });
}

function cerrarBarra4() {
  animando = true;

  anime({
    targets: barra4,
    duration: 400,
    opacity: [1, 0],
    translateX: -150,
    easing: "easeInOutQuad",
    complete: () => {
      barra4.style.display = "none";
      barra4_abierta = false;
      panelActivo = null;
      animando = false;
      actualizarUI();
    },
  });
}

function cambiarPanel(panel) {
  panelActivo = panel;
  actualizarUI();
}

function actualizarUI() {
  function_btn1.style.display = panelActivo === "archivos" ? "flex" : "none";
  elementosPaneles.forEach((el, index) => {
    el.classList.toggle(
      "panel-activo",
      CLAVES_PANEL[index] === panelActivo && barra4.style.display === "flex",
    );
  });
}

//------------------------
// Menu desplegable btn 1
//------------------------
menu_btn1.forEach((btn1) => {
  let abierto = false;

  btn1.addEventListener("click", () => {
    const contenedor = btn1.closest(".btn1-c");
    const txt = contenedor.querySelector(".txt-adv");
    const btnOpen = contenedor.querySelector("#btn-open-barra4");
    if (!txt) return;

    if (!abierto) {
      txt.style.display = "flex";
      if (btnOpen) btnOpen.style.display = "flex";
      anime.remove(btn1);
      if (btnOpen) anime.remove(btnOpen);
      anime.remove(txt);
      anime({
        targets: btn1,
        rotate: 180,
        duration: 200,
        easing: "easeInOutQuad",
      });
      anime({
        targets: txt,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 200,
        easing: "easeOutQuad",
      });
      anime({
        targets: btnOpen,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 200,
        easing: "easeOutQuad",
      });
      abierto = true;
    } else {
      anime.remove(btn1);
      if (btnOpen) anime.remove(btnOpen);
      anime.remove(txt);
      anime({
        targets: btn1,
        rotate: 0,
        duration: 200,
        easing: "easeInOutQuad",
      });
      anime({
        targets: txt,
        opacity: [1, 0],
        translateY: [0, -10],
        duration: 200,
        easing: "easeInQuad",
        complete: () => {
          txt.style.display = "none";
        },
      });
      if (btnOpen) {
        anime({
          targets: btnOpen,
          opacity: [1, 0],
          translateY: [0, -10],
          duration: 200,
          easing: "easeInQuad",
          complete: () => {
            btnOpen.style.display = "none";
          },
        });
      }
      abierto = false;
    }
  });
});

//-------------------------
// Menu desplegable btn open
//-------------------------

// Btn barra 4
const btn_open2_barra4 = barra4.querySelector(".btn-open2");
btn_open2_barra4.addEventListener("click", (e) => {
  e.stopPropagation();

  const contenedor = btn_open2_barra4.closest(
    ".txt-adv-btn1, .txt-content1-np",
  );
  const menu = contenedor?.querySelector(".menu-des-btn-open");
  const svg = btn_open2_barra4.querySelector(".svg-btn-open");
  if (!menu || !svg) return;

  const isVisible = menu.style.display === "flex";

  if (!isVisible) {
    menu.style.display = "flex";
    anime({
      targets: svg,
      rotate: [180, 0],
      duration: 310,
      easing: "easeInOutQuad",
    });
    anime({
      targets: menu,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
    });
  } else {
    anime({
      targets: svg,
      rotate: [0, 180],
      duration: 310,
      easing: "easeInOutQuad",
    });
    anime({
      targets: menu,
      translateY: [0, -50],
      opacity: [1, 0],
      duration: 300,
      easing: "easeInOutQuad",
      complete: () => {
        menu.style.display = "none";
      },
    });
  }
});

// Btns visualizador (dinámicos) — delegación en document

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-open2");
  if (!btn) return;
  if (btn === btn_open2_barra4) return;

  e.stopPropagation();

  const btnPadre = btn.closest("button");
  const contenedor = btnPadre?.parentElement;
  const menu = contenedor?.querySelector(":scope > .menu-des-btn-open");
  const svg = btn.querySelector(".svg-btn-open");
  if (!menu || !svg) return;

  // Leer estado real del DOM, no del WeakMap
  const isVisible =
    parseFloat(menu.style.opacity) > 0 ||
    (menu.style.display === "flex" && menu.style.opacity !== "0");

  if (!isVisible) {
    menu.style.display = "flex";
    anime({
      targets: svg,
      rotate: [180, 0],
      duration: 310,
      easing: "easeInOutQuad",
    });
    anime({
      targets: menu,
      translateY: [-50, 0],
      opacity: [0, 1],
      duration: 300,
      easing: "easeInOutQuad",
    });
  } else {
    anime({
      targets: svg,
      rotate: [0, 180],
      duration: 310,
      easing: "easeInOutQuad",
    });
    anime({
      targets: menu,
      translateY: [0, -50],
      opacity: [1, 0],
      duration: 300,
      easing: "easeInOutQuad",
      complete: () => {
        menu.style.display = "none";
        menu.style.opacity = "0";
      },
    });
  }
});
//-------------------------
// Sistema cambio nombre de la selección
//-------------------------
function actualizarBoton(btn, nuevoTexto) {
  if (!btn) return;
  const nodoTexto = [...btn.childNodes].find(
    (n) => n.nodeType === Node.TEXT_NODE,
  );
  if (nodoTexto) nodoTexto.textContent = nuevoTexto;
}

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".opt1-btn-open, .opt2-btn-open");
  if (!btn) return;

  e.stopPropagation();

  const textoAccion = btn.firstChild.textContent.trim();

  const contenedor = btn.closest(".txt-adv-btn1, .txt-content1-np");
  if (!contenedor) return;

  const botonRelacionado = contenedor.querySelector(
    "#btn-open-barra4, .btn-open-inicio",
  );
  if (!botonRelacionado) return;

  const nodoTextoBtnRel = [...botonRelacionado.childNodes].find(
    (n) => n.nodeType === Node.TEXT_NODE,
  );
  btn.firstChild.textContent = nodoTextoBtnRel
    ? nodoTextoBtnRel.textContent.trim()
    : "";
  actualizarBoton(botonRelacionado, textoAccion);

  if (textoAccion === "Abrir archivo") {
    crearNuevaPestana("editor");
  } else if (textoAccion === "Abrir carpeta") {
    // acción carpeta
  } else if (textoAccion === "Abrir proyecto") {
    // futuro
  } else {
    console.error("code=1: Opción desconocida:", textoAccion);
  }
});

document.addEventListener("click", (e) => {
  const botonRelacionado = e.target.closest(
    "#btn-open-barra4, .btn-open-inicio",
  );
  if (!botonRelacionado) return;
  if (e.target.closest(".btn-open2")) return; // lo maneja el listener del desplegable

  e.stopPropagation();

  const nodoTexto = [...botonRelacionado.childNodes].find(
    (n) => n.nodeType === Node.TEXT_NODE,
  );
  const textoAccion = nodoTexto ? nodoTexto.textContent.trim() : "";

  if (textoAccion === "Abrir archivo") {
    crearNuevaPestana("editor");
  } else if (textoAccion === "Abrir carpeta") {
    // acción carpeta
  } else if (textoAccion === "Abrir proyecto") {
    // futuro
  } else {
    console.error("code=1: Opción desconocida:", textoAccion);
  }
});

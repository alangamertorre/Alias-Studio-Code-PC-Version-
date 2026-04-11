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

const barra3 = document.querySelector(".barra3");
const margen2 = document.querySelector(".margen2");
const crearPestana = document.querySelector(".crear-pestaña");
const limpiarPestana = document.querySelector(".limpiar-pestaña");

const visualizador_nv_pes = document.getElementById("vis-n-pes");
const visualizador_editor = document.getElementById("vis-editor");

const barra4 = document.querySelector(".barra4");
const ancho_barra4 = document.querySelector(".w-bar");
const function_btn1 = document.querySelector(".func-btn1");
const menu_btn1 = document.querySelectorAll(".y");
const btn1_open = document.getElementById("btn1-open");

const btn_open_barra4 = document.querySelector("button.txt-adv");
const btn_open = document.getElementById("btn-open");
const menu_btn_open = document.querySelectorAll(".btn-open2");

const opt1_btn_open = document.querySelectorAll(".opt1-btn-open");
const opt2_btn_open = document.querySelectorAll(".opt2-btn-open");

const txt_adv = document.querySelectorAll(".txt-adv");
const txt_adv1 = document.getElementById("txt_adv1");
const txt_adv2 = document.getElementById("txt_adv2");
const txt_adv3 = document.getElementById("txt_adv3");

const btn_min = document.getElementById("btn-min");
const btn_max = document.getElementById("btn-max");
const btn_close = document.getElementById("btn-close");

//---------------
// Arreglo bugs
//---------------

//----------------------------
// Estado de pestañas
//----------------------------
let tp_pes = null;
let pestanaActiva = null;

//----------------------------
// Mostrar visualizador con animación (solo al abrir primera pestaña)
//----------------------------
function mostrarVisualizador(element) {
  element.style.display = "flex";
  element.style.opacity = 0;

  anime({
    targets: element,
    duration: 200,
    opacity: [0, 1],
    easing: "easeInOutQuad",
  });
}

//----------------------------
// Ocultar visualizador con animación (solo al cerrar todas las pestañas)
//----------------------------
function ocultarVisualizador(element) {
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
// Cambiar visualizador SIN animación (al cambiar de pestaña)
//----------------------------
function actualizarVisualizador(animar = false) {
  const hayPestañas = document.querySelectorAll(".pestaña").length > 0;

  const mostrar_nv_pes = hayPestañas && tp_pes === "n_pes";
  const mostrar_editor = hayPestañas && tp_pes === "editor";

  if (animar) {
    // con animación: solo al abrir primera pestaña o cerrar todas
    if (mostrar_nv_pes) {
      mostrarVisualizador(visualizador_nv_pes);
      visualizador_editor.style.display = "none";
    } else if (mostrar_editor) {
      mostrarVisualizador(visualizador_editor);
      visualizador_nv_pes.style.display = "none";
    } else {
      // no hay pestañas
      ocultarVisualizador(visualizador_nv_pes);
      ocultarVisualizador(visualizador_editor);
    }
  } else {
    // sin animación: cambio directo
    visualizador_nv_pes.style.display = mostrar_nv_pes ? "flex" : "none";
    visualizador_editor.style.display = mostrar_editor ? "flex" : "none";
  }
}

//----------------------------
// Seleccionar pestaña activa
//----------------------------
function seleccionarPestana(pestana) {
  document.querySelectorAll(".pestaña").forEach((p) => {
    p.classList.remove("activa");
  });

  pestana.classList.add("activa");
  pestanaActiva = pestana;
  tp_pes = pestana.dataset.tipo;

  actualizarVisualizador(false); // sin animación
}

//----------------------------
// Crear nueva pestaña
//----------------------------
function crearNuevaPestana(tp) {
  const esPrimera = document.querySelectorAll(".pestaña").length === 0;

  const nuevaPestana = document.createElement("div");
  nuevaPestana.className = "pestaña";
  nuevaPestana.dataset.tipo = tp;

  const btnCerrar = document.createElement("div");
  btnCerrar.className = "BtnPestaña";

  const texto = document.createElement("span");
  if (tp === "n_pes") {
    texto.textContent = "Nueva Pestaña";
  } else if (tp === "editor") {
    texto.textContent = "Editor";
  }

  const icono = document.createElement("div");
  icono.className = "iconoNPestaña";

  nuevaPestana.appendChild(btnCerrar);
  nuevaPestana.appendChild(texto);
  nuevaPestana.appendChild(icono);

  barra3.insertBefore(nuevaPestana, margen2);

  // seleccionar sin animación, luego animar si es la primera
  pestanaActiva = nuevaPestana;
  tp_pes = tp;
  document
    .querySelectorAll(".pestaña")
    .forEach((p) => p.classList.remove("activa"));
  nuevaPestana.classList.add("activa");

  actualizarVisualizador(esPrimera); // animar solo si es la primera

  nuevaPestana.addEventListener("click", () => {
    seleccionarPestana(nuevaPestana);
  });

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

  anime({
    targets: pestana,
    translateX: -(pestana.offsetWidth + 50),
    opacity: 0,
    duration: 400,
    easing: "easeInOutQuad",
    complete: () => {
      pestana.remove();

      const restantes = document.querySelectorAll(".pestaña");

      if (restantes.length === 0) {
        pestanaActiva = null;
        tp_pes = null;
        actualizarVisualizador(true); // animar al cerrar todas
      } else if (eraActiva) {
        seleccionarPestana(restantes[restantes.length - 1]); // sin animación
      }

      anime({
        targets: document.querySelectorAll(".pestaña"),
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
crearPestana.addEventListener("click", () => {
  crearNuevaPestana("n_pes");
});

//----------------------------
// Atajos de teclado
//----------------------------
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "t") {
    e.preventDefault();
    crearNuevaPestana("n_pes");
  }

  if (e.ctrlKey && e.key.toLowerCase() === "w") {
    e.preventDefault();
    e.stopPropagation();
    if (pestanaActiva) eliminarPestana(pestanaActiva);
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
      actualizarVisualizador(true); // animar al limpiar todas
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
    const btnOpen = contenedor.querySelector("#btn-open");

    if (!txt) return;

    if (!abierto) {
      // Mostrar contenido
      txt.style.display = "flex";

      if (btnOpen) btnOpen.style.display = "flex";

      anime.remove(btn1);
      if (btnOpen) anime.remove(btnOpen); // ← solo si existe
      anime.remove(txt);

      // Rotación flecha
      anime({
        targets: btn1,
        rotate: 180,
        duration: 200,
        easing: "easeInOutQuad",
      });

      // Animación contenido
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
      if (btnOpen) anime.remove(btnOpen); // ← solo si existe
      anime.remove(txt);

      // Rotación flecha
      anime({
        targets: btn1,
        rotate: 0,
        duration: 200,
        easing: "easeInOutQuad",
      });

      // Ocultar contenido
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
// Sistema archivos!! (JS)
//-------------------------
// Menu desplegable btn open (ambos)

menu_btn_open.forEach((btn) => {
  let vis_des_btn_open = false;

  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const contenedor = btn.closest(".txt-adv-btn1, .txt-content1-np");
    const menu = contenedor.querySelector(".menu-des-btn-open");
    const svg = btn.querySelector(".svg-btn-open");

    if (!menu || !svg) return;

    if (!vis_des_btn_open) {
      vis_des_btn_open = true; // <-- cambiar aquí, no en complete
      menu.style.display = "flex";

      anime({
        targets: svg,
        rotate: [180, 0],
        duration: 310,
        easing: "easeInOutQuad",
      });

      anime({
        targets: menu,
        duration: 300,
        easing: "easeInOutQuad",
        translateY: [-50, 0],
        opacity: [0, 1],
      });
    } else {
      vis_des_btn_open = false;

      anime({
        targets: svg,
        rotate: [0, 180],
        duration: 310,
        easing: "easeInOutQuad",
      });

      anime({
        targets: menu,
        duration: 300,
        easing: "easeInOutQuad",
        translateY: [0, -50],
        opacity: [1, 0],
        complete: () => {
          menu.style.display = "none";
        },
      });
    }
  });
});

// Sistema cambio nombre de la selección
let txt_last;

// Junta ambos botones
const botones = [btn_open, btn_open_barra4].filter(Boolean);

// Función para actualizar TODOS los botones <= no funciona bien
function actualizarBotones(nuevoTexto) {
  botones.forEach((btn) => {
    if (!btn) return;
    btn.firstChild.textContent = nuevoTexto;
  });
}

// OPT 1

opt1_btn_open.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const textoActual = btn.textContent.trim();
    txt_last = botones[0].firstChild.textContent.trim();

    actualizarBotones(textoActual);
    btn.textContent = txt_last;

    if (textoActual === "Abrir carpeta") {
      null;
    } else if (textoActual === "Abrir archivo") {
      crearNuevaPestana("editor");
    } else {
      console.info("Opción desconocida:", textoActual);
    }
  });
});

// OPT 2

opt2_btn_open.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const textoActual = btn.textContent.trim();
    txt_last = botones[0].firstChild.textContent.trim();

    actualizarBotones(textoActual);
    btn.textContent = txt_last;

    if (textoActual === "Abrir carpeta") {
      null;
    } else if (textoActual === "Abrir archivo") {
      crearNuevaPestana("editor");
    } else {
      console.log("Opción desconocida:", textoActual);
    }
  });
});

//

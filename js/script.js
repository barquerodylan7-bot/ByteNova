/* =====================================
   MODO OSCURO
===================================== */

const botonModo = document.getElementById("btn-modo");

function actualizarBotonModo() {

    if (!botonModo) {
        return;
    }

    const modoOscuro =
        document.body.classList.contains("modo-oscuro");

    const iconoModo = botonModo.querySelector("span");
    const simboloModo = modoOscuro ? "☀️" : "🌙";

    if (iconoModo) {
        iconoModo.textContent = simboloModo;
    } else {
        botonModo.textContent = simboloModo;
    }

    botonModo.setAttribute(
        "aria-label",
        modoOscuro
            ? "Activar modo claro"
            : "Activar modo oscuro"
    );
}

if (botonModo) {

    if (localStorage.getItem("modo") === "oscuro") {
        document.body.classList.add("modo-oscuro");
    }

    actualizarBotonModo();

    botonModo.addEventListener("click", function () {

        document.body.classList.toggle("modo-oscuro");

        const modoOscuro =
            document.body.classList.contains("modo-oscuro");

        localStorage.setItem(
            "modo",
            modoOscuro ? "oscuro" : "claro"
        );

        actualizarBotonModo();
    });
}


/* =====================================
   MENÚ HAMBURGUESA
===================================== */

const menuToggle = document.getElementById("menu-toggle");
const menuPrincipal = document.getElementById("menu-principal");

function actualizarIconoMenu(simbolo) {

    if (!menuToggle) {
        return;
    }

    const iconoMenu = menuToggle.querySelector("span");

    if (iconoMenu) {
        iconoMenu.textContent = simbolo;
    } else {
        menuToggle.textContent = simbolo;
    }
}

function cerrarMenu() {

    if (!menuToggle || !menuPrincipal) {
        return;
    }

    menuPrincipal.classList.remove("menu-abierto");

    actualizarIconoMenu("☰");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú");
}

if (menuToggle && menuPrincipal) {

    menuToggle.addEventListener("click", function () {

        menuPrincipal.classList.toggle("menu-abierto");

        const menuAbierto =
            menuPrincipal.classList.contains("menu-abierto");

        actualizarIconoMenu(menuAbierto ? "✕" : "☰");

        menuToggle.setAttribute(
            "aria-expanded",
            menuAbierto ? "true" : "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            menuAbierto
                ? "Cerrar menú"
                : "Abrir menú"
        );
    });

    const enlacesMenu = menuPrincipal.querySelectorAll("a");

    enlacesMenu.forEach(function (enlace) {

        enlace.addEventListener("click", cerrarMenu);
    });

    document.addEventListener("keydown", function (evento) {

        const menuAbierto =
            menuPrincipal.classList.contains("menu-abierto");

        if (
            evento.key === "Escape" &&
            menuAbierto
        ) {
            cerrarMenu();
            menuToggle.focus();
        }
    });

    document.addEventListener("click", function (evento) {

        const menuAbierto =
            menuPrincipal.classList.contains("menu-abierto");

        const clicDentroDelMenu =
            menuPrincipal.contains(evento.target);

        const clicEnElBoton =
            menuToggle.contains(evento.target);

        if (
            menuAbierto &&
            !clicDentroDelMenu &&
            !clicEnElBoton
        ) {
            cerrarMenu();
        }
    });

    window.addEventListener("resize", function () {

        if (window.innerWidth > 1180) {
            cerrarMenu();
        }
    });
}


/* =====================================
   BUSCADOR Y FILTROS DE ARTÍCULOS
===================================== */

const buscadorArticulos =
    document.getElementById("buscador-articulos");

const listaArticulos =
    document.getElementById("lista-articulos");

const contadorArticulos =
    document.getElementById("contador-articulos");

const sinResultadosArticulos =
    document.getElementById("sin-resultados-articulos");

const botonesFiltroArticulos =
    document.querySelectorAll(".filtro-articulo");

function normalizarTexto(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

if (
    buscadorArticulos &&
    listaArticulos &&
    contadorArticulos &&
    sinResultadosArticulos
) {

    const tarjetasArticulos = Array.from(
        listaArticulos.querySelectorAll(
            ".tarjeta-articulo"
        )
    );

    tarjetasArticulos.forEach(
        function (tarjeta, indice) {

            const tituloArticulo =
                tarjeta.querySelector("h3");

            const enlaceArticulo =
                tarjeta.querySelector("a");

            if (tituloArticulo) {

                const identificadorTitulo =
                    `titulo-articulo-${indice + 1}`;

                tituloArticulo.id =
                    identificadorTitulo;

                tarjeta.setAttribute(
                    "aria-labelledby",
                    identificadorTitulo
                );
            }

            if (tituloArticulo && enlaceArticulo) {

                enlaceArticulo.setAttribute(
                    "aria-label",
                    `Leer artículo: ${
                        tituloArticulo.textContent.trim()
                    }`
                );
            }
        }
    );

    let filtroActivo = "todos";

    function actualizarArticulos() {

        const busqueda = normalizarTexto(
            buscadorArticulos.value
        );

        let visibles = 0;

        tarjetasArticulos.forEach(function (tarjeta) {

            const categorias =
                (tarjeta.dataset.categoria || "")
                    .split(" ")
                    .filter(Boolean);

            const coincideCategoria =
                filtroActivo === "todos" ||
                categorias.includes(filtroActivo);

            const contenidoTarjeta =
                normalizarTexto(
                    tarjeta.textContent
                );

            const coincideBusqueda =
                contenidoTarjeta.includes(busqueda);

            const mostrar =
                coincideCategoria &&
                coincideBusqueda;

            tarjeta.hidden = !mostrar;

            if (mostrar) {
                visibles += 1;
            }
        });

        contadorArticulos.textContent =
            visibles === 1
                ? "1 artículo encontrado"
                : `${visibles} artículos encontrados`;

        sinResultadosArticulos.hidden =
            visibles !== 0;
    }

    buscadorArticulos.addEventListener(
        "input",
        actualizarArticulos
    );

    buscadorArticulos.addEventListener(
        "keydown",
        function (evento) {

            if (evento.key === "Escape") {

                buscadorArticulos.value = "";

                actualizarArticulos();
            }
        }
    );

    botonesFiltroArticulos.forEach(
        function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    filtroActivo =
                        boton.dataset.filtro || "todos";

                    botonesFiltroArticulos.forEach(
                        function (otroBoton) {

                            const seleccionado =
                                otroBoton === boton;

                            otroBoton.classList.toggle(
                                "activo",
                                seleccionado
                            );

                            otroBoton.setAttribute(
                                "aria-pressed",
                                seleccionado
                                    ? "true"
                                    : "false"
                            );
                        }
                    );

                    actualizarArticulos();
                }
            );
        }
    );

    actualizarArticulos();
}


/* =====================================
   ÍNDICE DE GUÍAS SEGÚN LA PANTALLA
===================================== */

const indicesArticulo =
    document.querySelectorAll(".indice-articulo");

const pantallaEscritorio =
    window.matchMedia("(min-width: 901px)");

function ajustarIndicesArticulo(
    consultaPantalla
) {

    indicesArticulo.forEach(
        function (indice) {

            if (consultaPantalla.matches) {

                indice.setAttribute("open", "");

            } else {

                indice.removeAttribute("open");
            }
        }
    );
}

if (indicesArticulo.length > 0) {

    ajustarIndicesArticulo(
        pantallaEscritorio
    );

    if (
        typeof pantallaEscritorio
            .addEventListener === "function"
    ) {

        pantallaEscritorio.addEventListener(
            "change",
            ajustarIndicesArticulo
        );

    } else {

        pantallaEscritorio.addListener(
            ajustarIndicesArticulo
        );
    }
}
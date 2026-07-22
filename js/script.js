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
/* BYTENOVA 60: UX */
(function(){const cuerpo=document.querySelector(".articulo-cuerpo"),meta=document.querySelector(".articulo-meta");if(cuerpo&&meta&&!meta.querySelector(".tiempo-lectura")){const n=Math.max(1,Math.ceil(cuerpo.textContent.trim().split(/\s+/).filter(Boolean).length/210)),sp=document.createElement("span");sp.className="tiempo-lectura";sp.textContent=n+" min de lectura";meta.append(document.createTextNode(" · "),sp)}const arts=[{"slug": "que-es-inteligencia-artificial", "href": "que-es-inteligencia-artificial.html", "title": "¿Qué es la inteligencia artificial y cómo funciona?"}, {"slug": "por-que-aprender-html-css", "href": "por-que-aprender-html-css.html", "title": "¿Qué son HTML y CSS y para qué sirven?"}, {"slug": "ciberseguridad-estudiantes", "href": "ciberseguridad-estudiantes.html", "title": "Consejos básicos para protegerte en Internet"}, {"slug": "python-para-principiantes", "href": "python-para-principiantes.html", "title": "¿Qué es Python y por qué es ideal para principiantes?"}, {"slug": "que-es-una-pagina-web", "href": "que-es-una-pagina-web.html", "title": "¿Qué es una página web y cómo funciona?"}, {"slug": "que-es-seo", "href": "que-es-seo.html", "title": "¿Qué es SEO y cómo ayuda a una página web?"}, {"slug": "que-es-programacion", "href": "que-es-programacion.html", "title": "¿Qué es la programación y para qué sirve?"}, {"slug": "que-es-javascript", "href": "que-es-javascript.html", "title": "¿Qué es JavaScript y para qué sirve?"}, {"slug": "frontend-y-backend", "href": "frontend-y-backend.html", "title": "Frontend y backend: ¿qué son y en qué se diferencian?"}, {"slug": "que-es-una-api", "href": "que-es-una-api.html", "title": "¿Qué es una API y cómo funciona?"}, {"slug": "que-es-una-base-de-datos", "href": "que-es-una-base-de-datos.html", "title": "¿Qué es una base de datos y cómo funciona?"}, {"slug": "que-es-phishing", "href": "que-es-phishing.html", "title": "¿Qué es el phishing y cómo protegerte?"}, {"slug": "que-es-machine-learning", "href": "que-es-machine-learning.html", "title": "¿Qué es machine learning y cómo funciona?"}, {"slug": "que-son-git-y-github", "href": "que-son-git-y-github.html", "title": "¿Qué son Git y GitHub y para qué sirven?"}, {"slug": "que-es-dominio-y-hosting", "href": "que-es-dominio-y-hosting.html", "title": "¿Qué son un dominio y un hosting web?"}, {"slug": "que-son-http-y-https", "href": "que-son-http-y-https.html", "title": "¿Qué son HTTP y HTTPS y cómo funcionan?"}, {"slug": "que-es-computacion-en-la-nube", "href": "que-es-computacion-en-la-nube.html", "title": "¿Qué es la computación en la nube?"}, {"slug": "que-es-autenticacion-dos-factores", "href": "que-es-autenticacion-dos-factores.html", "title": "¿Qué es la autenticación de dos factores?"}, {"slug": "que-es-una-vpn", "href": "que-es-una-vpn.html", "title": "¿Qué es una VPN y cómo funciona?"}, {"slug": "que-es-malware", "href": "que-es-malware.html", "title": "¿Qué es el malware y cómo protegerte?"}, {"slug": "que-es-ransomware", "href": "que-es-ransomware.html", "title": "¿Qué es el ransomware y cómo protegerte?"}, {"slug": "que-es-un-firewall", "href": "que-es-un-firewall.html", "title": "¿Qué es un firewall y cómo funciona?"}, {"slug": "como-crear-contrasenas-seguras", "href": "como-crear-contrasenas-seguras.html", "title": "¿Cómo crear contraseñas seguras?"}, {"slug": "que-es-una-direccion-ip", "href": "que-es-una-direccion-ip.html", "title": "¿Qué es una dirección IP?"}, {"slug": "que-es-dns", "href": "que-es-dns.html", "title": "¿Qué es el DNS y cómo funciona?"}, {"slug": "que-es-una-red-informatica", "href": "que-es-una-red-informatica.html", "title": "¿Qué es una red informática?"}, {"slug": "que-es-un-servidor", "href": "que-es-un-servidor.html", "title": "¿Qué es un servidor y cómo funciona?"}, {"slug": "que-es-tcp-ip", "href": "que-es-tcp-ip.html", "title": "¿Qué es TCP/IP y cómo funciona?"}, {"slug": "que-es-una-url", "href": "que-es-una-url.html", "title": "¿Qué es una URL y cuáles son sus partes?"}, {"slug": "que-son-las-cookies", "href": "que-son-las-cookies.html", "title": "¿Qué son las cookies y cómo funcionan?"}, {"slug": "que-es-un-navegador-web", "href": "que-es-un-navegador-web.html", "title": "¿Qué es un navegador web?"}, {"slug": "que-es-diseno-responsive", "href": "que-es-diseno-responsive.html", "title": "¿Qué es el diseño responsive?"}, {"slug": "que-es-accesibilidad-web", "href": "que-es-accesibilidad-web.html", "title": "¿Qué es la accesibilidad web?"}, {"slug": "que-es-rendimiento-web", "href": "que-es-rendimiento-web.html", "title": "¿Qué es el rendimiento web?"}, {"slug": "que-es-un-sistema-operativo", "href": "que-es-un-sistema-operativo.html", "title": "¿Qué es un sistema operativo?"}, {"slug": "que-es-linux", "href": "que-es-linux.html", "title": "¿Qué es Linux y para qué sirve?"}, {"slug": "que-es-software-libre-codigo-abierto", "href": "que-es-software-libre-codigo-abierto.html", "title": "¿Qué es el software libre?"}, {"slug": "que-son-librerias-y-frameworks", "href": "que-son-librerias-y-frameworks.html", "title": "¿Qué son las librerías y frameworks?"}, {"slug": "que-es-big-data", "href": "que-es-big-data.html", "title": "¿Qué es Big Data y para qué sirve?"}, {"slug": "que-son-redes-neuronales", "href": "que-son-redes-neuronales.html", "title": "¿Qué son las redes neuronales?"}, {"slug": "que-es-un-algoritmo", "href": "que-es-un-algoritmo.html", "title": "¿Qué es un algoritmo y para qué sirve?"}, {"slug": "variables-y-tipos-de-datos", "href": "variables-y-tipos-de-datos.html", "title": "Variables y tipos de datos: fundamentos de programación"}, {"slug": "estructuras-condicionales", "href": "estructuras-condicionales.html", "title": "Estructuras condicionales: cómo tomar decisiones al programar"}, {"slug": "bucles-y-ciclos-en-programacion", "href": "bucles-y-ciclos-en-programacion.html", "title": "Bucles y ciclos en programación: repetir tareas sin duplicar código"}, {"slug": "funciones-en-programacion", "href": "funciones-en-programacion.html", "title": "Funciones en programación: cómo organizar y reutilizar código"}, {"slug": "depuracion-de-codigo", "href": "depuracion-de-codigo.html", "title": "Depuración de código: cómo encontrar y corregir errores"}, {"slug": "estructuras-de-datos-basicas", "href": "estructuras-de-datos-basicas.html", "title": "Estructuras de datos básicas: listas, pilas, colas y diccionarios"}, {"slug": "html-semantico", "href": "html-semantico.html", "title": "HTML semántico: estructura páginas claras y accesibles"}, {"slug": "css-flexbox", "href": "css-flexbox.html", "title": "CSS Flexbox: guía para alinear y distribuir elementos"}, {"slug": "css-grid", "href": "css-grid.html", "title": "CSS Grid: crea diseños web en filas y columnas"}, {"slug": "que-es-el-dom", "href": "que-es-el-dom.html", "title": "¿Qué es el DOM y cómo JavaScript modifica una página?"}, {"slug": "formularios-html-validacion", "href": "formularios-html-validacion.html", "title": "Formularios HTML y validación: recopila datos de forma accesible"}, {"slug": "que-es-json", "href": "que-es-json.html", "title": "¿Qué es JSON y para qué se utiliza?"}, {"slug": "que-es-sql", "href": "que-es-sql.html", "title": "¿Qué es SQL y para qué sirve en una base de datos?"}, {"slug": "bases-de-datos-relacionales", "href": "bases-de-datos-relacionales.html", "title": "Bases de datos relacionales: tablas, claves y relaciones"}, {"slug": "que-es-ia-generativa", "href": "que-es-ia-generativa.html", "title": "¿Qué es la inteligencia artificial generativa?"}, {"slug": "como-escribir-prompts-efectivos", "href": "como-escribir-prompts-efectivos.html", "title": "Cómo escribir prompts efectivos para herramientas de IA"}, {"slug": "seguridad-en-redes-wifi", "href": "seguridad-en-redes-wifi.html", "title": "Seguridad en redes Wi‑Fi: protege tu conexión doméstica"}, {"slug": "copias-de-seguridad", "href": "copias-de-seguridad.html", "title": "Copias de seguridad: cómo proteger tus archivos importantes"}, {"slug": "intencion-de-busqueda-y-palabras-clave", "href": "intencion-de-busqueda-y-palabras-clave.html", "title": "Intención de búsqueda y palabras clave: base de un buen contenido SEO"}];if(cuerpo&&!document.querySelector(".navegacion-articulos")){const slug=location.pathname.split("/").pop().replace(/\.html$/,"");const i=arts.findIndex(x=>x.slug===slug);if(i>=0){const nav=document.createElement("nav");nav.className="navegacion-articulos";nav.setAttribute("aria-label","Navegación entre artículos");const prev=arts[i-1],next=arts[i+1];if(prev)nav.insertAdjacentHTML("beforeend",`<a href="${prev.href}"><span>← Artículo anterior</span><strong>${prev.title}</strong></a>`);if(next)nav.insertAdjacentHTML("beforeend",`<a href="${next.href}"><span>Artículo siguiente →</span><strong>${next.title}</strong></a>`);const ref=cuerpo.querySelector(".autor-articulo")||cuerpo.querySelector(".articulos-relacionados");ref?ref.insertAdjacentElement("beforebegin",nav):cuerpo.append(nav)}}const retos=[...document.querySelectorAll(".reto-practico[data-area]")],filtros=[...document.querySelectorAll(".filtro-reto[data-area]")],nivel=document.getElementById("nivel-retos"),contador=document.getElementById("contador-retos"),vacio=document.getElementById("sin-resultados-retos");if(retos.length&&filtros.length&&nivel&&contador){let area="todos";const update=()=>{let visible=0;retos.forEach(r=>{r.hidden=!((area==="todos"||r.dataset.area===area)&&(nivel.value==="todos"||r.dataset.nivel===nivel.value));if(!r.hidden)visible++});contador.textContent=visible+" "+(visible===1?"reto disponible":"retos disponibles");if(vacio)vacio.hidden=visible!==0};filtros.forEach(b=>b.addEventListener("click",()=>{area=b.dataset.area;filtros.forEach(o=>{const on=o===b;o.classList.toggle("activo",on);o.setAttribute("aria-pressed",String(on))});update()}));nivel.addEventListener("change",update);update()}})();

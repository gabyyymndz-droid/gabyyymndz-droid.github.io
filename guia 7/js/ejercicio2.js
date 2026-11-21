const MUSICALES = ["Hamilton", "La La Land", "Rent", "Mamma Mia!"];

const frmBusqueda = document.getElementById("idFrmBusqueda");
const txtTitulo = document.getElementById("idTxtTitulo");
const btnBuscar = document.getElementById("idBtnBuscar");
const divAtajos = document.getElementById("idAtajos");
const divEstado = document.getElementById("idEstado");
const pResumen = document.getElementById("idResumen");
const divCartelera = document.getElementById("idCartelera");

const tituloFicha = document.getElementById("idTituloFicha");
const bodyFicha = document.getElementById("idBodyFicha");
const modalFicha = new bootstrap.Modal(document.getElementById("idModalFicha"), {});

class SinResultados extends Error {}

const vaciar = (nodo) => {
  while (nodo.firstChild) nodo.removeChild(nodo.firstChild);
};

const elemento = (etiqueta, clases = "", texto = "") => {
  const el = document.createElement(etiqueta);
  if (clases) el.className = clases;
  if (texto) el.appendChild(document.createTextNode(texto));
  return el;
};

const valorOVacio = (valor) => (valor && valor !== "N/A" ? valor : "No disponible");

const crearPoster = (url, titulo) => {
  if (!url || url === "N/A") {
    const vacio = elemento("div", "poster poster-vacio");
    vacio.appendChild(elemento("i", "bi bi-film"));
    return vacio;
  }
  const img = document.createElement("img");
  img.className = "poster";
  img.src = url;
  img.alt = `Póster de ${titulo}`;
  img.loading = "lazy";
  return img;
};

const crearCargando = (mensaje) => {
  const caja = elemento("div", "d-flex justify-content-center align-items-center gap-3 py-5");
  const spinner = elemento("div", "spinner-border text-warning");
  spinner.setAttribute("role", "status");
  caja.appendChild(spinner);
  caja.appendChild(elemento("span", "fs-5", mensaje));
  return caja;
};

const crearAlerta = (tipo, titulo, mensaje, reintentar = null) => {
  const alerta = elemento("div", `alert alert-${tipo}`);
  alerta.setAttribute("role", "alert");
  alerta.appendChild(elemento("h2", "h5 alert-heading", titulo));
  alerta.appendChild(elemento("p", "mb-0", mensaje));
  if (reintentar) {
    const boton = elemento("button", "btn btn-outline-dark btn-sm mt-3", "Reintentar");
    boton.type = "button";
    boton.addEventListener("click", reintentar);
    alerta.appendChild(boton);
  }
  return alerta;
};

const mostrarEstado = (nodo) => {
  vaciar(divEstado);
  if (nodo) divEstado.appendChild(nodo);
};

const textoErrorHttp = (codigo) => {
  if (codigo === 401 || codigo === 403) return "La clave de RapidAPI no es válida o falta suscribirse al plan gratuito de esta API (revise js/config.js).";
  if (codigo === 429) return "Se alcanzó el límite de consultas del plan gratuito. Intente de nuevo más tarde.";
  if (codigo >= 500) return "El servidor de la API tiene problemas. Intente más tarde.";
  return `La API respondió con un error (código ${codigo}).`;
};

const consultarApi = async (parametros) => {
  if (API_CONFIG.key.startsWith("PEGUE_AQUI")) {
    throw new Error("Falta la clave de RapidAPI. Péguela en js/config.js.");
  }

  const url = new URL(API_CONFIG.baseUrl);
  url.searchParams.append("r", "json");
  for (const [clave, valor] of Object.entries(parametros)) {
    url.searchParams.append(clave, valor);
  }

  let respuesta;
  try {
    respuesta = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": API_CONFIG.key,
        "X-RapidAPI-Host": API_CONFIG.host,
      },
    });
  } catch (e) {
    throw new Error("No se pudo conectar con la API. Verifique su conexión a internet.");
  }

  if (!respuesta.ok) throw new Error(textoErrorHttp(respuesta.status));

  const datos = await respuesta.json();

  if (datos.Response === "False") {
    if (datos.Error === "Movie not found!" || datos.Error === "Too many results.") {
      throw new SinResultados(datos.Error);
    }
    throw new Error(datos.Error || "La API devolvió una respuesta inesperada.");
  }
  return datos;
};

const crearTarjeta = (pelicula) => {
  const col = elemento("div", "col");
  const tarjeta = elemento("article", "card h-100 tarjeta-musical");

  tarjeta.appendChild(crearPoster(pelicula.Poster, pelicula.Title));

  const cuerpo = elemento("div", "card-body d-flex flex-column");
  cuerpo.appendChild(elemento("h2", "h6 fw-bold", pelicula.Title));
  cuerpo.appendChild(elemento("p", "small mb-3 flex-grow-1", `Año: ${valorOVacio(pelicula.Year)}`));

  const boton = elemento("button", "btn btn-dorado btn-sm");
  boton.type = "button";
  boton.appendChild(elemento("i", "bi bi-ticket-perforated me-1"));
  boton.appendChild(document.createTextNode("Ver ficha"));
  boton.addEventListener("click", () => abrirFicha(pelicula.imdbID, pelicula.Title));
  cuerpo.appendChild(boton);

  tarjeta.appendChild(cuerpo);
  col.appendChild(tarjeta);
  return col;
};

const buscarMusical = async (titulo) => {
  btnBuscar.disabled = true;
  vaciar(divCartelera);
  pResumen.textContent = "";
  mostrarEstado(crearCargando(`Buscando "${titulo}"...`));

  try {
    const datos = await consultarApi({ s: titulo, type: "movie" });
    const peliculas = datos.Search || [];

    mostrarEstado(null);
    pResumen.textContent = `Resultados para "${titulo}": ${peliculas.length} de ${datos.totalResults}.`;
    for (const pelicula of peliculas) divCartelera.appendChild(crearTarjeta(pelicula));
  } catch (error) {
    if (error instanceof SinResultados) {
      mostrarEstado(crearAlerta("info", "Sin resultados", `No se encontraron películas para "${titulo}".`));
    } else {
      mostrarEstado(crearAlerta("danger", "No se pudo completar la búsqueda", error.message, () => buscarMusical(titulo)));
    }
  } finally {
    btnBuscar.disabled = false;
  }
};

const crearDato = (titulo, valor) => {
  const fila = elemento("div", "row py-1 border-bottom border-secondary");
  fila.appendChild(elemento("dt", "col-sm-4", titulo));
  fila.appendChild(elemento("dd", "col-sm-8 mb-0", valorOVacio(valor)));
  return fila;
};

const dibujarFicha = (pelicula) => {
  vaciar(bodyFicha);
  tituloFicha.textContent = pelicula.Title;

  const fila = elemento("div", "row g-4");

  const izquierda = elemento("div", "col-md-4");
  izquierda.appendChild(crearPoster(pelicula.Poster, pelicula.Title));
  const enlace = elemento("a", "btn btn-dorado w-100 mt-3", "Ver en IMDb");
  enlace.href = `https://www.imdb.com/title/${pelicula.imdbID}/`;
  enlace.target = "_blank";
  enlace.rel = "noopener noreferrer";
  izquierda.appendChild(enlace);
  fila.appendChild(izquierda);

  const derecha = elemento("div", "col-md-8");
  derecha.appendChild(elemento("h2", "h5 fw-bold titulo-escenario", "Sinopsis"));
  derecha.appendChild(elemento("p", "sinopsis", valorOVacio(pelicula.Plot)));

  const datos = elemento("dl", "small mb-0");
  datos.appendChild(crearDato("Estreno", pelicula.Released));
  datos.appendChild(crearDato("Duración", pelicula.Runtime));
  datos.appendChild(crearDato("Género", pelicula.Genre));
  datos.appendChild(crearDato("Director", pelicula.Director));
  datos.appendChild(crearDato("Reparto", pelicula.Actors));
  datos.appendChild(crearDato("Idioma", pelicula.Language));
  datos.appendChild(crearDato("País", pelicula.Country));
  datos.appendChild(crearDato("Premios", pelicula.Awards));
  datos.appendChild(crearDato("Calificación IMDb", pelicula.imdbRating === "N/A" ? "" : `${pelicula.imdbRating} / 10`));
  derecha.appendChild(datos);

  fila.appendChild(derecha);
  bodyFicha.appendChild(fila);
};

const abrirFicha = async (id, titulo) => {
  tituloFicha.textContent = titulo;
  vaciar(bodyFicha);
  bodyFicha.appendChild(crearCargando("Cargando ficha..."));
  modalFicha.show();

  try {
    const pelicula = await consultarApi({ i: id, plot: "full" });
    dibujarFicha(pelicula);
  } catch (error) {
    vaciar(bodyFicha);
    bodyFicha.appendChild(
      crearAlerta("danger", "No se pudo cargar la ficha", error.message, () => abrirFicha(id, titulo))
    );
  }
};

for (const musical of MUSICALES) {
  const atajo = elemento("button", "atajo", musical);
  atajo.type = "button";
  atajo.addEventListener("click", () => {
    txtTitulo.value = musical;
    buscarMusical(musical);
  });
  divAtajos.appendChild(atajo);
}

frmBusqueda.addEventListener("submit", (e) => {
  e.preventDefault();
  const titulo = txtTitulo.value.trim();
  if (titulo === "") {
    mostrarEstado(crearAlerta("warning", "Escriba un título", "Ingrese el nombre de un musical o elija uno de los accesos rápidos."));
    return;
  }
  buscarMusical(titulo);
});

txtTitulo.value = MUSICALES[0];
buscarMusical(MUSICALES[0]);
const formulario = document.forms["frmRegistro"];
const button = formulario.elements["btnRegistro"];

const txtNombre = document.getElementById("idNombre");
const txtApellidos = document.getElementById("idApellidos");
const txtFechaNac = document.getElementById("idFechaNac");
const txtCorreo = document.getElementById("idCorreo");
const txtPassword = document.getElementById("idPassword");
const txtPasswordRepetir = document.getElementById("idPasswordRepetir");
const cmbPais = document.getElementById("idCmPais");
const fileAvatar = document.getElementById("idArchivo");

const checksIntereses = document.querySelectorAll("input[type='checkbox']");
const radiosCarrera = document.getElementsByName("idRdCarrera");

const divErrores = document.getElementById("idErrores");
const bodyModal = document.getElementById("idBodyModal");
const modal = new bootstrap.Modal(document.getElementById("idModal"), {});

const regexCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const limpiarNodo = (nodo) => {
  while (nodo.hasChildNodes()) {
    nodo.removeChild(nodo.firstChild);
  }
};

const textoLabel = (control) => {
  const label = document.querySelector(`label[for="${control.id}"]`);
  return label ? label.firstChild.nodeValue.trim() : control.id;
};

const fechaHoy = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

const marcarInvalido = (control) => control.classList.add("is-invalid");

const limpiarMarcas = () => {
  for (const el of formulario.elements) {
    el.classList.remove("is-invalid");
  }
};

const validarFormulario = () => {
  const errores = [];
  limpiarMarcas();

  const obligatorios = [txtNombre, txtApellidos, txtFechaNac, txtCorreo, txtPassword, txtPasswordRepetir];
  for (const campo of obligatorios) {
    if (campo.value.trim() === "") {
      errores.push(`El campo "${textoLabel(campo)}" es obligatorio.`);
      marcarInvalido(campo);
    }
  }

  if (txtFechaNac.value !== "" && txtFechaNac.value > fechaHoy()) {
    errores.push("La fecha de nacimiento no puede ser mayor a la fecha actual.");
    marcarInvalido(txtFechaNac);
  }

  if (txtCorreo.value.trim() !== "" && !regexCorreo.test(txtCorreo.value.trim())) {
    errores.push("El correo electrónico no tiene un formato válido (ej. usuario@dominio.com).");
    marcarInvalido(txtCorreo);
  }

  if (txtPassword.value !== "" && txtPasswordRepetir.value !== "" &&
      txtPassword.value !== txtPasswordRepetir.value) {
    errores.push("Las contraseñas no coinciden.");
    marcarInvalido(txtPassword);
    marcarInvalido(txtPasswordRepetir);
  }

  const hayInteres = Array.from(checksIntereses).some((c) => c.checked);
  if (!hayInteres) {
    errores.push("Debe seleccionar al menos un interés.");
    checksIntereses.forEach(marcarInvalido);
  }

  const hayCarrera = Array.from(radiosCarrera).some((r) => r.checked);
  if (!hayCarrera) {
    errores.push("Debe seleccionar una carrera.");
    radiosCarrera.forEach(marcarInvalido);
  }

  if (cmbPais.value === "") {
    errores.push("Debe seleccionar un país de origen.");
    marcarInvalido(cmbPais);
  }

  return errores;
};

const mostrarErrores = (errores) => {
  limpiarNodo(divErrores);

  const alerta = document.createElement("div");
  alerta.setAttribute("class", "alert alert-danger");
  alerta.setAttribute("role", "alert");

  const titulo = document.createElement("strong");
  titulo.appendChild(document.createTextNode("Por favor corrija lo siguiente:"));
  alerta.appendChild(titulo);

  const lista = document.createElement("ul");
  lista.setAttribute("class", "mb-0");
  for (const error of errores) {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(error));
    lista.appendChild(li);
  }
  alerta.appendChild(lista);

  divErrores.appendChild(alerta);
};

const obtenerDatos = () => {
  const intereses = Array.from(checksIntereses)
    .filter((c) => c.checked)
    .map((c) => textoLabel(c));

  const carreraMarcada = Array.from(radiosCarrera).find((r) => r.checked);

  return [
    ["Nombres", txtNombre.value.trim()],
    ["Apellidos", txtApellidos.value.trim()],
    ["Fecha de nacimiento", txtFechaNac.value],
    ["Correo electrónico", txtCorreo.value.trim()],
    ["Contraseña", "•".repeat(txtPassword.value.length)],
    ["Intereses", intereses.join(", ")],
    ["Carrera", textoLabel(carreraMarcada)],
    ["País de origen", cmbPais.options[cmbPais.selectedIndex].text],
    ["Avatar", fileAvatar.files.length > 0 ? fileAvatar.files[0].name : "No seleccionado"],
  ];
};

const crearCelda = (etiqueta, texto) => {
  const celda = document.createElement(etiqueta);
  celda.appendChild(document.createTextNode(texto));
  return celda;
};

const mostrarTablaEnModal = () => {
  limpiarNodo(bodyModal);

  const tabla = document.createElement("table");
  tabla.setAttribute("class", "table table-striped table-bordered mb-0");

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  trHead.appendChild(crearCelda("th", "Campo"));
  trHead.appendChild(crearCelda("th", "Información"));
  thead.appendChild(trHead);
  tabla.appendChild(thead);

  const tbody = document.createElement("tbody");
  for (const [campo, valor] of obtenerDatos()) {
    const tr = document.createElement("tr");
    tr.appendChild(crearCelda("th", campo));
    tr.appendChild(crearCelda("td", valor));
    tbody.appendChild(tr);
  }
  tabla.appendChild(tbody);

  bodyModal.appendChild(tabla);
  modal.show();
};

button.onclick = () => {
  const errores = validarFormulario();

  if (errores.length > 0) {
    mostrarErrores(errores);
  } else {
    limpiarNodo(divErrores);
    mostrarTablaEnModal();
  }
};

formulario.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));
formulario.addEventListener("change", (e) => {
  e.target.classList.remove("is-invalid");
  if (e.target.type === "checkbox") checksIntereses.forEach((c) => c.classList.remove("is-invalid"));
  if (e.target.type === "radio") radiosCarrera.forEach((r) => r.classList.remove("is-invalid"));
});

txtFechaNac.setAttribute("max", fechaHoy());
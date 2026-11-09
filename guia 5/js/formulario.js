const inputNombre = document.getElementById("idTxtNombre");
const inputApellido = document.getElementById("idTxtApellido");
const inputFechaNacimiento = document.getElementById("idTxtFechaNacimiento");
const inputRdMasculino = document.getElementById("idRdMasculino");
const inputRdFemenino = document.getElementById("idRdFemenino");
const cmbPais = document.getElementById("idCmbPais");
const inputDireccion = document.getElementById("idTxtDireccion");
const inputNombrePais = document.getElementById("idNombrePais");

const buttonAgregarPaciente = document.getElementById("idBtnAgregar");
const buttonLimpiarPaciente = document.getElementById("idBtnLimpiar");
const buttonMostrarPaciente = document.getElementById("idBtnMostrar");
const buttonAgregarPais = document.getElementById("idBtnAddPais");

const notificacion = document.getElementById("idNotificacion");
const toast = new bootstrap.Toast(notificacion);
const mensaje = document.getElementById("idMensaje");

let arrayPaciente = JSON.parse(localStorage.getItem("pacientes")) || [];


let indiceEdicion = -1;


const guardarEnLocalStorage = () => {
  localStorage.setItem("pacientes", JSON.stringify(arrayPaciente));
};


const mostrarToast = (texto) => {
  mensaje.innerHTML = texto;
  toast.show();
};


const limpiarForm = () => {
  inputNombre.value = "";
  inputApellido.value = "";
  inputFechaNacimiento.value = "";
  inputRdMasculino.checked = false;
  inputRdFemenino.checked = false;
  cmbPais.value = "0";
  inputDireccion.value = "";
  inputNombrePais.value = "";

 
  indiceEdicion = -1;
  buttonAgregarPaciente.innerHTML = '<i class="bi bi-person-plus-fill"></i> Guardar Datos';
  buttonAgregarPaciente.classList.remove("btn-primary");
  buttonAgregarPaciente.classList.add("btn-success");

  inputNombre.focus();
};


const addPaciente = function () {
  let nombre = inputNombre.value.trim();
  let apellido = inputApellido.value.trim();
  let fechaNacimiento = inputFechaNacimiento.value;
  let sexo = inputRdMasculino.checked ? "Hombre" : inputRdFemenino.checked ? "Mujer" : "";
  let pais = cmbPais.value;
  let direccion = inputDireccion.value.trim();

  if (
    nombre !== "" &&
    apellido !== "" &&
    fechaNacimiento !== "" &&
    sexo !== "" &&
    pais !== "0" &&
    direccion !== ""
  ) {
    let labelPais = cmbPais.options[cmbPais.selectedIndex].text;

    if (indiceEdicion === -1) {
  
      arrayPaciente.push([nombre, apellido, fechaNacimiento, sexo, labelPais, direccion]);
      mostrarToast("Se ha registrado un nuevo paciente");
    } else {
     
      arrayPaciente[indiceEdicion] = [nombre, apellido, fechaNacimiento, sexo, labelPais, direccion];
      mostrarToast("Paciente actualizado correctamente");
    }

    guardarEnLocalStorage();
    limpiarForm();
    imprimirPacientes();
  } else {
    mostrarToast("Faltan campos por completar");
  }
};


const cargarPacienteParaEditar = (index) => {
  const paciente = arrayPaciente[index];
  if (!paciente) return;

  indiceEdicion = index;

  inputNombre.value = paciente[0];
  inputApellido.value = paciente[1];
  inputFechaNacimiento.value = paciente[2];

  if (paciente[3] === "Hombre") {
    inputRdMasculino.checked = true;
  } else if (paciente[3] === "Mujer") {
    inputRdFemenino.checked = true;
  }

  for (let i = 0; i < cmbPais.options.length; i++) {
    if (cmbPais.options[i].text === paciente[4]) {
      cmbPais.selectedIndex = i;
      break;
    }
  }

  inputDireccion.value = paciente[5];

  buttonAgregarPaciente.innerHTML = '<i class="bi bi-pencil-square"></i> Actualizar Datos';
  buttonAgregarPaciente.classList.remove("btn-success");
  buttonAgregarPaciente.classList.add("btn-primary");

  window.scrollTo({ top: 0, behavior: "smooth" });
  inputNombre.focus();
};


const eliminarPaciente = (index) => {
  const paciente = arrayPaciente[index];
  const confirmacion = confirm(`¿Está seguro de eliminar al paciente ${paciente[0]} ${paciente[1]}?`);

  if (confirmacion) {
    arrayPaciente.splice(index, 1);
    guardarEnLocalStorage();

    if (indiceEdicion === index) {
      limpiarForm();
    } else if (indiceEdicion > index) {
      indiceEdicion--;
    }

    imprimirPacientes();
    mostrarToast("Paciente eliminado correctamente");
  }
};


function imprimirFilas() {
  let filas = "";
  arrayPaciente.forEach((element, index) => {
    filas += `
      <tr>
        <td scope="row" class="text-center fw-bold">${index + 1}</td>
        <td>${element[0]}</td>
        <td>${element[1]}</td>
        <td>${element[2]}</td>
        <td>${element[3]}</td>
        <td>${element[4]}</td>
        <td>${element[5]}</td>
        <td class="text-center">
          <button type="button" class="btn btn-primary btn-sm btn-editar" data-index="${index}" title="Editar">
            <i class="bi bi-pencil-square pointer-events-none"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm btn-eliminar" data-index="${index}" title="Eliminar">
            <i class="bi bi-trash3-fill pointer-events-none"></i>
          </button>
        </td>
      </tr>`;
  });
  return filas;
}


const imprimirPacientes = () => {
  const contenedor = document.getElementById("idTablaPacientes");

  if (arrayPaciente.length === 0) {
    contenedor.innerHTML = "Ninguno";
    return;
  }

  let table = `
    <div class="table-responsive">
      <table class="table table-striped table-hover table-bordered align-middle">
        <thead>
          <tr class="table-dark">
            <th scope="col" class="text-center" style="width:5%">#</th>
            <th scope="col" class="text-center" style="width:15%">Nombre</th>
            <th scope="col" class="text-center" style="width:15%">Apellido</th>
            <th scope="col" class="text-center" style="width:10%">Fecha nacimiento</th>
            <th scope="col" class="text-center" style="width:10%">Sexo</th>
            <th scope="col" class="text-center" style="width:10%">País</th>
            <th scope="col" class="text-center" style="width:25%">Dirección</th>
            <th scope="col" class="text-center" style="width:10%">Opciones</th>
          </tr>
        </thead>
        <tbody>
          ${imprimirFilas()}
        </tbody>
      </table>
    </div>`;

  contenedor.innerHTML = table;
};


document.getElementById("idTablaPacientes").addEventListener("click", (e) => {
  const btnEditar = e.target.closest(".btn-editar");
  const btnEliminar = e.target.closest(".btn-eliminar");

  if (btnEditar) {
    const index = parseInt(btnEditar.getAttribute("data-index"));
    cargarPacienteParaEditar(index);
  } else if (btnEliminar) {
    const index = parseInt(btnEliminar.getAttribute("data-index"));
    eliminarPaciente(index);
  }
});


let contadorGlobalOption = cmbPais.children.length;
const addPais = () => {
  let paisNew = inputNombrePais.value.trim();
  if (paisNew !== "") {
    let option = document.createElement("option");
    option.textContent = paisNew;
    option.value = contadorGlobalOption + 1;
    cmbPais.appendChild(option);
    mostrarToast("País agregado correctamente");
    inputNombrePais.value = "";
  } else {
    mostrarToast("Debe escribir el nombre del país");
  }
};


buttonLimpiarPaciente.onclick = () => {
  limpiarForm();
};

buttonAgregarPaciente.onclick = () => {
  addPaciente();
};

buttonMostrarPaciente.onclick = () => {
  imprimirPacientes();
};

buttonAgregarPais.onclick = () => {
  addPais();
};


const modalPais = document.getElementById("idModal");
if (modalPais) {
  modalPais.addEventListener("shown.bs.modal", () => {
    inputNombrePais.value = "";
    inputNombrePais.focus();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  limpiarForm();
  imprimirPacientes();
});
document.addEventListener("DOMContentLoaded", () => {

  const inputCarnet = document.getElementById("idTxtCarnet");
  const inputNombre = document.getElementById("idTxtNombre");
  const inputDui = document.getElementById("idTxtDui");
  const inputNit = document.getElementById("idTxtNit");
  const inputFechaNac = document.getElementById("idTxtFechaNac");
  const inputCorreo = document.getElementById("idTxtCorreo");
  const inputEdad = document.getElementById("idTxtEdad");

  const btnGuardar = document.getElementById("idBtnGuardarEstudiante");
  const btnLimpiar = document.getElementById("idBtnLimpiarFicha");
  const contenedorFicha = document.getElementById("idContenedorFicha");


  const patrones = {
    carnet: /^[A-Za-z]{2}\d{3}$/,                      
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,               
    dui: /^\d{8}-\d{1}$/,                              
    nit: /^\d{4}-\d{6}-\d{3}-\d{1}$/,                
    fechaNac: /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, 
    correo: /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/,  
    edad: /^\d{1,3}$/                                 
  };


  const validarCampo = (input, regex) => {
    const valor = input.value.trim();
    if (regex.test(valor)) {
      input.classList.remove("is-invalid");
      input.classList.add("is-valid");
      return true;
    } else {
      input.classList.remove("is-valid");
      input.classList.add("is-invalid");
      return false;
    }
  };

 
  const limpiarFormulario = () => {
    [inputCarnet, inputNombre, inputDui, inputNit, inputFechaNac, inputCorreo, inputEdad].forEach((input) => {
      input.value = "";
      input.classList.remove("is-valid", "is-invalid");
    });
    contenedorFicha.innerHTML = "";
    inputCarnet.focus();
  };


  const guardarFicha = () => {
    const vCarnet = validarCampo(inputCarnet, patrones.carnet);
    const vNombre = validarCampo(inputNombre, patrones.nombre);
    const vDui = validarCampo(inputDui, patrones.dui);
    const vNit = validarCampo(inputNit, patrones.nit);
    const vFecha = validarCampo(inputFechaNac, patrones.fechaNac);
    const vCorreo = validarCampo(inputCorreo, patrones.correo);
    const vEdad = validarCampo(inputEdad, patrones.edad);

    if (vCarnet && vNombre && vDui && vNit && vFecha && vCorreo && vEdad) {
      const fichaHTML = `
        <div class="card border-success shadow-sm">
          <div class="card-header bg-success text-white fw-bold fs-5">
            <i class="bi bi-person-check-fill me-2"></i> Ficha de Estudiante Registrada
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 mb-2"><strong>Carnet:</strong> ${inputCarnet.value.trim().toUpperCase()}</div>
              <div class="col-md-6 mb-2"><strong>Estudiante:</strong> ${inputNombre.value.trim()}</div>
              <div class="col-md-6 mb-2"><strong>DUI:</strong> ${inputDui.value.trim()}</div>
              <div class="col-md-6 mb-2"><strong>NIT:</strong> ${inputNit.value.trim()}</div>
              <div class="col-md-6 mb-2"><strong>Fecha de Nacimiento:</strong> ${inputFechaNac.value.trim()}</div>
              <div class="col-md-6 mb-2"><strong>Edad:</strong> ${inputEdad.value.trim()} años</div>
              <div class="col-md-12 mb-2"><strong>Correo Electrónico:</strong> ${inputCorreo.value.trim()}</div>
            </div>
          </div>
        </div>
      `;
      contenedorFicha.innerHTML = fichaHTML;
    } else {
      contenedorFicha.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Por favor, corrija los campos marcados en rojo antes de continuar.
        </div>
      `;
    }
  };


  btnGuardar.addEventListener("click", guardarFicha);
  btnLimpiar.addEventListener("click", limpiarFormulario);
});
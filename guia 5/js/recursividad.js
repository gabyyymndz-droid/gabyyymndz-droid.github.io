const campo = document.getElementById("idTxtNumero");

const validarNumero = function (e) {
  let validar = /^[0-9]$/;
  let tecla = e.key;

  if (!validar.test(tecla) && e.key !== "Backspace" && e.key !== "Tab") {
    e.preventDefault();
  }
};

campo.addEventListener("keypress", validarNumero);

const boton = document.getElementById("idBtnCalcular");
function calcularFactorial(numero) {
  return numero < 2 ? 1 : numero * calcularFactorial(numero - 1);
}

const imprimir = (numero, resultado) => {
  const contenedor = document.getElementById("idDivResultado");
  contenedor.innerHTML = `El factorial de ${numero} es ${resultado}`;
};

function calcular() {
  let valor = document.getElementById("idTxtNumero").value.trim();
  let numero = parseInt(valor);

  if (!isNaN(numero) && numero >= 0) {
    let resultado = calcularFactorial(numero);
    imprimir(numero, resultado);
  } else {
    alert("Debe ingresar un número válido entero positivo");
  }
}

boton.addEventListener("click", calcular);
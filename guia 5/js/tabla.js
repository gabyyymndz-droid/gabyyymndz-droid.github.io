const crearTabla = function () {

  const contenedor = document.getElementById("idDivResultado");
  const tabla = document.createElement("table");
  tabla.className = "table table-striped table-hover table-bordered border-primary";

  const tbody = document.createElement("tbody");

  for (let i = 0; i < 10; i++) {
    const fila = document.createElement("tr");

    for (let j = 0; j < 10; j++) {
      let celda;

      if (i === 0) {
        celda = document.createElement("th");
        celda.className = "table-dark text-center";
      } else {
        celda = document.createElement("td");
      }

      const textoCelda = document.createTextNode(`Fila ${i}, Columna ${j}`);
      celda.appendChild(textoCelda);
      fila.appendChild(celda);
    }

    tbody.appendChild(fila);
  }

  tabla.appendChild(tbody);
  contenedor.innerHTML = ""; 
  contenedor.appendChild(tabla);
};

document.addEventListener("DOMContentLoaded", () => {
  const btnCrearTabla = document.getElementById("idBtnCrearTabla");
  if (btnCrearTabla) {
    btnCrearTabla.addEventListener("click", crearTabla);
  }
});
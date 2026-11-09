
const containerEstudiantes = document.querySelector("#idContainerEstudiantes");

const btnPromedio = document.querySelector("#idBtnPromedio");

btnPromedio.addEventListener("click", generarEstudiantes);

function generarEstudiantes() {
  let arrayEstudiante = [];

  let totalEstudiantes = parseInt(document.querySelector("#inputNumeroEstudiantes").value);
  let contador = 1;

  if (isNaN(totalEstudiantes) || totalEstudiantes <= 0) {
    alert("Ingrese un número válido de estudiantes");
    return;
  }
  while (contador <= totalEstudiantes) {
    let estudiante = prompt(`Ingrese el nombre del estudiante ${contador}`);

    if (!estudiante || estudiante.trim() === "") {
      estudiante = `Estudiante ${contador}`;
    }

    let calificacion;
    let convertir = 0;

    do {
      calificacion = prompt(`Ingrese la calificación del estudiante ${contador} (0 - 10)`);
      convertir = parseFloat(calificacion);
    } while (isNaN(convertir) || convertir < 0 || convertir > 10);

    arrayEstudiante.push([estudiante.trim(), convertir.toFixed(2)]);
    contador++;
  }

  let calificacionAlta = 0;
  let promedio = 0;
  let posicion = arrayEstudiante[0];

  let listado = "<h3>Listado de estudiantes registrados</h3>";
  listado += "<ol>";
  for (let indice of arrayEstudiante) {
    let nombre = indice[0];
    let nota = parseFloat(indice[1]);

    listado += `<li><b>Nombre:</b> ${nombre} - <b>Calificación:</b> ${nota.toFixed(2)}</li>`;

    if (nota > calificacionAlta) {
      calificacionAlta = nota;
      posicion = indice;
    }

    promedio += nota;
  }

  listado += "</ol>";

  let promedioFinal = (promedio / arrayEstudiante.length).toFixed(2);

  listado += `<p><b>Promedio de calificaciones:</b> ${promedioFinal}`;
  listado += `<br><b>Estudiante con mejor calificación:</b> ${posicion[0]} (${posicion[1]})</p>`;

  containerEstudiantes.innerHTML = listado;
}
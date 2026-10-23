function aviso() {
    alert("Bienvenido al mundo JavaScript :)");
}

function confirmacion() {
    let confirmacion = confirm("¿Desea salir de la sesión?");
    alert(`Valor seleccionado ${confirmacion}`);
}

function capturarDatos() {
    let nombre = prompt("¿Cual es su nombre?");
    let edad = prompt("¿Cual es su edad?", 0);
    alert(`Tu nombre es ${nombre} y tu edad ${edad}`);
}

function dibujarParrafo() {
    let parrafo = prompt("Escriba la información que desea visualizar en el parrafo");
    const p = document.querySelector("#idParrafo");
    p.innerHTML = parrafo;
}
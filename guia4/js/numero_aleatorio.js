const numeroAleatorio = Math.floor(Math.random() * 25) + 1;
const numeroIntentos = 3;
let intentos = 1;

function generarNumeroAleatorio() {
    let mensaje;
    const parrafo = document.querySelector("#idParrafo");

    if (intentos <= numeroIntentos) {
        let numero = parseInt(prompt(`¿Que número se ha generado (Intento ${intentos})?`));

        if (numero === numeroAleatorio) {
            mensaje = `¡Es sorprendente, pudiste adivinar el numero oculto (${numeroAleatorio}). Refresque la página para volver a jugar.`;
            intentos = numeroIntentos + 1; 
        } else if (intentos === numeroIntentos) {
            mensaje = `Su numero de intentos ha terminado. El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
        } else {
            let pista = numero > numeroAleatorio ? "más bajo" : "más alto";
            mensaje = `Vuelve a intentar. El número buscado es ${pista}. Quedan ${numeroIntentos - intentos} intentos.`;
        }
        intentos++;
    } else {
        mensaje = `Su numero de intentos ha terminado. El numero oculto era: ${numeroAleatorio}. Refresque la página para volver a jugar.`;
    }
    parrafo.innerHTML = mensaje;
}
let pedidos = [];

const btnAgregar = document.querySelector("#btnAgregar");
const btnFiltrar = document.querySelector("#btnFiltrar");
const btnMostrarTodos = document.querySelector("#btnMostrarTodos");
const btnLimpiar = document.querySelector("#btnLimpiar");
const tablaPedidosBody = document.querySelector("#tablaPedidosBody");
const totalUnidadesEl = document.querySelector("#totalUnidades");
const montoTotalEl = document.querySelector("#montoTotal");

btnAgregar.addEventListener("click", agregarPedido);
btnFiltrar.addEventListener("click", filtrarPedidos);
btnMostrarTodos.addEventListener("click", () => renderizarTabla(pedidos));
btnLimpiar.addEventListener("click", limpiarPedidos);

function agregarPedido() {
    const producto = document.querySelector("#inputProducto").value.trim();
    const precio = parseFloat(document.querySelector("#inputPrecio").value);
    const cantidad = parseInt(document.querySelector("#inputCantidad").value);

    if (!producto || isNaN(precio) || precio <= 0 || isNaN(cantidad) || cantidad < 1) {
        alert("Ingrese datos válidos, el precio debe ser mayor a 0 y la cantidad un entero mayor a 1");
        return;
    }

    pedidos.push({ producto, precio, cantidad });
    document.querySelector("#formPedido").reset();
    renderizarTabla(pedidos);
}

function filtrarPedidos() {
    const precioMaximo = parseFloat(document.querySelector("#inputFiltroPrecio").value);
    if (isNaN(precioMaximo) || precioMaximo <= 0) {
        alert("Ingrese un precio máximo válido ");
        return;
    }

    const pedidosFiltrados = pedidos.filter(pedido => pedido.precio <= precioMaximo);
    renderizarTabla(pedidosFiltrados);
}

function limpiarPedidos() {
    pedidos = [];
    renderizarTabla(pedidos);
}

function renderizarTabla(arregloPedidos) {
    const filas = arregloPedidos.map(pedido => {
        const subtotal = pedido.precio * pedido.cantidad;
        return `<tr>
                    <td>${pedido.producto}</td>
                    <td>$${pedido.precio.toFixed(2)}</td>
                    <td>${pedido.cantidad}</td>
                    <td>$${subtotal.toFixed(2)}</td>
                </tr>`;
    });
    tablaPedidosBody.innerHTML = filas.join("");
    calcularTotales(arregloPedidos);
}

function calcularTotales(arregloPedidos) {
    const totalUnidades = arregloPedidos.reduce((acumulador, pedido) => acumulador + pedido.cantidad, 0);
    const montoTotal = arregloPedidos.reduce((acumulador, pedido) => acumulador + (pedido.precio * pedido.cantidad), 0);

    totalUnidadesEl.textContent = totalUnidades;
    montoTotalEl.textContent = `$${montoTotal.toFixed(2)}`;
}
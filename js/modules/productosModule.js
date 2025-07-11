import { agregarProductoAlCarrito, actualizarContadorGlobal } from './carritoModule.js';

// Inicializar botones "Agregar al carrito"
export function inicializarBotonesAgregar() {
    const botones = document.querySelectorAll('.agregar-carrito');
    
    botones.forEach(boton => {
        boton.addEventListener('click', (e) => {
            const card = e.target.closest('.card');
            
            // Obtener datos del producto
            const nombre = card.querySelector('.card-title').textContent;
            const precioTexto = card.querySelector('.text-success').textContent;
            const precio = parseFloat(precioTexto.replace('$', ''));
            const cantidadInput = card.querySelector('.cantidad');
            const cantidad = parseInt(cantidadInput.value) || 1;
            
            // Validar datos
            if (!nombre || isNaN(precio) || isNaN(cantidad)) {
                alert('Error al obtener datos del producto');
                return;
            }
            
            // Intentar agregar al carrito
            if (agregarProductoAlCarrito(nombre, precio, cantidad)) {
                alert('Producto agregado al carrito');
                // Resetear cantidad
                cantidadInput.value = 1;
            }
        });
    });
}

// Cargar carrito al iniciar (para contador)
export function inicializarCarritoDesdeProductos() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        actualizarContadorGlobal();
    }
}
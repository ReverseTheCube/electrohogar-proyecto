import { actualizarContadorGlobal } from './carritoModule.js';

// Cargar carrito al iniciar (para contador)
export function inicializarCarritoDesdeProductos() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        actualizarContadorGlobal();
    }
}

console.log('✅ Módulo de productos (solo apoyo) cargado');
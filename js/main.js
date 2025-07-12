// =====================================================
// MAIN.JS - VERSIÓN FINAL CORRECTA SIN DUPLICADOS
// =====================================================

// Importar módulos
import { 
    inicializarCarrito, 
    vaciarCarrito, 
    mostrarCarrito,
    actualizarCantidad,
    eliminarProducto 
} from './modules/carritoModule.js';

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando ElectroHogar...');
    
    // Inicializar carrito desde localStorage
    inicializarCarrito();
    console.log('✅ Carrito inicializado');
    
    // Página del carrito
    if (document.getElementById('carrito-body')) {
        console.log('🛒 Página de carrito detectada');
        mostrarCarrito();
        
        // Evento para vaciar carrito
        const vaciarBtn = document.getElementById('vaciar-carrito');
        if (vaciarBtn) {
            vaciarBtn.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
                    vaciarCarrito();
                    mostrarCarrito();
                }
            });
        }
        
        // Evento delegado para cambios de cantidad
        document.getElementById('carrito-body').addEventListener('change', (e) => {
            if (e.target.classList.contains('cantidad-producto')) {
                const index = parseInt(e.target.dataset.index);
                const nuevaCantidad = parseInt(e.target.value);
                if (nuevaCantidad > 0) {
                    actualizarCantidad(index, nuevaCantidad);
                }
            }
        });
        
        // Evento delegado para eliminar productos
        document.getElementById('carrito-body').addEventListener('click', (e) => {
            if (e.target.closest('.btn-eliminar')) {
                const index = parseInt(e.target.closest('.btn-eliminar').dataset.index);
                if (confirm('¿Eliminar este producto del carrito?')) {
                    eliminarProducto(index);
                }
            }
        });
    }
    
    // Página de checkout
    if (document.getElementById('checkout-form')) {
        console.log('💳 Página de checkout detectada');
        // El módulo se carga automáticamente via <script> en checkout.html
    }
    
    console.log('🎉 ElectroHogar inicializado correctamente');
});
// Importar módulos
import { 
    inicializarCarrito, 
    agregarProductoAlCarrito, 
    vaciarCarrito, 
    mostrarCarrito,
    actualizarCantidad,
    eliminarProducto 
} from './modules/carritoModule.js';

import { inicializarBotonesAgregar } from './modules/productosModule.js';

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando ElectroHogar...');
    
    // Inicializar carrito desde localStorage
    inicializarCarrito();
    console.log('✅ Carrito inicializado');
    
    // Verificar si estamos en la página de productos
    if (document.querySelector('.agregar-carrito')) {
        console.log('📦 Página de productos detectada');
        
        // Inicializar botones de agregar al carrito manualmente
        const botones = document.querySelectorAll('.agregar-carrito');
        console.log(`🔘 Encontrados ${botones.length} botones de agregar al carrito`);
        
        botones.forEach((boton, index) => {
            console.log(`🔗 Configurando botón ${index + 1}`);
            
            boton.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🖱️ Botón clickeado');
                
                const card = e.target.closest('.card');
                if (!card) {
                    console.error('❌ No se encontró la tarjeta del producto');
                    return;
                }
                
                // Obtener datos del producto
                const nombre = card.querySelector('.card-title').textContent.trim();
                const precioTexto = boton.getAttribute('data-precio');
                const precio = parseFloat(precioTexto);
                const cantidadInput = card.querySelector('.cantidad');
                const cantidad = parseInt(cantidadInput.value) || 1;
                
                console.log('📝 Datos del producto:', {
                    nombre: nombre,
                    precio: precio,
                    cantidad: cantidad
                });
                
                // Validar datos
                if (!nombre || isNaN(precio) || isNaN(cantidad)) {
                    console.error('❌ Error en los datos del producto');
                    alert('Error al obtener datos del producto');
                    return;
                }
                
                // Intentar agregar al carrito
                console.log('🛒 Intentando agregar al carrito...');
                const resultado = agregarProductoAlCarrito(nombre, precio, cantidad);
                
                if (resultado) {
                    console.log('✅ Producto agregado exitosamente');
                    alert(`${nombre} agregado al carrito correctamente`);
                    // Resetear cantidad
                    cantidadInput.value = 1;
                } else {
                    console.log('❌ Error al agregar producto');
                }
            });
        });
        
        console.log('✅ Botones de carrito configurados manualmente');
        
        // También intentar inicializar con el módulo original por si acaso
        try {
            inicializarBotonesAgregar();
            console.log('✅ Módulo de productos también inicializado');
        } catch (error) {
            console.log('⚠️ Error en módulo de productos:', error);
        }
    }
    
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
        // Página de checkout
if (document.getElementById('checkout-form')) {
    console.log('💳 Página de checkout detectada');
    // El módulo se carga automáticamente
}
    }
    
    
    console.log('🎉 ElectroHogar inicializado correctamente');
});
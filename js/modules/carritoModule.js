// =====================================================
// MÓDULO DEL CARRITO - COMPATIBLE CON CHECKOUT
// ✅ Sin duplicados + IGV incluido + Compatible con validación
// =====================================================

// Constantes
const MAX_PRODUCTOS = 10;
let carrito = [];
let eventListenersConfigurados = false; // Prevenir duplicados

// ARREGLOS BIDIMENSIONALES
let historialCompras = [
    ["2025-01-15", "Aire Acondicionado", 1, 399.99, "Completada"],
    ["2025-01-14", "Batidora", 2, 89.99, "Completada"],
    ["2025-01-13", "Refrigeradora", 1, 499.99, "Pendiente"],
    ["2025-01-12", "Cocina", 1, 329.99, "Completada"],
    ["2025-01-11", "Balanza Digital", 3, 259.99, "Completada"]
];

const descuentosPorCantidad = [
    [1, 1, 0],      // [cantidad_min, cantidad_max, descuento_porcentaje]
    [2, 2, 5],
    [3, 4, 10],
    [5, 7, 15],
    [8, 10, 20],
    [11, 999, 25]
];

// ==================== INICIALIZACIÓN ====================
export function inicializarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarContadorGlobal();
    }
    
    // 🔧 SOLO configurar event listeners si NO estamos en checkout
    if (!esCheckoutPage()) {
        configurarEventListenersUnicos();
    }
}

// 🔧 FUNCIÓN: Detectar si estamos en checkout
function esCheckoutPage() {
    return document.getElementById('checkout-form') !== null;
}

// 🔧 FUNCIÓN: Configurar event listeners sin duplicados
function configurarEventListenersUnicos() {
    if (eventListenersConfigurados) {
        console.log('⚠️ Event listeners ya configurados, evitando duplicados');
        return;
    }
    
    console.log('🔧 Configurando event listeners únicos para carrito...');
    
    // Usar delegación de eventos SOLO para productos
    document.addEventListener('click', function(e) {
        // SOLO procesar si es botón de agregar carrito Y no estamos en checkout
        if ((e.target.classList.contains('agregar-carrito') || 
             e.target.closest('.agregar-carrito')) && !esCheckoutPage()) {
            
            const boton = e.target.classList.contains('agregar-carrito') ? 
                         e.target : e.target.closest('.agregar-carrito');
            
            // Prevenir múltiples ejecuciones
            e.preventDefault();
            e.stopPropagation();
            
            manejarClickAgregarCarrito(boton);
        }
    });
    
    eventListenersConfigurados = true;
    console.log('✅ Event listeners únicos configurados (excluyendo checkout)');
}

// 🔧 FUNCIÓN: Manejar click de agregar al carrito
function manejarClickAgregarCarrito(boton) {
    console.log('🛒 Procesando click único en botón de carrito...');
    
    // Obtener datos del producto
    const card = boton.closest('.card');
    if (!card) {
        console.error('❌ No se encontró la tarjeta del producto');
        return;
    }
    
    const nombre = card.querySelector('.card-title').textContent.trim();
    const precioTexto = boton.getAttribute('data-precio') || 
                       card.querySelector('.text-success').textContent.replace(/[^\d.]/g, '');
    const precio = parseFloat(precioTexto);
    const cantidadInput = card.querySelector('.cantidad');
    const cantidad = parseInt(cantidadInput ? cantidadInput.value : 1) || 1;
    
    console.log('📝 Datos obtenidos:', { nombre, precio, cantidad });
    
    // Validar datos
    if (!nombre || isNaN(precio) || isNaN(cantidad)) {
        alert('Error al obtener datos del producto');
        return;
    }
    
    // Agregar al carrito
    if (agregarProductoAlCarrito(nombre, precio, cantidad)) {
        alert(`✅ ${nombre} agregado al carrito (${cantidad} unidad${cantidad > 1 ? 'es' : ''})`);
        
        // Resetear cantidad si existe el input
        if (cantidadInput) {
            cantidadInput.value = 1;
        }
    }
}

// OPERADORES MATEMÁTICOS - Calcular descuento por cantidad
function calcularDescuentoPorCantidad(totalProductos) {
    let descuentoPorcentaje = 0;
    
    // ESTRUCTURA FOR para buscar el descuento correspondiente
    for (let i = 0; i < descuentosPorCantidad.length; i++) {
        const rangoMin = descuentosPorCantidad[i][0];
        const rangoMax = descuentosPorCantidad[i][1];
        const descuento = descuentosPorCantidad[i][2];
        
        if (totalProductos >= rangoMin && totalProductos <= rangoMax) {
            descuentoPorcentaje = descuento;
            break;
        }
    }
    
    return descuentoPorcentaje;
}

// IF-ELSE - Validar y agregar producto con lógica avanzada
export function agregarProductoAlCarrito(nombre, precio, cantidad) {
    console.log(`🛒 Agregando: ${nombre} x${cantidad}`);
    
    // Validaciones básicas
    if (cantidad < 1) {
        alert('La cantidad debe ser al menos 1');
        return false;
    }
    
    // Cargar carrito actual
    let carrito = [];
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
        carrito = [];
    }
    
    if (carrito.length >= 10) {
        alert('Máximo 10 productos permitidos');
        return false;
    }
    
    // Buscar producto existente
    const productoExistente = carrito.find(p => p.nombre === nombre);
    
    if (productoExistente) {
        const nuevaCantidad = productoExistente.cantidad + cantidad;
        
        if (nuevaCantidad > 20) {
            alert(`No puedes agregar más de 20 unidades del mismo producto. Actualmente tienes ${productoExistente.cantidad}`);
            return false;
        } else {
            productoExistente.cantidad = nuevaCantidad;
            productoExistente.subtotal = productoExistente.precio * nuevaCantidad;
        }
    } else {
        // Producto nuevo
        const nuevoProducto = {
            nombre,
            precio,
            cantidad,
            subtotal: precio * cantidad,
            fechaAgregado: new Date().toLocaleDateString()
        };
        carrito.push(nuevoProducto);
    }
    
    // Guardar carrito
    try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        console.log('✅ Carrito guardado');
    } catch (error) {
        console.error('❌ Error al guardar carrito:', error);
        return false;
    }
    
    // 🔧 IMPORTANTE: Actualizar contador INMEDIATAMENTE
    actualizarContadorGlobal();
    
    // También actualizar con un pequeño delay para asegurar
    setTimeout(() => {
        actualizarContadorGlobal();
    }, 100);
    
    console.log(`✅ Producto "${nombre}" agregado exitosamente`);
    return true;
}


// SWITCH-CASE - Aplicar descuentos especiales por tipo de producto
function aplicarDescuentoEspecial(nombreProducto, precio) {
    let descuentoEspecial = 0;
    let razonDescuento = "";
    
    switch (nombreProducto.toLowerCase()) {
        case "aire acondicionado":
            descuentoEspecial = precio * 0.15;
            razonDescuento = "Descuento de temporada de verano";
            break;
        case "refrigeradora":
            descuentoEspecial = precio * 0.20;
            razonDescuento = "Liquidación de modelos anteriores";
            break;
        case "batidora":
        case "balanza digital":
            descuentoEspecial = precio * 0.08;
            razonDescuento = "Descuento en electrodomésticos de cocina";
            break;
        case "cocina":
            descuentoEspecial = precio * 0.12;
            razonDescuento = "Promoción especial en cocinas";
            break;
        case "alarmas de seguridad":
            descuentoEspecial = precio * 0.25;
            razonDescuento = "Mega descuento en seguridad";
            break;
        default:
            descuentoEspecial = 0;
            razonDescuento = "Sin descuento especial";
            break;
    }
    
    return { descuento: descuentoEspecial, razon: razonDescuento };
}

// ==================== MOSTRAR CARRITO ====================
export function mostrarCarrito() {
    const carritoBody = document.getElementById('carrito-body');
    const totalElemento = document.getElementById('total');
    
    if (!carritoBody) return;
    
    if (carrito.length === 0) {
        carritoBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <p class="text-muted">Tu carrito está vacío</p>
                    <a href="productos.html" class="btn btn-primary">
                        <i class="fas fa-shopping-bag me-2"></i>Ver Productos
                    </a>
                </td>
            </tr>
        `;
        if (totalElemento) totalElemento.textContent = '$0.00';
        return;
    }
    
    let totalGeneral = 0;
    let html = '';
    
    carrito.forEach((producto, index) => {
        // Aplicar descuentos especiales
        const descuentoInfo = aplicarDescuentoEspecial(producto.nombre, producto.precio);
        const precioConDescuento = producto.precio - descuentoInfo.descuento;
        const subtotalConDescuento = precioConDescuento * producto.cantidad;
        
        html += `
            <tr>
                <td>
                    <strong>${producto.nombre}</strong>
                    ${descuentoInfo.descuento > 0 ? 
                        `<br><small class="text-success">🎯 ${descuentoInfo.razon}</small>` : ''}
                </td>
                <td>
                    <div>
                        ${descuentoInfo.descuento > 0 ? 
                            `<span class="text-decoration-line-through text-muted">$${producto.precio.toFixed(2)}</span><br>
                             <span class="text-success fw-bold">$${precioConDescuento.toFixed(2)}</span>` : 
                            `<span>$${producto.precio.toFixed(2)}</span>`}
                    </div>
                    <small class="text-muted">🏷️ IGV incluido</small>
                </td>
                <td>
                    <input type="number" class="form-control cantidad-producto" 
                           value="${producto.cantidad}" min="1" max="20" 
                           data-index="${index}" style="width: 80px;">
                </td>
                <td>
                    <strong>$${subtotalConDescuento.toFixed(2)}</strong>
                    ${descuentoInfo.descuento > 0 ? 
                        `<br><small class="text-success">Ahorro: $${(descuentoInfo.descuento * producto.cantidad).toFixed(2)}</small>` : ''}
                </td>
                <td>
                    <button class="btn btn-danger btn-sm btn-eliminar" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        
        totalGeneral += subtotalConDescuento;
    });
    
    // Calcular descuento por cantidad total
    const totalProductos = carrito.reduce((sum, p) => sum + p.cantidad, 0);
    const descuentoPorcentaje = calcularDescuentoPorCantidad(totalProductos);
    const descuentoPorCantidad = totalGeneral * (descuentoPorcentaje / 100);
    const totalFinal = totalGeneral - descuentoPorCantidad;
    
    carritoBody.innerHTML = html;
    
    // 🔧 SOLUCIÓN: Mostrar total con IGV incluido (no adicional)
    if (totalElemento) {
        let textoTotal = `$${totalFinal.toFixed(2)}`;
        if (descuentoPorcentaje > 0) {
            textoTotal += ` <small class="text-success">(${descuentoPorcentaje}% desc. cantidad)</small>`;
        }
        totalElemento.innerHTML = textoTotal;
    }
    
    // Mostrar resumen detallado
    mostrarResumenDetallado(totalGeneral, descuentoPorCantidad, totalFinal, totalProductos);
}

// 🔧 FUNCIÓN: Mostrar resumen con IGV incluido
function mostrarResumenDetallado(subtotal, descuentoCantidad, total, totalProductos) {
    const resumenExistente = document.getElementById('resumen-detallado');
    if (resumenExistente) {
        resumenExistente.remove();
    }
    
    const carritoContainer = document.querySelector('.table-responsive');
    if (!carritoContainer) return;
    
    // 🔧 IGV incluido, no adicional
    const igvIncluido = total * 0.153; // IGV que ya está incluido en los precios
    const baseImponible = total - igvIncluido;
    
    const resumenHTML = `
        <div id="resumen-detallado" class="mt-4 p-3 bg-light rounded">
            <h5 class="mb-3">📊 Resumen Detallado del Pedido</h5>
            <div class="row">
                <div class="col-6">
                    <small>📦 Total productos:</small><br>
                    <small>💰 Subtotal con descuentos:</small><br>
                    <small>📊 Base imponible:</small><br>
                    <small>🏷️ IGV (18% incluido):</small><br>
                    ${descuentoCantidad > 0 ? '<small class="text-success">🎯 Descuento por cantidad:</small><br>' : ''}
                </div>
                <div class="col-6 text-end">
                    <small>${totalProductos} unidades</small><br>
                    <small>$${subtotal.toFixed(2)}</small><br>
                    <small>$${baseImponible.toFixed(2)}</small><br>
                    <small>$${igvIncluido.toFixed(2)}</small><br>
                    ${descuentoCantidad > 0 ? `<small class="text-success">-$${descuentoCantidad.toFixed(2)}</small><br>` : ''}
                </div>
            </div>
            <hr>
            <div class="d-flex justify-content-between">
                <strong>TOTAL FINAL (IGV incluido):</strong>
                <strong class="text-primary">$${total.toFixed(2)}</strong>
            </div>
            <small class="text-muted mt-2 d-block">
                ✅ Todos los precios incluyen IGV del 18%
            </small>
        </div>
    `;
    
    carritoContainer.insertAdjacentHTML('afterend', resumenHTML);
}

// ==================== FUNCIONES AUXILIARES ====================
export function actualizarCantidad(index, nuevaCantidad) {
    if (index >= 0 && index < carrito.length && nuevaCantidad > 0) {
        if (nuevaCantidad > 20) {
            alert('Máximo 20 unidades por producto');
            return false;
        } else {
            carrito[index].cantidad = nuevaCantidad;
            carrito[index].subtotal = carrito[index].precio * nuevaCantidad;
            guardarCarrito();
            mostrarCarrito();
            return true;
        }
    }
    return false;
}

export function eliminarProducto(index) {
    if (index >= 0 && index < carrito.length) {
        const nombreProducto = carrito[index].nombre;
        carrito.splice(index, 1);
        guardarCarrito();
        mostrarCarrito();
        actualizarContadorGlobal();
        return true;
    }
    return false;
}

export function vaciarCarrito() {
    const cantidadProductos = carrito.length;
    carrito = [];
    guardarCarrito();
    actualizarContadorGlobal();
    alert(`Carrito vaciado. ${cantidadProductos} productos eliminados.`);
    mostrarCarrito();
}

export function obtenerCarrito() {
    return carrito;
}

export function obtenerTotalCarrito() {
    return carrito.reduce((total, producto) => {
        const descuentoInfo = aplicarDescuentoEspecial(producto.nombre, producto.precio);
        const precioConDescuento = producto.precio - descuentoInfo.descuento;
        return total + (precioConDescuento * producto.cantidad);
    }, 0);
}

export function actualizarContadorGlobal() {
    console.log('🔄 Actualizando contador del carrito...');
    
    // Obtener carrito actual desde localStorage
    let carrito = [];
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
        carrito = [];
    }
    
    // Calcular total de productos
    let totalProductos = 0;
    carrito.forEach(producto => {
        totalProductos += producto.cantidad;
    });
    
    console.log(`📊 Total productos: ${totalProductos}`);
    
    // Buscar el elemento contador
    const contador = document.getElementById('contador-carrito');
    
    if (contador) {
        // Actualizar el número
        contador.textContent = totalProductos;
        
        // Mostrar/ocultar según cantidad
        if (totalProductos > 0) {
            contador.style.display = 'inline';
            
            // Cambiar color según cantidad
            if (totalProductos <= 3) {
                contador.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success';
            } else if (totalProductos <= 7) {
                contador.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark';
            } else {
                contador.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger';
            }
            
            // Pequeña animación
            contador.style.transform = 'scale(1.2)';
            setTimeout(() => {
                contador.style.transform = 'scale(1)';
                contador.style.transition = 'transform 0.2s ease';
            }, 200);
            
        } else {
            // Ocultar si no hay productos
            contador.style.display = 'none';
        }
        
        console.log(`✅ Contador actualizado: ${totalProductos}`);
    } else {
        console.warn('⚠️ Elemento #contador-carrito no encontrado');
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
export function inicializarContadorCarrito() {
    console.log('🚀 Inicializando contador...');
    
    // Actualizar inmediatamente
    actualizarContadorGlobal();
    
    // Verificar si hay cambios en localStorage (para otras pestañas)
    window.addEventListener('storage', function(e) {
        if (e.key === 'carrito') {
            console.log('🔄 Carrito cambió en otra pestaña, actualizando contador...');
            actualizarContadorGlobal();
        }
    });
}
// Auto-inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarContadorCarrito);
} else {
    inicializarContadorCarrito();
}
// ==================== INICIALIZACIÓN AUTOMÁTICA ====================
// 🔧 Auto-inicializar cuando se carga el módulo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCarrito);
} else {
    inicializarCarrito();
}

console.log('✅ Módulo de carrito compatible cargado - Sin interferir con checkout');
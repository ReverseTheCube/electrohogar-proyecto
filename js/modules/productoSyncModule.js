// ==================== VARIABLES Y CONSTANTES ====================
const PRODUCTOS_KEY = 'electrohogar_productos_dinamicos';
const CONTADOR_KEY = 'electrohogar_contador_productos';

// ARREGLO BIDIMENSIONAL para productos base (los que ya existen)
const PRODUCTOS_BASE = [
    ['Aire Acondicionado', 399.99, 'imagenes/aireacondicionado.jpg', 'Mantén tu hogar fresco durante el verano con nuestra gama de aires acondicionados eficientes.', 'LG', 'CoolMaster 12000', '12,000 BTU', '1 año', 15],
    ['Alarmas de Seguridad', 199.99, 'imagenes/alarmas.jpg', 'Protege tu hogar con nuestros sistemas de alarma modernos y confiables.', 'Hikvision', 'SecureX300', 'Sensor de movimiento, sirena, control remoto', '2 años', 25],
    ['Refrigeradora', 499.99, 'imagenes/refrigeradoras.jpg', 'Gran variedad de refrigeradoras con tecnologías de ahorro energético.', 'Samsung', 'FrostCool 300L', '300 litros', '1 año', 8],
    ['Batidora', 89.99, 'imagenes/batidoras.jpg', 'Prepara tus recetas favoritas con nuestras batidoras potentes y versátiles.', 'Oster', 'PowerMix 450', '5 velocidades', '1 año', 30],
    ['Cocina', 329.99, 'imagenes/cocina.jpg', 'Modernas cocinas a gas y eléctricas con diseños funcionales.', 'Bosch', 'DualHeat 5Q', 'Gas + Eléctrica', '2 años', 12],
    ['Balanza Digital', 259.99, 'imagenes/balanzadigital.png', 'Balanzas de precisión para cocina y negocios pequeños.', 'Tanita', 'ProScale X500', '5 kg', '1 año', 20],
    ['Amplificador de Guitarra', 679.99, 'imagenes/amplificador.png', 'Amplifica el sonido de tu instrumento y atrapa a los demás.', 'Marshall', 'MG15GR', '15W', '1 año', 5]
];

// ==================== FUNCIONES DE GESTIÓN DE PRODUCTOS ====================

// Función para obtener productos dinámicos del localStorage
function obtenerProductosDinamicos() {
    try {
        const productos = localStorage.getItem(PRODUCTOS_KEY);
        return productos ? JSON.parse(productos) : [];
    } catch (error) {
        console.error('Error al obtener productos dinámicos:', error);
        return [];
    }
}

// Función para guardar productos dinámicos en localStorage
function guardarProductosDinamicos(productos) {
    try {
        localStorage.setItem(PRODUCTOS_KEY, JSON.stringify(productos));
        console.log('✅ Productos dinámicos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar productos dinámicos:', error);
    }
}

// Función para obtener el contador de productos
function obtenerContadorProductos() {
    try {
        const contador = localStorage.getItem(CONTADOR_KEY);
        return contador ? parseInt(contador) : PRODUCTOS_BASE.length;
    } catch (error) {
        return PRODUCTOS_BASE.length;
    }
}

// Función para actualizar el contador de productos
function actualizarContadorProductos(contador) {
    try {
        localStorage.setItem(CONTADOR_KEY, contador.toString());
    } catch (error) {
        console.error('Error al actualizar contador:', error);
    }
}

// ==================== FUNCIÓN PRINCIPAL: AGREGAR PRODUCTO ====================
function agregarProductoDinamico(datosProducto) {
    console.log('📦 Agregando producto dinámico:', datosProducto);
    
    // Obtener productos existentes
    const productosExistentes = obtenerProductosDinamicos();
    
    // Obtener contador actual
    let contador = obtenerContadorProductos();
    contador++;
    
    // Crear estructura del producto
    const nuevoProducto = {
        id: `prod_${contador}`,
        nombre: datosProducto.nombre,
        precio: parseFloat(datosProducto.precio),
        imagen: datosProducto.imagen || 'https://via.placeholder.com/300x200/007bff/ffffff?text=' + encodeURIComponent(datosProducto.nombre),
        descripcion: datosProducto.descripcion || 'Producto agregado dinámicamente',
        marca: datosProducto.marca || 'ElectroHogar',
        modelo: datosProducto.modelo || 'Modelo Estándar',
        caracteristicas: datosProducto.caracteristicas || 'Características especiales',
        garantia: datosProducto.garantia || '1 año',
        stock: parseInt(datosProducto.stock) || 10,
        categoria: datosProducto.categoria || 'general',
        fechaCreacion: new Date().toISOString(),
        creadoEn: 'gestion-productos'
    };
    
    // Agregar al array de productos
    productosExistentes.push(nuevoProducto);
    
    // Guardar en localStorage
    guardarProductosDinamicos(productosExistentes);
    actualizarContadorProductos(contador);
    
    // Si estamos en productos.html, agregar inmediatamente al DOM
    if (window.location.pathname.includes('productos.html')) {
        agregarProductoAlDOMProductos(nuevoProducto);
    }
    
    console.log('✅ Producto agregado exitosamente con ID:', nuevoProducto.id);
    return nuevoProducto;
}

// ==================== FUNCIÓN PARA AGREGAR AL DOM DE PRODUCTOS.HTML ====================
function agregarProductoAlDOMProductos(producto) {
    const container = document.getElementById('productos-container');
    if (!container) {
        console.log('⚠️ No se encontró el contenedor de productos');
        return;
    }
    
    // Crear elemento de producto
    const productoElement = document.createElement('div');
    productoElement.className = 'col fade-in';
    productoElement.setAttribute('data-precio', producto.precio);
    productoElement.setAttribute('data-stock', producto.stock);
    productoElement.setAttribute('data-disponible', 'true');
    productoElement.setAttribute('data-producto-id', producto.id);
    productoElement.setAttribute('data-dinamico', 'true');
    
    productoElement.innerHTML = `
        <div class="card h-100 producto-dinamico">
            <div class="producto-badge">
                <span class="badge bg-success">Nuevo</span>
            </div>
            <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}" 
                 onerror="this.src='https://via.placeholder.com/300x200/28a745/ffffff?text=${encodeURIComponent(producto.nombre)}'">
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${producto.nombre}</h5>
                <p class="card-text">${producto.descripcion}</p>
                <ul class="list-unstyled small">
                    <li><strong>Marca:</strong> ${producto.marca}</li>
                    <li><strong>Modelo:</strong> ${producto.modelo}</li>
                    <li><strong>Características:</strong> ${producto.caracteristicas}</li>
                    <li><strong>Garantía:</strong> ${producto.garantia}</li>
                    <li><strong>Disponibilidad:</strong> En stock (${producto.stock} unidades)</li>
                </ul>
                <p class="text-success fw-bold">$${producto.precio.toFixed(2)}</p>
                <div class="input-group mb-2">
                    <label class="input-group-text">Cantidad</label>
                    <input type="number" class="form-control cantidad" min="1" max="${producto.stock}" value="1">
                </div>
                <button class="btn btn-success w-100 agregar-carrito" 
                        data-producto="${producto.nombre}" 
                        data-precio="${producto.precio}">
                    <i class="fas fa-cart-plus me-2"></i>Agregar al carrito
                </button>
                <div class="mt-2">
                    <button class="btn btn-outline-warning btn-sm w-100" onclick="editarProductoDinamico('${producto.id}')">
                        <i class="fas fa-edit me-1"></i>Editar Producto
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Agregar al DOM con animación
    productoElement.style.opacity = '0';
    productoElement.style.transform = 'translateY(20px)';
    container.appendChild(productoElement);
    
    // Animar entrada
    setTimeout(() => {
        productoElement.style.transition = 'all 0.5s ease';
        productoElement.style.opacity = '1';
        productoElement.style.transform = 'translateY(0)';
    }, 100);
    
    
    
    console.log('✅ Producto agregado al DOM de productos.html');
}

// ==================== CARGAR PRODUCTOS DINÁMICOS EN PRODUCTOS.HTML ====================
function cargarProductosDinamicosEnPagina() {
    console.log('🔄 Cargando productos dinámicos en la página...');
    
    const productosUsuario = obtenerProductosDinamicos();
    
    if (productosUsuario.length === 0) {
        console.log('ℹ️ No hay productos dinámicos para cargar');
        return;
    }
    
    // ESTRUCTURA FOR - Cargar cada producto dinámico
    for (let i = 0; i < productosUsuario.length; i++) {
        const producto = productosUsuario[i];
        agregarProductoAlDOMProductos(producto);
    }
    
    console.log(`✅ ${productosUsuario.length} productos dinámicos cargados`);
    
    // Mostrar notificación si hay productos nuevos
    if (productosUsuario.length > 0) {
        mostrarNotificacionProductos(productosUsuario.length);
    }
}



// ==================== FUNCIÓN PARA EDITAR PRODUCTOS DINÁMICOS ====================
function editarProductoDinamico(productoId) {
    const productos = obtenerProductosDinamicos();
    const producto = productos.find(p => p.id === productoId);
    
    if (!producto) {
        alert('❌ Producto no encontrado');
        return;
    }
    
    // Prompt para editar datos básicos
    const nuevoNombre = prompt('📝 Nombre del producto:', producto.nombre);
    if (!nuevoNombre) return;
    
    const nuevoPrecio = prompt('💰 Precio del producto:', producto.precio);
    if (!nuevoPrecio || isNaN(parseFloat(nuevoPrecio))) return;
    
    const nuevaDescripcion = prompt('📄 Descripción del producto:', producto.descripcion);
    if (!nuevaDescripcion) return;
    
    const nuevoStock = prompt('📦 Stock disponible:', producto.stock);
    if (!nuevoStock || isNaN(parseInt(nuevoStock))) return;
    
    // Actualizar producto
    const index = productos.findIndex(p => p.id === productoId);
    if (index !== -1) {
        productos[index] = {
            ...producto,
            nombre: nuevoNombre,
            precio: parseFloat(nuevoPrecio),
            descripcion: nuevaDescripcion,
            stock: parseInt(nuevoStock),
            fechaModificacion: new Date().toISOString()
        };
        
        // Guardar cambios
        guardarProductosDinamicos(productos);
        
        // Recargar página para mostrar cambios
        if (confirm('✅ Producto actualizado correctamente.\n¿Recargar la página para ver los cambios?')) {
            window.location.reload();
        }
    }
}

// ==================== FUNCIÓN PARA ELIMINAR PRODUCTOS DINÁMICOS ====================
function eliminarProductoDinamico(productoId) {
    if (!confirm('🗑️ ¿Estás seguro de eliminar este producto?')) {
        return;
    }
    
    const productos = obtenerProductosDinamicos();
    const productosActualizados = productos.filter(p => p.id !== productoId);
    
    guardarProductosDinamicos(productosActualizados);
    
    // Eliminar del DOM
    const elemento = document.querySelector(`[data-producto-id="${productoId}"]`);
    if (elemento) {
        elemento.style.transition = 'all 0.3s ease';
        elemento.style.opacity = '0';
        elemento.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            elemento.remove();
        }, 300);
    }
    
    alert('✅ Producto eliminado correctamente');
}

// ==================== OBTENER TODOS LOS PRODUCTOS (BASE + DINÁMICOS) ====================
function obtenerTodosLosProductos() {
    const productosBase = PRODUCTOS_BASE.map((producto, index) => ({
        id: `base_${index}`,
        nombre: producto[0],
        precio: producto[1],
        imagen: producto[2],
        descripcion: producto[3],
        marca: producto[4],
        modelo: producto[5],
        caracteristicas: producto[6],
        garantia: producto[7],
        stock: producto[8],
        tipo: 'base'
    }));
    
    const productosDinamicos = obtenerProductosDinamicos().map(producto => ({
        ...producto,
        tipo: 'dinamico'
    }));
    
    return [...productosBase, ...productosDinamicos];
}

// ==================== ESTADÍSTICAS DE PRODUCTOS ====================
function obtenerEstadisticasProductos() {
    const productos = obtenerTodosLosProductos();
    const productosDinamicos = obtenerProductosDinamicos();
    
    return {
        total: productos.length,
        base: PRODUCTOS_BASE.length,
        dinamicos: productosDinamicos.length,
        stockTotal: productos.reduce((total, p) => total + p.stock, 0),
        valorTotalInventario: productos.reduce((total, p) => total + (p.precio * p.stock), 0)
    };
}

// ==================== FUNCIONES AUXILIARES ====================
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación temporal
    const notificacion = document.createElement('div');
    notificacion.className = `alert alert-${tipo} notification-toast`;
    notificacion.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    notificacion.innerHTML = `
        <strong>${tipo === 'success' ? '✅' : 'ℹ️'}</strong> ${mensaje}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Auto-remove después de 4 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notificacion.remove(), 300);
        }
    }, 4000);
}

function mostrarNotificacionProductos(cantidad) {
    const mensaje = `Se han cargado ${cantidad} producto${cantidad > 1 ? 's' : ''} adicional${cantidad > 1 ? 'es' : ''} creado${cantidad > 1 ? 's' : ''} desde el panel de gestión`;
    mostrarNotificacion(mensaje, 'success');
}

// ==================== INTEGRACIÓN CON GESTIÓN DE PRODUCTOS ====================
function integrarConGestionProductos() {
    // Función para ser llamada desde gestion-productos.html
    window.sincronizarConProductos = function(datosProducto) {
        console.log('🔄 Sincronizando producto con productos.html...', datosProducto);
        
        const producto = agregarProductoDinamico(datosProducto);
        
        // Notificar éxito
        if (typeof mostrarInfoTecnica !== 'undefined') {
            mostrarInfoTecnica(`✅ Producto "${producto.nombre}" sincronizado exitosamente con productos.html\n\nID: ${producto.id}\nPrecio: $${producto.precio}\nStock: ${producto.stock}`);
        }
        
        return producto;
    };
    
    // Función para obtener estadísticas
    window.obtenerEstadisticasProductos = obtenerEstadisticasProductos;
    window.obtenerTodosLosProductos = obtenerTodosLosProductos;
    
    // Funciones para editar/eliminar
    window.editarProductoDinamico = editarProductoDinamico;
    window.eliminarProductoDinamico = eliminarProductoDinamico;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Inicializando módulo de sincronización de productos...');
    
    // Integrar funciones globales
    integrarConGestionProductos();
    
    // Si estamos en productos.html, cargar productos dinámicos
    if (window.location.pathname.includes('productos.html')) {
        // Cargar productos dinámicos después de que la página se cargue
        setTimeout(() => {
            cargarProductosDinamicosEnPagina();
        }, 1000);
    }
    
    console.log('✅ Módulo de sincronización inicializado');
});

// ==================== EXPORTAR FUNCIONES ====================
export {
    agregarProductoDinamico,
    obtenerProductosDinamicos,
    cargarProductosDinamicosEnPagina,
    obtenerTodosLosProductos,
    obtenerEstadisticasProductos,
    editarProductoDinamico,
    eliminarProductoDinamico
};
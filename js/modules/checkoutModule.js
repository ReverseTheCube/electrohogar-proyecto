// =====================================================
// MÓDULO CHECKOUT - ELECTROHOGAR
// =====================================================

// ==================== DECLARACIÓN DE VARIABLES Y CONSTANTES ====================

// CONSTANTES del sistema
const CHECKOUT_CONFIG = {
    igv: 0.18,
    envioGratis: 500,
    maxCuponDescuento: 0.20,
    tiempoSesion: 1800000 // 30 minutos
};

const METODOS_ENVIO = {
    estandar: { precio: 0, dias: '3-5 días hábiles' },
    express: { precio: 15, dias: '24-48 horas' },
    premium: { precio: 25, dias: 'Mismo día' }
};

const METODOS_PAGO = ['tarjeta', 'yape', 'transferencia', 'contraentrega'];

// ARREGLOS BIDIMENSIONALES - Datos de ubicaciones
const UBICACIONES_PERU = [
    ['arequipa', 'Arequipa', ['Arequipa', 'Camaná', 'Caravelí'], ['Arequipa', 'Alto Selva Alegre', 'Cayma', 'Cerro Colorado']],
    ['lima', 'Lima', ['Lima', 'Huarochirí', 'Cañete'], ['Lima', 'Miraflores', 'San Isidro', 'Barranco', 'Surco']],
    ['cusco', 'Cusco', ['Cusco', 'Urubamba', 'Calca'], ['Cusco', 'San Blas', 'San Sebastián', 'Wanchaq']],
    ['trujillo', 'La Libertad', ['Trujillo', 'Ascope', 'Chepén'], ['Trujillo', 'El Porvenir', 'Florencia de Mora']],
    ['chiclayo', 'Lambayeque', ['Chiclayo', 'Ferreñafe', 'Lambayeque'], ['Chiclayo', 'José Leonardo Ortiz', 'La Victoria']]
];

// ARREGLOS BIDIMENSIONALES - Cupones de descuento
const CUPONES_DESCUENTO = [
    ['ELECTROHOGAR10', 0.10, 'Descuento del 10%', true],
    ['NUEVOCLIENTE15', 0.15, 'Descuento para nuevos clientes', true],
    ['VERANO2025', 0.20, 'Descuento de verano', true],
    ['ESTUDIANTE5', 0.05, 'Descuento estudiantil', true],
    ['FIDELIDAD25', 0.25, 'Cliente fiel', false]
];

// VARIABLES GLOBALES
let carritoActual = [];
let datosCheckout = {};
let calculosActuales = {};
let formularioValido = false;
let tiempoInicio = Date.now();

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Checkout ElectroHogar');
    
    // Cargar carrito y verificar que no esté vacío
    cargarCarritoDesdeStorage();
    
    // IF-ELSE - Verificar si hay productos en el carrito
    if (carritoActual.length === 0) {
        mostrarCarritoVacio();
        return;
    }
    
    // Inicializar componentes
    inicializarFormulario();
    inicializarEventos();
    cargarUbicaciones();
    mostrarResumenPedido();
    calcularTotales();
    
    // Hacer funciones disponibles globalmente
    window.aplicarCupon = aplicarCupon;
    window.cambiarMetodoEnvio = cambiarMetodoEnvio;
    window.cambiarMetodoPago = cambiarMetodoPago;
    
    console.log('✅ Checkout inicializado correctamente');
});

// ==================== CARGAR DATOS DEL CARRITO ====================
function cargarCarritoDesdeStorage() {
    try {
        const carritoGuardado = localStorage.getItem('carrito');
        carritoActual = carritoGuardado ? JSON.parse(carritoGuardado) : [];
        
        console.log(`📦 Carrito cargado: ${carritoActual.length} productos`);
        
        // ESTRUCTURA FOR - Mostrar productos en consola
        for (let i = 0; i < carritoActual.length; i++) {
            const producto = carritoActual[i];
            console.log(`  ${i + 1}. ${producto.nombre} - $${producto.precio} x ${producto.cantidad}`);
        }
        
    } catch (error) {
        console.error('Error al cargar carrito:', error);
        carritoActual = [];
    }
}

// ==================== MOSTRAR CARRITO VACÍO ====================
function mostrarCarritoVacio() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div class="text-center py-5">
            <i class="fas fa-shopping-cart fa-5x text-muted mb-4"></i>
            <h2>Tu carrito está vacío</h2>
            <p class="text-muted mb-4">Agrega algunos productos antes de proceder al checkout</p>
            <a href="productos.html" class="btn btn-primary btn-lg">
                <i class="fas fa-arrow-left me-2"></i>Volver a Productos
            </a>
        </div>
    `;
}

// ==================== MOSTRAR RESUMEN DEL PEDIDO ====================
function mostrarResumenPedido() {
    const container = document.getElementById('productos-resumen');
    container.innerHTML = '';
    
    // ESTRUCTURA FOREACH - Mostrar cada producto
    carritoActual.forEach((producto, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item-checkout';
        productItem.innerHTML = `
            <img src="https://via.placeholder.com/50x50/007bff/ffffff?text=${encodeURIComponent(producto.nombre.charAt(0))}" 
                 alt="${producto.nombre}" class="product-image-small">
            <div class="product-details">
                <div class="product-name">${producto.nombre}</div>
                <div class="product-quantity">Cantidad: ${producto.cantidad}</div>
            </div>
            <div class="product-price">$${(producto.precio * producto.cantidad).toFixed(2)}</div>
        `;
        container.appendChild(productItem);
    });
    
    // Actualizar contador en navbar
    actualizarContadorCarrito();
}

// ==================== CALCULAR TOTALES ====================
function calcularTotales() {
    console.log('🧮 Calculando totales del pedido...');
    
    let subtotal = 0;
    let totalProductos = 0;
    
    // ESTRUCTURA FOR - Calcular subtotal
    for (let i = 0; i < carritoActual.length; i++) {
        const producto = carritoActual[i];
        subtotal += producto.precio * producto.cantidad;
        totalProductos += producto.cantidad;
    }
    
    // Calcular descuento por cantidad (usando función del módulo carrito)
    let descuentoPorCantidad = 0;
    const porcentajeDescuento = calcularDescuentoPorCantidad(totalProductos);
    descuentoPorCantidad = subtotal * (porcentajeDescuento / 100);
    
    // Obtener descuento de cupón
    const descuentoCupon = calculosActuales.descuentoCupon || 0;
    
    // Calcular costo de envío
    const metodoEnvio = document.querySelector('input[name="metodo-envio"]:checked')?.value || 'estandar';
    const costoEnvio = METODOS_ENVIO[metodoEnvio].precio;
    
    // Subtotal con descuentos
    const subtotalConDescuentos = subtotal - descuentoPorCantidad - descuentoCupon;
    
    // Calcular IGV
    const igv = subtotalConDescuentos * CHECKOUT_CONFIG.igv;
    
    // Total final
    const total = subtotalConDescuentos + igv + costoEnvio;
    
    // Guardar cálculos
    calculosActuales = {
        subtotal: subtotal,
        descuentoPorCantidad: descuentoPorCantidad,
        descuentoCupon: descuentoCupon,
        costoEnvio: costoEnvio,
        igv: igv,
        total: total,
        totalProductos: totalProductos
    };
    
    // Actualizar DOM
    actualizarTotalesEnDOM();
}

// ==================== ACTUALIZAR TOTALES EN EL DOM ====================
function actualizarTotalesEnDOM() {
    const { subtotal, descuentoPorCantidad, descuentoCupon, costoEnvio, igv, total } = calculosActuales;
    
    // Actualizar elementos
    document.getElementById('subtotal-resumen').textContent = `S/ ${subtotal.toFixed(2)}`;
    document.getElementById('igv-resumen').textContent = `S/ ${igv.toFixed(2)}`;
    document.getElementById('total-resumen').textContent = `S/ ${total.toFixed(2)}`;
    
    // Mostrar/ocultar líneas de descuento
    const descuentoCantidadLine = document.getElementById('descuento-cantidad-line');
    const descuentoCuponLine = document.getElementById('descuento-cupon-line');
    
    // ESTRUCTURA IF-ELSE para mostrar descuentos
    if (descuentoPorCantidad > 0) {
        descuentoCantidadLine.style.display = 'flex';
        document.getElementById('descuento-cantidad').textContent = `-S/ ${descuentoPorCantidad.toFixed(2)}`;
    } else {
        descuentoCantidadLine.style.display = 'none';
    }
    
    if (descuentoCupon > 0) {
        descuentoCuponLine.style.display = 'flex';
        document.getElementById('descuento-cupon').textContent = `-S/ ${descuentoCupon.toFixed(2)}`;
    } else {
        descuentoCuponLine.style.display = 'none';
    }
    
    // Actualizar costo de envío
    const costoEnvioElement = document.getElementById('costo-envio');
    if (costoEnvio === 0) {
        costoEnvioElement.innerHTML = '<span class="text-success">Gratis</span>';
    } else {
        costoEnvioElement.textContent = `S/ ${costoEnvio.toFixed(2)}`;
    }
}

// ==================== CALCULAR DESCUENTO POR CANTIDAD ====================
function calcularDescuentoPorCantidad(totalProductos) {
    // ARREGLO BIDIMENSIONAL de rangos de descuento
    const descuentosPorCantidad = [
        [1, 1, 0],
        [2, 2, 5],
        [3, 4, 10],
        [5, 7, 15],
        [8, 10, 20],
        [11, 999, 25]
    ];
    
    let descuentoPorcentaje = 0;
    
    // ESTRUCTURA FOR para buscar el descuento correspondiente
    for (let i = 0; i < descuentosPorCantidad.length; i++) {
        const [rangoMin, rangoMax, descuento] = descuentosPorCantidad[i];
        
        // ESTRUCTURA IF-ELSE para verificar rango
        if (totalProductos >= rangoMin && totalProductos <= rangoMax) {
            descuentoPorcentaje = descuento;
            break;
        }
    }
    
    return descuentoPorcentaje;
}

// ==================== APLICAR CUPÓN DE DESCUENTO ====================
function aplicarCupon() {
    const inputCupon = document.getElementById('cupon-descuento');
    const codigoCupon = inputCupon.value.trim().toUpperCase();
    
    // ESTRUCTURA IF-ELSE para validar entrada
    if (!codigoCupon) {
        mostrarAlerta('Por favor ingresa un código de cupón', 'warning');
        return;
    }
    
    let cuponEncontrado = null;
    
    // ESTRUCTURA FOR para buscar cupón
    for (let i = 0; i < CUPONES_DESCUENTO.length; i++) {
        const [codigo, descuento, descripcion, activo] = CUPONES_DESCUENTO[i];
        
        // ESTRUCTURA IF-ELSE ANIDADA para verificar cupón
        if (codigo === codigoCupon) {
            if (activo) {
                cuponEncontrado = { codigo, descuento, descripcion };
                break;
            } else {
                mostrarAlerta('Este cupón ha expirado', 'danger');
                return;
            }
        }
    }
    
    // ESTRUCTURA IF-ELSE para resultado de búsqueda
    if (cuponEncontrado) {
        const descuentoCalculado = calculosActuales.subtotal * cuponEncontrado.descuento;
        calculosActuales.descuentoCupon = descuentoCalculado;
        
        calcularTotales();
        
        // Deshabilitar input y botón
        inputCupon.disabled = true;
        document.getElementById('aplicar-cupon').disabled = true;
        document.getElementById('aplicar-cupon').textContent = 'Aplicado ✓';
        
        mostrarAlerta(`Cupón aplicado: ${cuponEncontrado.descripcion}`, 'success');
        
        console.log(`💰 Cupón aplicado: ${cuponEncontrado.codigo} - Descuento: $${descuentoCalculado.toFixed(2)}`);
    } else {
        mostrarAlerta('Código de cupón inválido', 'danger');
    }
}

// ==================== CARGAR UBICACIONES ====================
function cargarUbicaciones() {
    const selectDepartamento = document.getElementById('departamento');
    
    // ESTRUCTURA FOREACH para llenar departamentos
    UBICACIONES_PERU.forEach(([codigo, nombre]) => {
        const option = document.createElement('option');
        option.value = codigo;
        option.textContent = nombre;
        selectDepartamento.appendChild(option);
    });
    
    // Evento para cargar provincias
    selectDepartamento.addEventListener('change', cargarProvincias);
}

function cargarProvincias() {
    const departamentoSeleccionado = document.getElementById('departamento').value;
    const selectProvincia = document.getElementById('provincia');
    const selectDistrito = document.getElementById('distrito');
    
    // Limpiar selects
    selectProvincia.innerHTML = '<option value="">Seleccionar provincia</option>';
    selectDistrito.innerHTML = '<option value="">Seleccionar distrito</option>';
    
    // ESTRUCTURA IF-ELSE para buscar departamento
    if (departamentoSeleccionado) {
        // ESTRUCTURA FOR para encontrar departamento
        for (let i = 0; i < UBICACIONES_PERU.length; i++) {
            const [codigo, nombre, provincias] = UBICACIONES_PERU[i];
            
            if (codigo === departamentoSeleccionado) {
                // ESTRUCTURA FOREACH para llenar provincias
                provincias.forEach(provincia => {
                    const option = document.createElement('option');
                    option.value = provincia.toLowerCase().replace(' ', '-');
                    option.textContent = provincia;
                    selectProvincia.appendChild(option);
                });
                break;
            }
        }
        
        // Evento para cargar distritos
        selectProvincia.addEventListener('change', cargarDistritos);
    }
}

function cargarDistritos() {
    const departamentoSeleccionado = document.getElementById('departamento').value;
    const selectDistrito = document.getElementById('distrito');
    
    // Limpiar select
    selectDistrito.innerHTML = '<option value="">Seleccionar distrito</option>';
    
    // ESTRUCTURA FOR para encontrar distritos
    for (let i = 0; i < UBICACIONES_PERU.length; i++) {
        const [codigo, nombre, provincias, distritos] = UBICACIONES_PERU[i];
        
        if (codigo === departamentoSeleccionado) {
            // ESTRUCTURA FOREACH para llenar distritos
            distritos.forEach(distrito => {
                const option = document.createElement('option');
                option.value = distrito.toLowerCase().replace(' ', '-');
                option.textContent = distrito;
                selectDistrito.appendChild(option);
            });
            break;
        }
    }
}

// ==================== INICIALIZAR EVENTOS ====================
function inicializarEventos() {
    console.log('⚙️ Configurando eventos del checkout...');
    
    // Eventos de métodos de envío
    const metodosEnvio = document.querySelectorAll('input[name="metodo-envio"]');
    metodosEnvio.forEach(radio => {
        radio.addEventListener('change', function() {
            calcularTotales();
            mostrarInfoEnvio(this.value);
        });
    });
    
    // Eventos de métodos de pago
    const metodosPago = document.querySelectorAll('input[name="metodo-pago"]');
    metodosPago.forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarFormularioTarjeta(this.value);
        });
    });
    
    // Evento del botón aplicar cupón
    document.getElementById('aplicar-cupon').addEventListener('click', aplicarCupon);
    
    // Evento del formulario principal
    const form = document.getElementById('checkout-form');
    form.addEventListener('submit', procesarCheckout);
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validarCampo);
        input.addEventListener('input', limpiarValidacion);
    });
    
    console.log('✅ Eventos configurados');
}

// ==================== MOSTRAR INFORMACIÓN DE ENVÍO ====================
function mostrarInfoEnvio(metodo) {
    const info = METODOS_ENVIO[metodo];
    
    // ESTRUCTURA SWITCH-CASE para mensajes de envío
    switch(metodo) {
        case 'estandar':
            mostrarAlerta(`Envío estándar seleccionado: ${info.dias} - Gratis`, 'info');
            break;
        case 'express':
            mostrarAlerta(`Envío express seleccionado: ${info.dias} - +S/ ${info.precio}`, 'info');
            break;
        case 'premium':
            mostrarAlerta(`Envío premium seleccionado: ${info.dias} - +S/ ${info.precio}`, 'info');
            break;
        default:
            console.log('Método de envío no reconocido');
    }
}

// ==================== MOSTRAR/OCULTAR FORMULARIO DE TARJETA ====================
function mostrarFormularioTarjeta(metodoPago) {
    const formularioTarjeta = document.getElementById('datos-tarjeta');
    const camposTarjeta = formularioTarjeta.querySelectorAll('input, select');
    
    // ESTRUCTURA IF-ELSE para mostrar/ocultar formulario
    if (metodoPago === 'tarjeta') {
        formularioTarjeta.classList.add('show');
        formularioTarjeta.style.display = 'block';
        
        // Hacer campos requeridos
        camposTarjeta.forEach(campo => {
            campo.setAttribute('required', 'true');
        });
        
        // Configurar validaciones de tarjeta
        configurarValidacionesTarjeta();
        
    } else {
        formularioTarjeta.classList.remove('show');
        formularioTarjeta.style.display = 'none';
        
        // Quitar campos requeridos
        camposTarjeta.forEach(campo => {
            campo.removeAttribute('required');
            campo.classList.remove('is-invalid', 'is-valid');
        });
    }
    
    // ESTRUCTURA SWITCH-CASE para mensajes específicos
    switch(metodoPago) {
        case 'yape':
            mostrarAlerta('Te enviaremos los datos de Yape después de confirmar el pedido', 'info');
            break;
        case 'transferencia':
            mostrarAlerta('Te enviaremos los datos bancarios después de confirmar el pedido', 'info');
            break;
        case 'contraentrega':
            mostrarAlerta('Pagarás en efectivo al recibir el pedido', 'info');
            break;
    }
}

// ==================== CONFIGURAR VALIDACIONES DE TARJETA ====================
function configurarValidacionesTarjeta() {
    const numeroTarjeta = document.getElementById('numero-tarjeta');
    const cvv = document.getElementById('cvv');
    
    // Formatear número de tarjeta
    numeroTarjeta.addEventListener('input', function() {
        let valor = this.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
        let valorFormateado = valor.match(/.{1,4}/g)?.join(' ') || valor;
        this.value = valorFormateado;
    });
    
    // Validar CVV
    cvv.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });
}

// ==================== VALIDACIÓN DE CAMPOS ====================
function validarCampo(event) {
    const campo = event.target;
    const valor = campo.value.trim();
    let esValido = true;
    let mensaje = '';
    
    // ESTRUCTURA SWITCH-CASE para validar según tipo de campo
    switch(campo.id) {
        case 'nombre':
        case 'apellidos':
            esValido = valor.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
            mensaje = esValido ? '' : 'Debe contener solo letras y tener al menos 2 caracteres';
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            esValido = emailRegex.test(valor);
            mensaje = esValido ? '' : 'Ingresa un email válido';
            break;
            
        case 'telefono':
            esValido = /^[0-9]{9}$/.test(valor.replace(/\s/g, ''));
            mensaje = esValido ? '' : 'Debe tener 9 dígitos';
            break;
            
        case 'documento':
            esValido = /^[0-9]{8}$/.test(valor) || /^[0-9]{11}$/.test(valor);
            mensaje = esValido ? '' : 'DNI: 8 dígitos, RUC: 11 dígitos';
            break;
            
        case 'numero-tarjeta':
            esValido = valor.replace(/\s/g, '').length >= 13;
            mensaje = esValido ? '' : 'Número de tarjeta incompleto';
            break;
            
        case 'cvv':
            esValido = /^[0-9]{3,4}$/.test(valor);
            mensaje = esValido ? '' : 'CVV debe tener 3 o 4 dígitos';
            break;
            
        default:
            if (campo.hasAttribute('required')) {
                esValido = valor.length > 0;
                mensaje = esValido ? '' : 'Este campo es requerido';
            }
    }
    
    // Aplicar clases de validación
    if (esValido) {
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
    } else {
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
    }
    
    // Mostrar mensaje de error
    const feedback = campo.parentElement.querySelector('.invalid-feedback');
    if (feedback && mensaje) {
        feedback.textContent = mensaje;
    }
    
    return esValido;
}

function limpiarValidacion(event) {
    const campo = event.target;
    campo.classList.remove('is-invalid', 'is-valid');
}

// ==================== INICIALIZAR FORMULARIO ====================
function inicializarFormulario() {
    const form = document.getElementById('checkout-form');
    
    // Obtener datos del usuario si están guardados
    const datosGuardados = localStorage.getItem('datosUsuario');
    if (datosGuardados) {
        const datos = JSON.parse(datosGuardados);
        llenarFormulario(datos);
    }
}

function llenarFormulario(datos) {
    // ESTRUCTURA FOR...IN para llenar campos
    for (const campo in datos) {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.value = datos[campo];
        }
    }
}

// ==================== PROCESAR CHECKOUT ====================
function procesarCheckout(event) {
    event.preventDefault();
    console.log('🔄 Procesando checkout...');
    
    const form = event.target;
    
    // Validar formulario completo
    if (!validarFormularioCompleto(form)) {
        mostrarAlerta('Por favor completa todos los campos correctamente', 'danger');
        return;
    }
    
    // Mostrar loading
    mostrarLoading(true);
    
    // Recopilar datos del formulario
    const datosFormulario = recopilarDatosFormulario(form);
    
    // Simular procesamiento
    setTimeout(() => {
        procesarPedido(datosFormulario);
    }, 2000);
}

function validarFormularioCompleto(form) {
    let formularioValido = true;
    const campos = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    // ESTRUCTURA FOR para validar cada campo
    for (let i = 0; i < campos.length; i++) {
        const campo = campos[i];
        
        // IF-ELSE para verificar si el campo padre está visible
        if (campo.closest('#datos-tarjeta') && !campo.closest('#datos-tarjeta').classList.contains('show')) {
            continue; // Saltar campos de tarjeta si no están visibles
        }
        
        if (!validarCampo({ target: campo })) {
            formularioValido = false;
        }
    }
    
    // Validar términos y condiciones
    const terminos = document.getElementById('terminos');
    if (!terminos.checked) {
        terminos.classList.add('is-invalid');
        formularioValido = false;
    }
    
    return formularioValido;
}

function recopilarDatosFormulario(form) {
    const formData = new FormData(form);
    const datos = {};
    
    // ESTRUCTURA FOR...OF para recopilar datos
    for (const [key, value] of formData.entries()) {
        datos[key] = value;
    }
    
    // Agregar datos adicionales
    datos.carrito = carritoActual;
    datos.calculos = calculosActuales;
    datos.fecha = new Date().toISOString();
    datos.numeroPedido = generarNumeroPedido();
    
    return datos;
}

function generarNumeroPedido() {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');
    const segundo = String(fecha.getSeconds()).padStart(2, '0');
    
    return `EH${año}${mes}${dia}${hora}${minuto}${segundo}`;
}

function procesarPedido(datos) {
    try {
        // Guardar pedido en localStorage
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        pedidos.push(datos);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        
        // Limpiar carrito
        localStorage.removeItem('carrito');
        
        // Guardar datos del último pedido para la página de confirmación
        localStorage.setItem('ultimoPedido', JSON.stringify(datos));
        
        console.log('✅ Pedido procesado exitosamente:', datos.numeroPedido);
        
        // Redirigir a página de confirmación
        window.location.href = 'confirmacion.html';
        
    } catch (error) {
        console.error('❌ Error al procesar pedido:', error);
        mostrarLoading(false);
        mostrarAlerta('Error al procesar el pedido. Por favor intenta nuevamente.', 'danger');
    }
}

// ==================== FUNCIONES AUXILIARES ====================
function mostrarAlerta(mensaje, tipo = 'info') {
    const container = document.getElementById('alertas-checkout');
    const alertId = 'alert_' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${tipo} alert-checkout alert-dismissible fade show" role="alert">
            <i class="fas fa-${obtenerIconoAlerta(tipo)} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    container.innerHTML = alertHTML;
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.remove();
        }
    }, 5000);
}

function obtenerIconoAlerta(tipo) {
    // ESTRUCTURA SWITCH-CASE para iconos
    switch(tipo) {
        case 'success': return 'check-circle';
        case 'danger': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        case 'info': return 'info-circle';
        default: return 'info-circle';
    }
}

function mostrarLoading(mostrar) {
    const btnFinalizar = document.getElementById('btn-finalizar');
    const form = document.getElementById('checkout-form');
    
    if (mostrar) {
        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
        form.classList.add('loading');
    } else {
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = '<i class="fas fa-lock me-2"></i>Finalizar Compra Segura';
        form.classList.remove('loading');
    }
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (contador) {
        let totalProductos = 0;
        
        // ESTRUCTURA FOR para contar productos
        for (let i = 0; i < carritoActual.length; i++) {
            totalProductos += carritoActual[i].cantidad;
        }
        
        contador.textContent = totalProductos;
    }
}

// ==================== LOG DEL SISTEMA ====================
console.log('📝 Módulo Checkout ElectroHogar cargado');
console.log('🎯 Estructuras JavaScript implementadas:');
console.log('✅ Variables y Constantes');
console.log('✅ Arreglos Bidimensionales');
console.log('✅ Estructuras IF-ELSE, FOR, FOREACH, SWITCH-CASE');
console.log('✅ Manipulación del DOM');
console.log('✅ Validaciones de Formulario');
console.log('✅ LocalStorage para persistencia');

// ==================== EXPORTAR FUNCIONES ====================
export {
    cargarCarritoDesdeStorage,
    calcularTotales,
    aplicarCupon,
    procesarCheckout,
    validarCampo
};
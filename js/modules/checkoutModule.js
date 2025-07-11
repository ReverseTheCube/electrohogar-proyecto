// =====================================================
// FIX PARA MENSAJES DE ERROR - CHECKOUT
// =====================================================

// Variables globales
let carritoActual = [];
let calculosActuales = {};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Checkout');
    
    cargarYMostrarCarrito();
    configurarValidacion();
    configurarUbicaciones();
    configurarMetodosEnvio();
    configurarFormulario();
    
    console.log('✅ Checkout listo');
});

// ==================== CARGAR Y MOSTRAR CARRITO ====================
function cargarYMostrarCarrito() {
    try {
        const carrito = localStorage.getItem('carrito');
        carritoActual = carrito ? JSON.parse(carrito) : [];
        console.log('✅ Carrito cargado:', carritoActual.length, 'productos');
    } catch (error) {
        console.error('❌ Error al cargar carrito:', error);
        carritoActual = [];
    }
    
    const contenedor = document.getElementById('productos-resumen');
    if (contenedor && carritoActual.length > 0) {
        let html = '';
        carritoActual.forEach(producto => {
            const subtotal = (producto.precio * producto.cantidad).toFixed(2);
            html += `
                <div class="producto-item mb-2 p-2 border-bottom">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${producto.nombre}</strong><br>
                            <small>Cantidad: ${producto.cantidad} x S/ ${producto.precio}</small>
                        </div>
                        <div><strong>S/ ${subtotal}</strong></div>
                    </div>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    }
    
    calcularTotales();
}

function calcularTotales() {
    let subtotal = 0;
    
    carritoActual.forEach(producto => {
        subtotal += producto.precio * producto.cantidad;
    });
    
    const envioSeleccionado = document.querySelector('input[name="metodo-envio"]:checked');
    const costoEnvio = envioSeleccionado ? parseFloat(envioSeleccionado.dataset.precio || 0) : 0;
    
    const igv = subtotal * 0.18;
    const total = subtotal + costoEnvio + igv;
    
    calculosActuales = {
        subtotal: subtotal.toFixed(2),
        envio: costoEnvio.toFixed(2),
        igv: igv.toFixed(2),
        total: total.toFixed(2)
    };
    
    const elementos = {
        'subtotal-resumen': calculosActuales.subtotal,
        'envio-resumen': calculosActuales.envio,
        'igv-resumen': calculosActuales.igv,
        'total-resumen': calculosActuales.total
    };
    
    for (const [id, valor] of Object.entries(elementos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = `S/ ${valor}`;
        }
    }
}

// ==================== CONFIGURAR VALIDACIÓN CORREGIDA ====================
function configurarValidacion() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    const campos = form.querySelectorAll('input, select, textarea');
    
    campos.forEach(campo => {
        // ==================== MANEJO DIFERENTE PARA CHECKBOXES ====================
        if (campo.type === 'checkbox') {
            // Los checkboxes se validan en 'change', NO en 'blur'
            campo.addEventListener('change', function() {
                manejarValidacionCheckbox(this);
            });
            
            // NO agregar evento blur para checkboxes
            console.log(`🔧 Checkbox ${campo.id} configurado solo para 'change'`);
        } else {
            // Campos normales usan blur e input
            campo.addEventListener('blur', function() {
                validarCampoCompleto(this);
            });
            
            campo.addEventListener('input', function() {
                limpiarValidacionCompleta(this);
            });
        }
    });
    
    console.log('✅ Validación configurada');
}

// ==================== VALIDACIÓN COMPLETA CORREGIDA ====================
function validarCampoCompleto(campo) {
    if (!campo.hasAttribute('required')) return true;
    
    // ==================== MANEJO ESPECÍFICO PARA CHECKBOXES ====================
    if (campo.type === 'checkbox') {
        console.log(`🔍 Validando checkbox ${campo.id}:`, campo.checked);
        return manejarValidacionCheckbox(campo);
    }
    
    const valor = campo.value.trim();
    let esValido = false;
    let mensajeError = '';
    
    switch(campo.id) {
        case 'nombre':
        case 'apellidos':
            esValido = valor.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
            mensajeError = 'Debe contener solo letras y tener al menos 2 caracteres';
            break;
        case 'email':
            esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
            mensajeError = 'Ingresa un email válido';
            break;
        case 'telefono':
            esValido = /^[0-9]{9}$/.test(valor.replace(/\s/g, ''));
            mensajeError = 'Debe tener 9 dígitos';
            break;
        case 'documento':
            esValido = /^[0-9]{8}$/.test(valor) || /^[0-9]{11}$/.test(valor);
            mensajeError = 'DNI: 8 dígitos, RUC: 11 dígitos';
            break;
        case 'direccion':
            esValido = valor.length >= 5;
            mensajeError = 'La dirección debe ser más específica';
            break;
        case 'departamento':
        case 'provincia':
        case 'distrito':
            esValido = valor !== '';
            mensajeError = 'Selecciona una opción';
            break;
        case 'numero-tarjeta':
            esValido = valor.replace(/\s/g, '').length >= 13;
            mensajeError = 'Número de tarjeta incompleto';
            break;
        case 'nombre-tarjeta':
            esValido = valor.length >= 3;
            mensajeError = 'Nombre muy corto';
            break;
        case 'cvv':
            esValido = /^[0-9]{3,4}$/.test(valor);
            mensajeError = 'CVV debe tener 3 o 4 dígitos';
            break;
        case 'mes-vencimiento':
        case 'año-vencimiento':
            esValido = valor !== '';
            mensajeError = 'Selecciona fecha';
            break;
        default:
            esValido = valor.length > 0;
            mensajeError = 'Este campo es requerido';
    }
    
    // ==================== APLICAR VALIDACIÓN VISUAL ====================
    if (esValido) {
        // CAMPO VÁLIDO
        campo.classList.remove('is-invalid');
        campo.classList.add('is-valid');
        
        // OCULTAR mensaje de error
        ocultarMensajeError(campo);
    } else {
        // CAMPO INVÁLIDO
        campo.classList.remove('is-valid');
        campo.classList.add('is-invalid');
        
        // MOSTRAR mensaje de error
        mostrarMensajeError(campo, mensajeError);
    }
    
    console.log(`${esValido ? '✅' : '❌'} Campo ${campo.id}: ${esValido ? 'VÁLIDO' : 'INVÁLIDO'}`);
    return esValido;
}

function limpiarValidacionCompleta(campo) {
    campo.classList.remove('is-invalid', 'is-valid');
    ocultarMensajeError(campo);
}

// ==================== VALIDACIÓN ESPECÍFICA PARA CHECKBOXES ====================
function manejarValidacionCheckbox(checkbox) {
    const esValido = checkbox.checked;
    const mensajeError = 'Debes aceptar los términos y condiciones';
    
    console.log(`📋 Validando checkbox ${checkbox.id}:`, {
        checked: checkbox.checked,
        esValido: esValido
    });
    
    if (esValido) {
        checkbox.classList.remove('is-invalid');
        checkbox.classList.add('is-valid');
        ocultarMensajeError(checkbox);
        console.log(`✅ Checkbox ${checkbox.id} VÁLIDO`);
    } else {
        checkbox.classList.remove('is-valid');
        checkbox.classList.add('is-invalid');
        mostrarMensajeError(checkbox, mensajeError);
        console.log(`❌ Checkbox ${checkbox.id} INVÁLIDO`);
    }
    
    return esValido;
}

// ==================== MANEJO DE MENSAJES DE ERROR ====================
function mostrarMensajeError(campo, mensaje) {
    let feedback = campo.parentElement.querySelector('.invalid-feedback');
    
    if (feedback) {
        feedback.textContent = mensaje;
        feedback.style.display = 'block';
    }
}

function ocultarMensajeError(campo) {
    let feedback = campo.parentElement.querySelector('.invalid-feedback');
    
    if (feedback) {
        feedback.style.display = 'none';
    }
}

// ==================== CONFIGURAR UBICACIONES ====================
function configurarUbicaciones() {
    const departamento = document.getElementById('departamento');
    const provincia = document.getElementById('provincia');
    const distrito = document.getElementById('distrito');
    
    if (!departamento) return;
    
    departamento.addEventListener('change', function() {
        const valor = this.value;
        
        provincia.innerHTML = '<option value="">Seleccionar provincia</option>';
        distrito.innerHTML = '<option value="">Seleccionar distrito</option>';
        
        if (valor === 'arequipa') {
            agregarOpciones(provincia, ['Arequipa', 'Camaná', 'Caravelí']);
        } else if (valor === 'lima') {
            agregarOpciones(provincia, ['Lima', 'Huarochirí', 'Cañete']);
        } else if (valor === 'cusco') {
            agregarOpciones(provincia, ['Cusco', 'Urubamba', 'Calca']);
        } else if (valor === 'trujillo') {
            agregarOpciones(provincia, ['Trujillo', 'Ascope']);
        } else if (valor === 'chiclayo') {
            agregarOpciones(provincia, ['Chiclayo', 'Ferreñafe']);
        }
        
        validarCampoCompleto(this);
    });
    
    provincia.addEventListener('change', function() {
        const valor = this.value;
        
        distrito.innerHTML = '<option value="">Seleccionar distrito</option>';
        
        if (valor) {
            if (valor.includes('lima')) {
                agregarOpciones(distrito, ['Lima', 'Miraflores', 'San Isidro', 'Barranco']);
            } else if (valor.includes('arequipa')) {
                agregarOpciones(distrito, ['Arequipa', 'Cayma', 'Cerro Colorado']);
            } else {
                agregarOpciones(distrito, ['Distrito 1', 'Distrito 2', 'Distrito 3']);
            }
        }
        
        validarCampoCompleto(this);
    });
    
    distrito.addEventListener('change', function() {
        validarCampoCompleto(this);
    });
}

function agregarOpciones(select, opciones) {
    opciones.forEach(opcion => {
        const option = document.createElement('option');
        option.value = opcion.toLowerCase().replace(' ', '-');
        option.textContent = opcion;
        select.appendChild(option);
    });
}

// ==================== CONFIGURAR MÉTODOS DE ENVÍO ====================
function configurarMetodosEnvio() {
    const metodosEnvio = document.querySelectorAll('input[name="metodo-envio"]');
    
    metodosEnvio.forEach(radio => {
        radio.addEventListener('change', function() {
            calcularTotales();
        });
    });
}

// ==================== CONFIGURAR FORMULARIO ====================
function configurarFormulario() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
    // ==================== CONFIGURAR TÉRMINOS Y CONDICIONES ====================
    const terminos = document.getElementById('terminos');
    if (terminos) {
        terminos.addEventListener('change', function() {
            manejarTerminos(this);
        });
    }
    
    // Configurar métodos de pago
    const metodosPago = document.querySelectorAll('input[name="metodo-pago"]');
    metodosPago.forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarOcultarTarjeta(this.value);
        });
    });
    
    // Configurar cupón
    const btnCupon = document.getElementById('aplicar-cupon');
    if (btnCupon) {
        btnCupon.addEventListener('click', aplicarCupon);
    }
    
    // Configurar envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        procesarFormulario();
    });
    
    console.log('✅ Formulario configurado');
}

// ==================== MANEJO ESPECÍFICO DE TÉRMINOS ====================
function manejarTerminos(checkbox) {
    console.log('📋 Evento change en términos:', checkbox.checked);
    
    // Usar la función de validación específica para checkboxes
    return manejarValidacionCheckbox(checkbox);
}

function mostrarOcultarTarjeta(metodoPago) {
    const formularioTarjeta = document.getElementById('datos-tarjeta');
    if (!formularioTarjeta) return;
    
    if (metodoPago === 'tarjeta') {
        formularioTarjeta.style.display = 'block';
        formularioTarjeta.classList.add('show');
        
        const camposTarjeta = formularioTarjeta.querySelectorAll('input, select');
        camposTarjeta.forEach(campo => {
            campo.setAttribute('required', 'true');
        });
    } else {
        formularioTarjeta.style.display = 'none';
        formularioTarjeta.classList.remove('show');
        
        const camposTarjeta = formularioTarjeta.querySelectorAll('input, select');
        camposTarjeta.forEach(campo => {
            campo.removeAttribute('required');
            limpiarValidacionCompleta(campo);
        });
    }
}

function aplicarCupon() {
    const inputCupon = document.getElementById('cupon-descuento');
    const codigo = inputCupon ? inputCupon.value.trim().toUpperCase() : '';
    
    if (!codigo) {
        mostrarAlerta('Ingresa un código de cupón', 'warning');
        return;
    }
    
    const cupones = {
        'ELECTROHOGAR10': { descuento: 0.10, descripcion: '10% de descuento' },
        'NUEVOCLIENTE15': { descuento: 0.15, descripcion: '15% de descuento' }
    };
    
    if (cupones[codigo]) {
        mostrarAlerta(`¡Cupón aplicado! ${cupones[codigo].descripcion}`, 'success');
        calcularTotales();
    } else {
        mostrarAlerta('Código de cupón inválido', 'danger');
    }
}

// ==================== PROCESAR FORMULARIO MEJORADO ====================
function procesarFormulario() {
    console.log('🔄 Procesando formulario...');
    
    const form = document.getElementById('checkout-form');
    let formularioValido = true;
    let camposInvalidos = [];
    
    // Validar todos los campos requeridos
    const campos = form.querySelectorAll('input[required], select[required]');
    campos.forEach(campo => {
        // Saltar campos de tarjeta si no están visibles
        const esTarjeta = campo.closest('#datos-tarjeta');
        if (esTarjeta && esTarjeta.style.display === 'none') {
            return;
        }
        
        if (!validarCampoCompleto(campo)) {
            formularioValido = false;
            camposInvalidos.push(campo.id);
        }
    });
    
    // ==================== VALIDAR TÉRMINOS ESPECÍFICAMENTE ====================
    const terminos = document.getElementById('terminos');
    if (terminos) {
        const terminosValidos = manejarValidacionCheckbox(terminos);
        if (!terminosValidos) {
            formularioValido = false;
            camposInvalidos.push('terminos');
            console.log('❌ Términos no marcados');
        } else {
            console.log('✅ Términos verificados correctamente');
        }
    }
    
    // Mostrar resultado
    if (!formularioValido) {
        console.log('💥 FORMULARIO INVÁLIDO. Campos problemáticos:', camposInvalidos);
        mostrarAlerta('Por favor completa todos los campos correctamente', 'danger');
        
        // Hacer scroll al primer campo problemático
        const primerCampo = document.getElementById(camposInvalidos[0]);
        if (primerCampo) {
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerCampo.focus();
        }
        return;
    }
    
    console.log('🎉 FORMULARIO VÁLIDO - Procesando pedido...');
    mostrarLoading(true);
    
    const datos = recopilarDatos(form);
    
    setTimeout(() => {
        procesarPedido(datos);
    }, 2000);
}

function recopilarDatos(form) {
    console.log('📦 Recopilando datos del formulario...');
    
    // ==================== RECOPILAR POR ID (NO FormData) ====================
    const datos = {};
    
    // Campos de información personal
    datos.nombre = document.getElementById('nombre')?.value || '';
    datos.apellidos = document.getElementById('apellidos')?.value || '';
    datos.email = document.getElementById('email')?.value || '';
    datos.telefono = document.getElementById('telefono')?.value || '';
    datos.documento = document.getElementById('documento')?.value || '';
    
    // Campos de dirección
    datos.direccion = document.getElementById('direccion')?.value || '';
    datos.departamento = document.getElementById('departamento')?.value || '';
    datos.provincia = document.getElementById('provincia')?.value || '';
    datos.distrito = document.getElementById('distrito')?.value || '';
    datos.referencia = document.getElementById('referencia')?.value || '';
    
    // Método de envío
    const metodoEnvio = document.querySelector('input[name="metodo-envio"]:checked');
    datos['metodo-envio'] = metodoEnvio?.value || 'estandar';
    
    // Método de pago
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked');
    datos['metodo-pago'] = metodoPago?.value || 'contraentrega';
    
    // Campos de tarjeta (si es pago con tarjeta)
    if (datos['metodo-pago'] === 'tarjeta') {
        datos['numero-tarjeta'] = document.getElementById('numero-tarjeta')?.value || '';
        datos['nombre-tarjeta'] = document.getElementById('nombre-tarjeta')?.value || '';
        datos['cvv'] = document.getElementById('cvv')?.value || '';
        datos['mes-vencimiento'] = document.getElementById('mes-vencimiento')?.value || '';
        datos['año-vencimiento'] = document.getElementById('año-vencimiento')?.value || '';
    }
    
    // Términos
    const terminos = document.getElementById('terminos');
    datos.terminos = terminos?.checked || false;
    
    // Datos adicionales
    datos.carrito = carritoActual;
    datos.calculos = calculosActuales;
    datos.fecha = new Date().toISOString();
    datos.numeroPedido = 'EH' + Date.now().toString().slice(-8);
    
    console.log('✅ Datos recopilados:', datos);
    console.log('👤 Datos del cliente:', {
        nombre: datos.nombre,
        apellidos: datos.apellidos,
        email: datos.email,
        telefono: datos.telefono,
        documento: datos.documento
    });
    
    return datos;
}

function procesarPedido(datos) {
    try {
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        pedidos.push(datos);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        
        localStorage.setItem('ultimoPedido', JSON.stringify(datos));
        localStorage.removeItem('carrito');
        
        console.log('✅ Pedido procesado:', datos.numeroPedido);
        
        // ==================== CAMBIAR COLOR DEL BOTÓN A VERDE ====================
        const btn = document.querySelector('#checkout-form button[type="submit"]');
        if (btn) {
            btn.className = 'btn btn-success btn-lg';
            btn.innerHTML = '✅ ¡Pedido Procesado!';
        }
        
        setTimeout(() => {
            window.location.href = 'confirmacion.html';
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error:', error);
        mostrarLoading(false);
        mostrarAlerta('Error al procesar el pedido', 'danger');
    }
}

// ==================== FUNCIONES AUXILIARES ====================
function mostrarLoading(mostrar) {
    const btn = document.querySelector('#checkout-form button[type="submit"]');
    if (!btn) return;
    
    if (mostrar) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
    } else {
        btn.disabled = false;
        btn.innerHTML = 'Finalizar Compra Segura';
    }
}

function mostrarAlerta(mensaje, tipo) {
    const container = document.getElementById('alertas-checkout');
    if (!container) return;
    
    container.innerHTML = `
        <div class="alert alert-${tipo} alert-dismissible fade show">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
}

console.log('🔧 Checkout fix mensajes cargado - Manejo completo de errores');
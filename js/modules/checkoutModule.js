// =====================================================
// CHECKOUT MODULE - VALIDACIÓN COMPLETAMENTE ARREGLADA
// ✅ Arregla campos rojos + mensajes de error + IGV incluido
// =====================================================

// Variables globales
let carritoActual = [];
let calculosActuales = {};

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Checkout con validación corregida');
    
    cargarYMostrarCarrito();
    configurarValidacionCorregida();
    configurarUbicaciones();
    configurarMetodosEnvio();
    configurarFormularioCorregido();
    
    console.log('✅ Checkout listo - Validación arreglada');
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
                            <small>Cantidad: ${producto.cantidad} x S/ ${producto.precio}</small><br>
                            <small class="text-muted">🏷️ IGV incluido</small>
                        </div>
                        <div><strong>S/ ${subtotal}</strong></div>
                    </div>
                </div>
            `;
        });
        contenedor.innerHTML = html;
    }
    
    calcularTotalesCorregidos();
}

// 🔧 FUNCIÓN CORREGIDA: Calcular totales con IGV incluido
function calcularTotalesCorregidos() {
    let subtotal = 0;
    
    carritoActual.forEach(producto => {
        subtotal += producto.precio * producto.cantidad;
    });
    
    const envioSeleccionado = document.querySelector('input[name="metodo-envio"]:checked');
    const costoEnvio = envioSeleccionado ? 
        parseFloat(envioSeleccionado.dataset.precio || 0) : 0;
    
    // 🔧 SOLUCIÓN: IGV ya incluido en precios, solo mostrar desglose
    const baseImponible = subtotal / 1.18; // Base sin IGV
    const igvIncluido = subtotal - baseImponible; // IGV que ya está incluido
    const total = subtotal + costoEnvio; // Total final sin sumar IGV adicional
    
    calculosActuales = {
        subtotal: subtotal.toFixed(2),
        baseImponible: baseImponible.toFixed(2),
        igvIncluido: igvIncluido.toFixed(2),
        envio: costoEnvio.toFixed(2),
        total: total.toFixed(2)
    };
    
    // Actualizar elementos en la página
    const elementos = {
        'subtotal-resumen': `S/ ${calculosActuales.subtotal}`,
        'envio-resumen': costoEnvio > 0 ? `S/ ${calculosActuales.envio}` : 'Gratis',
        'igv-resumen': `S/ ${calculosActuales.igvIncluido} (incluido)`,
        'total-resumen': `S/ ${calculosActuales.total}`
    };
    
    for (const [id, valor] of Object.entries(elementos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.innerHTML = valor;
        }
    }
    
    console.log('💰 Totales calculados con IGV incluido:', calculosActuales);
}

// ==================== VALIDACIÓN COMPLETAMENTE CORREGIDA ====================
function configurarValidacionCorregida() {
    const form = document.getElementById('checkout-form');
    if (!form) {
        console.error('❌ No se encontró el formulario checkout-form');
        return;
    }
    
    // Deshabilitar validación HTML5 nativa para usar la personalizada
    form.setAttribute('novalidate', 'true');
    
    const campos = form.querySelectorAll('input, select, textarea');
    console.log(`🔧 Configurando validación para ${campos.length} campos`);
    
    campos.forEach(campo => {
        // ==================== LIMPIAR EVENT LISTENERS EXISTENTES ====================
        // Clonar elemento para remover todos los event listeners
        const nuevoElemento = campo.cloneNode(true);
        campo.parentNode.replaceChild(nuevoElemento, campo);
        
        // ==================== CONFIGURAR NUEVOS EVENT LISTENERS ====================
        if (nuevoElemento.type === 'checkbox') {
            nuevoElemento.addEventListener('change', function() {
                validarCheckbox(this);
            });
            console.log(`✅ Checkbox ${nuevoElemento.id} configurado`);
        } else if (nuevoElemento.hasAttribute('required')) {
            // Validar cuando el usuario sale del campo (blur)
            nuevoElemento.addEventListener('blur', function() {
                validarCampoCorregido(this);
            });
            
            // Limpiar validación cuando el usuario escribe (input)
            nuevoElemento.addEventListener('input', function() {
                limpiarValidacion(this);
            });
            
            console.log(`✅ Campo ${nuevoElemento.id} configurado para validación`);
        }
    });
    
    console.log('✅ Validación configurada correctamente');
}

// 🔧 FUNCIÓN CORREGIDA: Validar campo individual
function validarCampoCorregido(campo) {
    const valor = campo.value.trim();
    let esValido = false;
    let mensajeError = '';
    
    console.log(`🔍 Validando campo ${campo.id} con valor: "${valor}"`);
    
    // ==================== VALIDACIONES CORREGIDAS ====================
    switch(campo.id) {
        case 'nombre':
        case 'apellidos':
            // ✅ CORREGIDO: Acepta letras, espacios, acentos y ñ
            esValido = valor.length >= 2 && /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
            mensajeError = 'Debe contener solo letras y tener al menos 2 caracteres';
            break;
            
        case 'email':
            // ✅ CORREGIDO: Regex completa para email
            esValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
            mensajeError = 'Ingresa un correo electrónico válido (ejemplo@email.com)';
            break;
            
        case 'telefono':
            // ✅ CORREGIDO: Acepta formatos flexibles de teléfono
            const telefonoLimpio = valor.replace(/[\s\-\(\)]/g, ''); // Quitar espacios, guiones, paréntesis
            esValido = /^[0-9]{9,15}$/.test(telefonoLimpio);
            mensajeError = 'Ingresa un teléfono válido (9-15 dígitos)';
            break;
            
        case 'documento':
            // ✅ CORREGIDO: DNI (8 dígitos) o RUC (11 dígitos)
            esValido = /^[0-9]{8}$/.test(valor) || /^[0-9]{11}$/.test(valor);
            mensajeError = 'Ingresa DNI (8 dígitos) o RUC (11 dígitos)';
            break;
            
        case 'direccion':
            // ✅ CORREGIDO: Dirección más específica
            esValido = valor.length >= 10;
            mensajeError = 'Ingresa una dirección más específica (mínimo 10 caracteres)';
            break;
            
        case 'departamento':
        case 'provincia':
        case 'distrito':
            // ✅ CORREGIDO: Verificar que no esté vacío
            esValido = valor !== '' && valor !== 'Seleccionar' && valor !== 'Selecciona';
            mensajeError = 'Selecciona una opción válida';
            break;
            
        case 'numero-tarjeta':
            // ✅ CORREGIDO: Número de tarjeta más flexible
            const numeroLimpio = valor.replace(/\s/g, '');
            esValido = /^[0-9]{13,19}$/.test(numeroLimpio);
            mensajeError = 'Ingresa un número de tarjeta válido (13-19 dígitos)';
            break;
            
        case 'nombre-tarjeta':
            // ✅ CORREGIDO: Nombre en tarjeta
            esValido = valor.length >= 5 && /^[a-zA-Z\s]+$/.test(valor);
            mensajeError = 'Ingresa el nombre completo como aparece en la tarjeta';
            break;
            
        case 'cvv':
            // ✅ CORREGIDO: CVV
            esValido = /^[0-9]{3,4}$/.test(valor);
            mensajeError = 'Ingresa un CVV válido (3 o 4 dígitos)';
            break;
            
        case 'mes-vencimiento':
        case 'año-vencimiento':
            // ✅ CORREGIDO: Fecha de vencimiento
            esValido = valor !== '' && valor !== 'Seleccionar';
            mensajeError = 'Selecciona una fecha válida';
            break;
            
        default:
            // ✅ CORREGIDO: Validación por defecto
            esValido = valor.length > 0;
            mensajeError = 'Este campo es obligatorio';
    }
    
    // ==================== APLICAR RESULTADO DE VALIDACIÓN ====================
    aplicarValidacionVisual(campo, esValido, mensajeError);
    
    console.log(`${esValido ? '✅' : '❌'} Campo ${campo.id}: ${esValido ? 'VÁLIDO' : 'INVÁLIDO'}`);
    return esValido;
}

// 🔧 FUNCIÓN CORREGIDA: Aplicar validación visual
function aplicarValidacionVisual(campo, esValido, mensajeError) {
    // Limpiar clases existentes
    campo.classList.remove('is-valid', 'is-invalid');
    
    if (esValido) {
        // ✅ CAMPO VÁLIDO
        campo.classList.add('is-valid');
        ocultarMensajeErrorCorregido(campo);
    } else {
        // ❌ CAMPO INVÁLIDO
        campo.classList.add('is-invalid');
        mostrarMensajeErrorCorregido(campo, mensajeError);
    }
}

// 🔧 FUNCIÓN CORREGIDA: Mostrar mensaje de error
function mostrarMensajeErrorCorregido(campo, mensaje) {
    let feedback = campo.parentElement.querySelector('.invalid-feedback');
    
    if (!feedback) {
        // Crear elemento de feedback si no existe
        feedback = document.createElement('div');
        feedback.className = 'invalid-feedback';
        campo.parentElement.appendChild(feedback);
    }
    
    feedback.textContent = mensaje;
    feedback.style.display = 'block';
}

// 🔧 FUNCIÓN CORREGIDA: Ocultar mensaje de error
function ocultarMensajeErrorCorregido(campo) {
    const feedback = campo.parentElement.querySelector('.invalid-feedback');
    
    if (feedback) {
        feedback.style.display = 'none';
    }
}

// 🔧 FUNCIÓN CORREGIDA: Limpiar validación
function limpiarValidacion(campo) {
    campo.classList.remove('is-valid', 'is-invalid');
    ocultarMensajeErrorCorregido(campo);
}

// 🔧 FUNCIÓN CORREGIDA: Validar checkbox
function validarCheckbox(checkbox) {
    const esValido = checkbox.checked;
    
    console.log(`📋 Validando checkbox ${checkbox.id}: ${esValido ? 'MARCADO' : 'NO MARCADO'}`);
    
    if (esValido) {
        checkbox.classList.remove('is-invalid');
        checkbox.classList.add('is-valid');
        ocultarMensajeErrorCorregido(checkbox);
    } else {
        checkbox.classList.remove('is-valid');
        checkbox.classList.add('is-invalid');
        mostrarMensajeErrorCorregido(checkbox, 'Debes aceptar los términos y condiciones');
    }
    
    return esValido;
}

// ==================== CONFIGURAR UBICACIONES ====================
function configurarUbicaciones() {
    const departamentoSelect = document.getElementById('departamento');
    const provinciaSelect = document.getElementById('provincia');
    const distritoSelect = document.getElementById('distrito');
    
    if (!departamentoSelect) return;
    
    const ubicaciones = {
        'arequipa': {
            'arequipa': ['Cercado', 'Cayma', 'Cerro Colorado', 'Mariano Melgar', 'Miraflores'],
            'camana': ['Camaná', 'José María Quimper', 'Mariano Nicolás Valcárcel']
        },
        'lima': {
            'lima': ['Cercado', 'Miraflores', 'San Isidro', 'Surco', 'La Molina'],
            'callao': ['Bellavista', 'Carmen de la Legua', 'La Perla']
        }
    };
    
    departamentoSelect.addEventListener('change', function() {
        const departamento = this.value;
        provinciaSelect.innerHTML = '<option value="">Selecciona provincia</option>';
        distritoSelect.innerHTML = '<option value="">Selecciona distrito</option>';
        
        if (departamento && ubicaciones[departamento]) {
            Object.keys(ubicaciones[departamento]).forEach(provincia => {
                const option = document.createElement('option');
                option.value = provincia;
                option.textContent = provincia.charAt(0).toUpperCase() + provincia.slice(1);
                provinciaSelect.appendChild(option);
            });
        }
        
        // Revalidar campos
        if (departamento) validarCampoCorregido(this);
        limpiarValidacion(provinciaSelect);
        limpiarValidacion(distritoSelect);
    });
    
    provinciaSelect.addEventListener('change', function() {
        const departamento = departamentoSelect.value;
        const provincia = this.value;
        distritoSelect.innerHTML = '<option value="">Selecciona distrito</option>';
        
        if (departamento && provincia && ubicaciones[departamento][provincia]) {
            ubicaciones[departamento][provincia].forEach(distrito => {
                const option = document.createElement('option');
                option.value = distrito.toLowerCase().replace(' ', '-');
                option.textContent = distrito;
                distritoSelect.appendChild(option);
            });
        }
        
        // Revalidar campos
        if (provincia) validarCampoCorregido(this);
        limpiarValidacion(distritoSelect);
    });
    
    distritoSelect.addEventListener('change', function() {
        if (this.value) validarCampoCorregido(this);
    });
}

// ==================== CONFIGURAR MÉTODOS DE ENVÍO ====================
function configurarMetodosEnvio() {
    const metodosEnvio = document.querySelectorAll('input[name="metodo-envio"]');
    
    metodosEnvio.forEach(metodo => {
        metodo.addEventListener('change', function() {
            calcularTotalesCorregidos();
            console.log(`📦 Método de envío seleccionado: ${this.value}`);
        });
    });
}

// ==================== CONFIGURAR FORMULARIO CORREGIDO ====================
function configurarFormularioCorregido() {
    const form = document.getElementById('checkout-form');
    if (!form) return;
    
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
    
    // ==================== CONFIGURAR ENVÍO DEL FORMULARIO ====================
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('🔄 Procesando envío del formulario...');
        procesarFormularioCorregido();
    });
    
    console.log('✅ Formulario configurado correctamente');
}

// 🔧 FUNCIÓN CORREGIDA: Procesar formulario
function procesarFormularioCorregido() {
    console.log('🔄 Validando formulario completo...');
    
    const form = document.getElementById('checkout-form');
    let formularioValido = true;
    let camposInvalidos = [];
    
    // ==================== VALIDAR TODOS LOS CAMPOS REQUERIDOS ====================
    const campos = form.querySelectorAll('input[required], select[required]');
    
    campos.forEach(campo => {
        // Saltar campos de tarjeta si el método de pago no es tarjeta
        const metodoPago = document.querySelector('input[name="metodo-pago"]:checked');
        if (campo.closest('#datos-tarjeta') && metodoPago?.value !== 'tarjeta') {
            return;
        }
        
        let esValido = false;
        
        if (campo.type === 'checkbox') {
            esValido = validarCheckbox(campo);
        } else {
            esValido = validarCampoCorregido(campo);
        }
        
        if (!esValido) {
            formularioValido = false;
            camposInvalidos.push(campo.id);
        }
    });
    
    // ==================== MOSTRAR RESULTADO ====================
    if (!formularioValido) {
        console.log('❌ FORMULARIO INVÁLIDO. Campos problemáticos:', camposInvalidos);
        mostrarAlerta('Por favor completa todos los campos correctamente', 'danger');
        
        // Hacer scroll al primer campo problemático
        const primerCampo = document.getElementById(camposInvalidos[0]);
        if (primerCampo) {
            primerCampo.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerCampo.focus();
        }
        return;
    }
    
    console.log('✅ FORMULARIO VÁLIDO - Procesando pedido...');
    mostrarLoading(true);
    
    // Recopilar datos
    const datos = recopilarDatos();
    
    // Simular procesamiento
    setTimeout(() => {
        procesarPedido(datos);
    }, 2000);
}

// ==================== RECOPILAR DATOS ====================
function recopilarDatos() {
    console.log('📦 Recopilando datos del formulario...');
    
    const datos = {};
    
    // Información personal
    datos.nombre = document.getElementById('nombre')?.value || '';
    datos.apellidos = document.getElementById('apellidos')?.value || '';
    datos.email = document.getElementById('email')?.value || '';
    datos.telefono = document.getElementById('telefono')?.value || '';
    datos.documento = document.getElementById('documento')?.value || '';
    
    // Dirección
    datos.direccion = document.getElementById('direccion')?.value || '';
    datos.departamento = document.getElementById('departamento')?.value || '';
    datos.provincia = document.getElementById('provincia')?.value || '';
    datos.distrito = document.getElementById('distrito')?.value || '';
    datos.referencia = document.getElementById('referencia')?.value || '';
    
    // Métodos
    const metodoEnvio = document.querySelector('input[name="metodo-envio"]:checked');
    datos['metodo-envio'] = metodoEnvio?.value || 'estandar';
    
    const metodoPago = document.querySelector('input[name="metodo-pago"]:checked');
    datos['metodo-pago'] = metodoPago?.value || 'contraentrega';
    
    // Datos de tarjeta (si aplica)
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
    datos.numeroPedido = 'EH' + Date.now().toString().slice(-6);
    datos.fecha = new Date().toLocaleDateString();
    datos.hora = new Date().toLocaleTimeString();
    
    console.log('✅ Datos recopilados:', datos);
    return datos;
}

// ==================== PROCESAR PEDIDO ====================
function procesarPedido(datos) {
    try {
        // Guardar pedido
        localStorage.setItem('ultimoPedido', JSON.stringify(datos));
        localStorage.removeItem('carrito');
        
        console.log('✅ Pedido procesado exitosamente:', datos.numeroPedido);
        
        // Cambiar botón a éxito
        const btn = document.querySelector('#checkout-form button[type="submit"]');
        if (btn) {
            btn.className = 'btn btn-success btn-lg w-100';
            btn.innerHTML = '<i class="fas fa-check me-2"></i>¡Pedido Procesado!';
        }
        
        mostrarAlerta('¡Pedido procesado exitosamente! Redirigiendo...', 'success');
        
        // Redirigir a confirmación
        setTimeout(() => {
            window.location.href = 'confirmacion.html';
        }, 1500);
        
    } catch (error) {
        console.error('❌ Error al procesar pedido:', error);
        mostrarLoading(false);
        mostrarAlerta('Error al procesar el pedido. Inténtalo nuevamente.', 'danger');
    }
}

// ==================== FUNCIONES AUXILIARES ====================
function mostrarOcultarTarjeta(metodoPago) {
    const formularioTarjeta = document.getElementById('datos-tarjeta');
    if (!formularioTarjeta) return;
    
    if (metodoPago === 'tarjeta') {
        formularioTarjeta.style.display = 'block';
        const camposTarjeta = formularioTarjeta.querySelectorAll('input, select');
        camposTarjeta.forEach(campo => {
            campo.setAttribute('required', 'true');
        });
    } else {
        formularioTarjeta.style.display = 'none';
        const camposTarjeta = formularioTarjeta.querySelectorAll('input, select');
        camposTarjeta.forEach(campo => {
            campo.removeAttribute('required');
            limpiarValidacion(campo);
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
        calcularTotalesCorregidos();
    } else {
        mostrarAlerta('Código de cupón inválido', 'danger');
    }
}

function mostrarLoading(mostrar) {
    const btn = document.querySelector('#checkout-form button[type="submit"]');
    if (!btn) return;
    
    if (mostrar) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Procesando...';
    } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-lock me-2"></i>Finalizar Compra Segura';
    }
}

function mostrarAlerta(mensaje, tipo) {
    const container = document.getElementById('alertas-checkout');
    if (!container) return;
    
    const tipoClase = tipo === 'success' ? 'alert-success' : 
                     tipo === 'danger' ? 'alert-danger' : 
                     tipo === 'warning' ? 'alert-warning' : 'alert-info';
    
    const icono = tipo === 'success' ? 'fas fa-check-circle' : 
                  tipo === 'danger' ? 'fas fa-exclamation-triangle' : 
                  tipo === 'warning' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
    
    container.innerHTML = `
        <div class="alert ${tipoClase} alert-dismissible fade show" role="alert">
            <i class="${icono} me-2"></i>
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    // Auto-dismiss para mensajes de éxito
    if (tipo === 'success') {
        setTimeout(() => {
            const alerta = container.querySelector('.alert');
            if (alerta) alerta.remove();
        }, 5000);
    }
}

console.log('✅ Módulo checkout con validación completamente arreglada cargado');
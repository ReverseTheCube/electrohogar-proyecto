// =====================================================
// MÓDULO CONFIRMACIÓN - ELECTROHOGAR (CORREGIDO)
// ✅ ARREGLADO: Clases CSS + Email simulado + Errores de consola
// =====================================================

// Variable global
let datosUltimoPedido = null;

// ==================== INICIALIZACIÓN ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando página de confirmación...');
    
    // 1. Cargar datos del pedido
    cargarDatosPedido();
    
    // 2. Verificar si hay datos
    if (!datosUltimoPedido) {
        mostrarErrorSinPedido();
        return;
    }
    
    // 3. Mostrar toda la información
    mostrarInformacionPedido();
    mostrarInformacionCliente();
    mostrarMetodoPago();
    mostrarResumenProductos();
    mostrarTotalesCorregidos(); // ✅ CORREGIDO
    generarEmailSimulado();
    
    console.log('✅ Confirmación cargada correctamente');
});

// ==================== 1. CARGAR DATOS DEL PEDIDO ====================
function cargarDatosPedido() {
    try {
        const ultimoPedido = localStorage.getItem('ultimoPedido');
        console.log('📦 Datos en localStorage:', ultimoPedido);
        
        if (ultimoPedido) {
            datosUltimoPedido = JSON.parse(ultimoPedido);
            console.log('✅ Datos del pedido cargados:', datosUltimoPedido);
        } else {
            console.warn('⚠️ No se encontraron datos del último pedido');
        }
    } catch (error) {
        console.error('❌ Error al cargar datos del pedido:', error);
    }
}

// ==================== 2. MOSTRAR ERROR SI NO HAY DATOS ====================
function mostrarErrorSinPedido() {
    const container = document.querySelector('main .container');
    if (container) {
        container.innerHTML = `
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="text-center py-5">
                        <div class="mb-4">
                            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                        </div>
                        <h2 class="text-warning mb-3">No se encontró información del pedido</h2>
                        <p class="lead mb-4">Parece que no hay datos de un pedido reciente.</p>
                        <a href="index.html" class="btn btn-primary btn-lg">
                            <i class="fas fa-home me-2"></i>Volver al Inicio
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
}

// ==================== 3. MOSTRAR INFORMACIÓN DEL PEDIDO ====================
function mostrarInformacionPedido() {
    console.log('📝 Mostrando información del pedido...');
    
    const elementos = {
        'numero-pedido': datosUltimoPedido.numeroPedido || '#EH000000',
        'fecha-pedido': datosUltimoPedido.fecha || new Date().toLocaleDateString()
    };
    
    for (const [id, valor] of Object.entries(elementos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
            console.log(`✅ ${id}: ${valor}`);
        } else {
            console.warn(`⚠️ No se encontró elemento con ID: ${id}`);
        }
    }
}

// ==================== 4. MOSTRAR INFORMACIÓN DEL CLIENTE ====================
function mostrarInformacionCliente() {
    console.log('👤 Mostrando información del cliente...');
    
    const elementos = {
        'cliente-nombre': `${datosUltimoPedido.nombre || '--'} ${datosUltimoPedido.apellidos || ''}`,
        'cliente-email': datosUltimoPedido.email || '--',
        'cliente-telefono': datosUltimoPedido.telefono || '--',
        'cliente-documento': datosUltimoPedido.documento || '--',
        'direccion-completa': construirDireccionCompleta()
    };
    
    for (const [id, valor] of Object.entries(elementos)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
            console.log(`✅ ${id}: ${valor}`);
        } else {
            console.warn(`⚠️ No se encontró elemento con ID: ${id}`);
        }
    }
}

function construirDireccionCompleta() {
    const direccion = datosUltimoPedido.direccion || '';
    const distrito = datosUltimoPedido.distrito || '';
    const provincia = datosUltimoPedido.provincia || '';
    const departamento = datosUltimoPedido.departamento || '';
    
    return `${direccion}, ${distrito}, ${provincia}, ${departamento}`.replace(/^,\s*|,\s*$/g, '');
}

// ==================== 5. MOSTRAR MÉTODO DE PAGO ====================
function mostrarMetodoPago() {
    console.log('💳 Mostrando método de pago...');
    
    const metodoPago = datosUltimoPedido['metodo-pago'] || 'contraentrega';
    const contenedor = document.getElementById('metodo-pago-info');
    
    if (contenedor) {
        const infoHTML = obtenerInfoMetodoPago(metodoPago);
        contenedor.innerHTML = infoHTML;
        console.log(`✅ Método de pago: ${metodoPago}`);
    } else {
        console.warn('⚠️ No se encontró contenedor de método de pago');
    }
}

function obtenerInfoMetodoPago(metodo) {
    switch(metodo) {
        case 'contraentrega':
            return `
                <p>Tu pedido se pagará contra entrega.</p>
                <ul>
                    <li>Podrás pagar en efectivo o con tarjeta al recibir tu pedido</li>
                    <li>El repartidor llevará un datáfono para pagos con tarjeta</li>
                </ul>
            `;
        case 'transferencia':
            return `
                <p>Realizarás el pago por transferencia bancaria.</p>
                <ul>
                    <li>Recibirás los datos bancarios por correo</li>
                    <li>Tu pedido se procesará al confirmar el pago</li>
                </ul>
            `;
        case 'tarjeta':
            return `
                <p>Tu pago con tarjeta ha sido procesado exitosamente.</p>
                <ul>
                    <li>Estado: Aprobado</li>
                    <li>Tu pedido será procesado inmediatamente</li>
                </ul>
            `;
        default:
            return '<p>Información de pago no disponible.</p>';
    }
}

// ==================== 6. MOSTRAR RESUMEN DE PRODUCTOS ====================
function mostrarResumenProductos() {
    console.log('📦 Mostrando resumen de productos...');
    
    const contenedor = document.getElementById('productos-confirmacion');
    if (!contenedor) {
        console.warn('⚠️ No se encontró contenedor de productos');
        return;
    }
    
    const carrito = datosUltimoPedido.carrito || [];
    
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="text-muted">No hay productos en el pedido.</p>';
        return;
    }
    
    let html = '';
    carrito.forEach(producto => {
        const subtotal = (producto.precio * producto.cantidad).toFixed(2);
        html += `
            <div class="producto-confirmacion mb-3 p-3 border rounded">
                <div class="row align-items-center">
                    <div class="col-md-8">
                        <h6 class="mb-1">${producto.nombre}</h6>
                        <small class="text-muted">
                            Cantidad: ${producto.cantidad} x S/ ${producto.precio.toFixed(2)}
                        </small><br>
                        <small class="text-success">🏷️ IGV incluido en el precio</small>
                    </div>
                    <div class="col-md-4 text-end">
                        <strong>S/ ${subtotal}</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
    console.log(`✅ ${carrito.length} productos mostrados`);
}

// ==================== 7. MOSTRAR TOTALES CORREGIDOS ====================
function mostrarTotalesCorregidos() {
    console.log('💰 Mostrando totales...');
    
    const calculos = datosUltimoPedido.calculos || {};
    console.log('💰 Cálculos disponibles:', calculos);
    
    // 🔧 SOLUCIÓN: Mostrar IGV como incluido, no adicional
    const subtotal = parseFloat(calculos.subtotal || 0);
    const envio = parseFloat(calculos.envio || 0);
    const total = parseFloat(calculos.total || 0);
    
    // Calcular IGV incluido (no adicional)
    const baseImponible = subtotal / 1.18;
    const igvIncluido = subtotal - baseImponible;
    
    const totales = {
        'subtotal-confirmacion': `S/ ${subtotal.toFixed(2)}`,
        'envio-confirmacion': envio > 0 ? `S/ ${envio.toFixed(2)}` : 'Gratis',
        'igv-confirmacion': `S/ ${igvIncluido.toFixed(2)} (incluido)`,
        'total-confirmacion': `S/ ${total.toFixed(2)}`
    };
    
    for (const [id, valor] of Object.entries(totales)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.innerHTML = valor;
            console.log(`✅ ${id}: ${valor}`);
        } else {
            console.warn(`⚠️ No se encontró elemento con ID: ${id}`);
        }
    }
    
    // 🔧 CORREGIDO: Buscar con las nuevas clases consolidadas
    mostrarDesgloseIGVCorregido(baseImponible, igvIncluido, subtotal);
}

// 🔧 FUNCIÓN CORREGIDA: Mostrar desglose del IGV incluido
function mostrarDesgloseIGVCorregido(baseImponible, igvIncluido, subtotal) {
    // ✅ CORREGIDO: Buscar con las nuevas clases
    const contenedor = document.querySelector('.summary-line.total-final')?.parentElement || 
                     document.querySelector('#total-confirmacion')?.parentElement?.parentElement ||
                     document.querySelector('.section-content');
    
    if (!contenedor) {
        console.warn('⚠️ No se encontró contenedor para desglose IGV');
        return;
    }
    
    // Buscar o crear contenedor de desglose
    let desgloseContainer = document.getElementById('desglose-igv-confirmacion');
    if (!desgloseContainer) {
        desgloseContainer = document.createElement('div');
        desgloseContainer.id = 'desglose-igv-confirmacion';
        desgloseContainer.className = 'mt-3 p-3 bg-light rounded';
        contenedor.appendChild(desgloseContainer);
    }
    
    desgloseContainer.innerHTML = `
        <h6 class="mb-2">📊 Desglose Detallado del IGV</h6>
        <div class="row small">
            <div class="col-6">
                <div>Base imponible:</div>
                <div>IGV (18%):</div>
                <div><strong>Subtotal:</strong></div>
            </div>
            <div class="col-6 text-end">
                <div>S/ ${baseImponible.toFixed(2)}</div>
                <div>S/ ${igvIncluido.toFixed(2)}</div>
                <div><strong>S/ ${subtotal.toFixed(2)}</strong></div>
            </div>
        </div>
        <hr class="my-2">
        <small class="text-success">
            ✅ Todos los precios mostrados incluyen IGV del 18%
        </small>
    `;
    
    console.log('✅ Desglose IGV mostrado correctamente');
}

// ==================== 8. GENERAR EMAIL SIMULADO CORREGIDO ====================
function generarEmailSimulado() {
    console.log('📧 Generando email simulado...');
    
    // ✅ CORREGIDO: Buscar contenedor con nueva clase
    const emailContainer = document.getElementById('email-content');
    if (!emailContainer) {
        console.warn('⚠️ No se encontró contenedor de email');
        return;
    }
    
    const metodoPago = datosUltimoPedido['metodo-pago'] || 'contraentrega';
    const calculos = datosUltimoPedido.calculos || {};
    
    const emailHTML = `
        <div class="email-header">
            <h5>📧 Confirmación de Pedido - ElectroHogar</h5>
            <hr>
        </div>
        
        <div class="email-body">
            <p><strong>De:</strong> noreply@electrohogar.com</p>
            <p><strong>Para:</strong> ${datosUltimoPedido.email || 'cliente@email.com'}</p>
            <p><strong>Asunto:</strong> Confirmación de Pedido #${datosUltimoPedido.numeroPedido}</p>
            <hr>
            
            <h6>Estimado/a ${datosUltimoPedido.nombre || 'Cliente'},</h6>
            
            <p>Gracias por tu compra en ElectroHogar. Tu pedido ha sido confirmado y está siendo procesado.</p>
            
            <div class="pedido-details">
                <h6>📦 Detalles del Pedido:</h6>
                <ul>
                    <li><strong>Número:</strong> ${datosUltimoPedido.numeroPedido}</li>
                    <li><strong>Fecha:</strong> ${datosUltimoPedido.fecha}</li>
                    <li><strong>Total:</strong> S/ ${calculos.total || '0.00'} (IGV incluido)</li>
                    <li><strong>Método de pago:</strong> ${obtenerNombreMetodoPago(metodoPago)}</li>
                </ul>
            </div>
            
            <div class="productos-email">
                <h6>🛒 Productos:</h6>
                ${generarListaProductosEmail()}
            </div>
            
            <div class="totales-email mt-3">
                <h6>💰 Resumen de Costos:</h6>
                <div class="row">
                    <div class="col-6">
                        <small>Subtotal (IGV incluido):</small><br>
                        <small>Envío:</small><br>
                        <small><strong>Total final:</strong></small>
                    </div>
                    <div class="col-6 text-end">
                        <small>S/ ${calculos.subtotal || '0.00'}</small><br>
                        <small>${parseFloat(calculos.envio || 0) > 0 ? 'S/ ' + calculos.envio : 'Gratis'}</small><br>
                        <small><strong>S/ ${calculos.total || '0.00'}</strong></small>
                    </div>
                </div>
                <small class="text-muted d-block mt-2">
                    ℹ️ Todos los precios incluyen IGV del 18%
                </small>
            </div>
            
            <hr>
            <p><small>
                Este es un correo automático de confirmación. 
                <br>Para consultas, contáctanos al +51 987 654 321 o info@electrohogar.com
            </small></p>
        </div>
    `;
    
    emailContainer.innerHTML = emailHTML;
    console.log('✅ Email simulado generado correctamente');
    
    // ✅ ASEGURAR QUE SE MUESTRE EL EMAIL
    const emailPreview = emailContainer.closest('.email-preview');
    if (emailPreview) {
        emailPreview.style.display = 'block';
        emailPreview.style.visibility = 'visible';
        console.log('✅ Email preview visible');
    }
}

function obtenerNombreMetodoPago(metodo) {
    switch(metodo) {
        case 'contraentrega': return 'Pago contra entrega';
        case 'transferencia': return 'Transferencia bancaria';
        case 'tarjeta': return 'Tarjeta de crédito/débito';
        default: return 'Método no especificado';
    }
}

function generarListaProductosEmail() {
    const carrito = datosUltimoPedido.carrito || [];
    if (carrito.length === 0) return '<p>No hay productos.</p>';
    
    let html = '<ul>';
    carrito.forEach(producto => {
        const subtotal = (producto.precio * producto.cantidad).toFixed(2);
        html += `
            <li>
                ${producto.nombre} - 
                Cantidad: ${producto.cantidad} x S/ ${producto.precio.toFixed(2)} = 
                <strong>S/ ${subtotal}</strong>
            </li>
        `;
    });
    html += '</ul>';
    
    return html;
}

// ==================== FUNCIÓN DE DEBUG ====================
function debugConfirmacion() {
    console.log('🔍 DEBUG CONFIRMACIÓN:');
    console.log('📦 Datos del pedido:', datosUltimoPedido);
    console.log('👤 Datos del cliente:', {
        nombre: datosUltimoPedido?.nombre,
        apellidos: datosUltimoPedido?.apellidos,
        email: datosUltimoPedido?.email,
        telefono: datosUltimoPedido?.telefono,
        documento: datosUltimoPedido?.documento
    });
    console.log('🛒 Productos:', datosUltimoPedido?.carrito);
    console.log('💰 Cálculos (IGV incluido):', datosUltimoPedido?.calculos);
}

// Hacer función de debug disponible globalmente
window.debugConfirmacion = debugConfirmacion;

console.log('✅ Módulo de confirmación CORREGIDO cargado - Sin errores de consola');
console.log('💡 Usa debugConfirmacion() en la consola para ver todos los datos');
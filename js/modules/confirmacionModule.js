// =====================================================
// MÓDULO CONFIRMACIÓN FIX - ELECTROHOGAR
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
    mostrarTotales();
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
    console.log('📋 Mostrando información del pedido...');
    
    // Número de pedido
    const numeroPedido = document.getElementById('numero-pedido');
    if (numeroPedido && datosUltimoPedido.numeroPedido) {
        numeroPedido.textContent = `#${datosUltimoPedido.numeroPedido}`;
        console.log('✅ Número de pedido mostrado:', datosUltimoPedido.numeroPedido);
    }
    
    // Fecha del pedido
    const fechaPedido = document.getElementById('fecha-pedido');
    if (fechaPedido && datosUltimoPedido.fecha) {
        const fecha = new Date(datosUltimoPedido.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        fechaPedido.textContent = fechaFormateada;
        console.log('✅ Fecha mostrada:', fechaFormateada);
    }
}

// ==================== 4. MOSTRAR INFORMACIÓN DEL CLIENTE ====================
function mostrarInformacionCliente() {
    console.log('👤 Mostrando información del cliente...');
    console.log('📋 Datos disponibles:', datosUltimoPedido);
    
    // Mapeo de campos del cliente
    const camposCliente = {
        'cliente-nombre': `${datosUltimoPedido.nombre || ''} ${datosUltimoPedido.apellidos || ''}`.trim(),
        'cliente-email': datosUltimoPedido.email || '--',
        'cliente-telefono': datosUltimoPedido.telefono || '--', 
        'cliente-documento': datosUltimoPedido.documento || '--',
        'cliente-direccion': construirDireccionCompleta()
    };
    
    // Llenar cada campo
    for (const [id, valor] of Object.entries(camposCliente)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor || '--';
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
    
    let direccionCompleta = direccion;
    if (distrito) direccionCompleta += `, ${distrito}`;
    if (provincia) direccionCompleta += `, ${provincia}`;
    if (departamento) direccionCompleta += `, ${departamento}`;
    
    return direccionCompleta || '--';
}

// ==================== 5. MOSTRAR MÉTODO DE PAGO ====================
function mostrarMetodoPago() {
    console.log('💳 Mostrando método de pago...');
    
    const metodoPagoContainer = document.getElementById('metodo-pago-info');
    if (!metodoPagoContainer) {
        console.warn('⚠️ No se encontró contenedor de método de pago');
        return;
    }
    
    const metodoPago = datosUltimoPedido['metodo-pago'] || 'contraentrega';
    console.log('💳 Método de pago:', metodoPago);
    
    let contenidoHTML = '';
    
    switch(metodoPago) {
        case 'yape':
            contenidoHTML = `
                <div class="payment-method-card">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-mobile-alt text-primary fa-2x me-3"></i>
                        <div>
                            <h5 class="mb-1">Pago con Yape / Plin</h5>
                            <small class="text-muted">Pendiente de pago</small>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <strong>Instrucciones:</strong><br>
                        • Envía S/ ${datosUltimoPedido.calculos?.total || '0.00'} al número: <strong>987-654-321</strong><br>
                        • Concepto: <strong>Pedido #${datosUltimoPedido.numeroPedido}</strong><br>
                        • Envía captura del voucher por WhatsApp
                    </div>
                </div>
            `;
            break;
            
        case 'transferencia':
            contenidoHTML = `
                <div class="payment-method-card">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-university text-primary fa-2x me-3"></i>
                        <div>
                            <h5 class="mb-1">Transferencia Bancaria</h5>
                            <small class="text-muted">Pendiente de pago</small>
                        </div>
                    </div>
                    <div class="alert alert-info">
                        <strong>Datos Bancarios:</strong><br>
                        • Banco: Banco de Crédito del Perú (BCP)<br>
                        • Cuenta: 285-90876543-2-10<br>
                        • CCI: 00228590876543210165<br>
                        • Titular: ElectroHogar SAC<br>
                        • Monto: S/ ${datosUltimoPedido.calculos?.total || '0.00'}
                    </div>
                </div>
            `;
            break;
            
        case 'contraentrega':
            contenidoHTML = `
                <div class="payment-method-card">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-money-bill-wave text-success fa-2x me-3"></i>
                        <div>
                            <h5 class="mb-1">Pago Contra Entrega</h5>
                            <small class="text-success">Confirmado</small>
                        </div>
                    </div>
                    <div class="alert alert-success">
                        <strong>Información:</strong><br>
                        • Pagarás en efectivo al recibir tu pedido<br>
                        • Monto a pagar: S/ ${datosUltimoPedido.calculos?.total || '0.00'}<br>
                        • Prepara el monto exacto
                    </div>
                </div>
            `;
            break;
            
        case 'tarjeta':
            const numeroTarjeta = datosUltimoPedido['numero-tarjeta'] || '****';
            const ultimosDigitos = numeroTarjeta.slice(-4);
            contenidoHTML = `
                <div class="payment-method-card">
                    <div class="d-flex align-items-center mb-3">
                        <i class="fas fa-credit-card text-success fa-2x me-3"></i>
                        <div>
                            <h5 class="mb-1">Pago con Tarjeta</h5>
                            <small class="text-success">Pago Aprobado</small>
                        </div>
                    </div>
                    <div class="alert alert-success">
                        <strong>Pago Procesado:</strong><br>
                        • Tarjeta terminada en: ****${ultimosDigitos}<br>
                        • Monto: S/ ${datosUltimoPedido.calculos?.total || '0.00'}<br>
                        • Estado: Aprobado
                    </div>
                </div>
            `;
            break;
            
        default:
            contenidoHTML = '<p>Método de pago no especificado</p>';
    }
    
    metodoPagoContainer.innerHTML = contenidoHTML;
    console.log('✅ Método de pago mostrado');
}

// ==================== 6. MOSTRAR RESUMEN DE PRODUCTOS ====================
function mostrarResumenProductos() {
    console.log('🛒 Mostrando resumen de productos...');
    
    const contenedor = document.getElementById('productos-pedido');
    if (!contenedor) {
        console.warn('⚠️ No se encontró contenedor de productos');
        return;
    }
    
    const productos = datosUltimoPedido.carrito || [];
    console.log('📦 Productos en el pedido:', productos);
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos en este pedido</p>';
        return;
    }
    
    let html = `
        <table class="table table-hover">
            <thead class="table-light">
                <tr>
                    <th>Producto</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-end">Precio Unit.</th>
                    <th class="text-end">Subtotal</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    productos.forEach(producto => {
        const subtotal = (producto.precio * producto.cantidad).toFixed(2);
        html += `
            <tr>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${producto.imagen || 'https://via.placeholder.com/50x50?text=Producto'}" 
                             alt="${producto.nombre}" 
                             class="me-3" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                        <div>
                            <h6 class="mb-1">${producto.nombre}</h6>
                            <small class="text-muted">${producto.marca || ''}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center">${producto.cantidad}</td>
                <td class="text-end">S/ ${producto.precio.toFixed(2)}</td>
                <td class="text-end">S/ ${subtotal}</td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    contenedor.innerHTML = html;
    console.log('✅ Productos mostrados');
}

// ==================== 7. MOSTRAR TOTALES ====================
function mostrarTotales() {
    console.log('💰 Mostrando totales...');
    
    const calculos = datosUltimoPedido.calculos || {};
    console.log('💰 Cálculos disponibles:', calculos);
    
    const totales = {
        'subtotal-confirmacion': `S/ ${calculos.subtotal || '0.00'}`,
        'envio-confirmacion': `S/ ${calculos.envio || '0.00'}`,
        'igv-confirmacion': `S/ ${calculos.igv || '0.00'}`,
        'total-confirmacion': `S/ ${calculos.total || '0.00'}`
    };
    
    for (const [id, valor] of Object.entries(totales)) {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
            console.log(`✅ ${id}: ${valor}`);
        } else {
            console.warn(`⚠️ No se encontró elemento con ID: ${id}`);
        }
    }
}

// ==================== 8. GENERAR EMAIL SIMULADO ====================
function generarEmailSimulado() {
    console.log('📧 Generando email simulado...');
    
    const emailContainer = document.getElementById('email-content');
    if (!emailContainer) {
        console.warn('⚠️ No se encontró contenedor de email');
        return;
    }
    
    const metodoPago = datosUltimoPedido['metodo-pago'] || 'contraentrega';
    
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
            
            <p>Gracias por tu compra en ElectroHogar. Tu pedido <strong>#${datosUltimoPedido.numeroPedido}</strong> ha sido recibido.</p>
            
            <h6>📦 Resumen del Pedido:</h6>
            <ul>
                ${generarListaProductosEmail()}
            </ul>
            
            <p><strong>💰 Total: S/ ${datosUltimoPedido.calculos?.total || '0.00'}</strong></p>
            
            <h6>💳 Información de Pago:</h6>
            ${generarInstruccionesPagoEmail(metodoPago)}
            
            <p>¡Gracias por elegirnos!</p>
            <p><strong>El equipo de ElectroHogar</strong></p>
        </div>
    `;
    
    emailContainer.innerHTML = emailHTML;
    console.log('✅ Email simulado generado');
}

function generarListaProductosEmail() {
    const productos = datosUltimoPedido.carrito || [];
    let lista = '';
    
    productos.forEach(producto => {
        lista += `<li>${producto.cantidad}x ${producto.nombre} - S/ ${(producto.precio * producto.cantidad).toFixed(2)}</li>`;
    });
    
    return lista || '<li>No hay productos</li>';
}

function generarInstruccionesPagoEmail(metodoPago) {
    switch(metodoPago) {
        case 'yape':
            return `
                <p>Para completar tu pago mediante Yape:</p>
                <ul>
                    <li>Envía S/ ${datosUltimoPedido.calculos?.total || '0.00'} al número: <strong>987-654-321</strong></li>
                    <li>Concepto: <strong>Pedido #${datosUltimoPedido.numeroPedido}</strong></li>
                    <li>Envía captura del voucher por WhatsApp</li>
                </ul>
            `;
        case 'transferencia':
            return `
                <p>Datos para transferencia bancaria:</p>
                <ul>
                    <li>Banco: Banco de Crédito del Perú (BCP)</li>
                    <li>Cuenta: 285-90876543-2-10</li>
                    <li>CCI: 00228590876543210165</li>
                    <li>Titular: ElectroHogar SAC</li>
                </ul>
            `;
        case 'contraentrega':
            return `
                <p>Pago contra entrega:</p>
                <ul>
                    <li>Pagarás en efectivo al recibir tu pedido</li>
                    <li>Monto: S/ ${datosUltimoPedido.calculos?.total || '0.00'}</li>
                    <li>Prepara el monto exacto</li>
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
    console.log('💰 Cálculos:', datosUltimoPedido?.calculos);
}

// Hacer función de debug disponible globalmente
window.debugConfirmacion = debugConfirmacion;

console.log('✅ Módulo de confirmación cargado');
console.log('💡 Usa debugConfirmacion() en la consola para ver todos los datos');
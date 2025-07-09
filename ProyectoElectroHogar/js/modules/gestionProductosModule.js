// =====================================================
// MÓDULO DE GESTIÓN DE PRODUCTOS
// =====================================================

// Variables globales
let contadorProductos = 1;
let indiceSeleccionado = 0;
let productos = [];

// ==================== MANIPULACIÓN DEL DOM ====================

function crearProductoDinamico() {
    console.log('Creando producto dinámico...');
    
    const grid = document.getElementById('productos-grid');
    const nuevoProducto = document.createElement('article');
    
    contadorProductos++;
    nuevoProducto.className = 'producto-card efecto-aparicion';
    nuevoProducto.setAttribute('data-producto-id', contadorProductos);
    nuevoProducto.setAttribute('data-estado', 'nuevo');
    nuevoProducto.setAttribute('data-categoria', 'dinamico');
    nuevoProducto.setAttribute('data-index', contadorProductos - 1);
    nuevoProducto.setAttribute('tabindex', '0');
    nuevoProducto.setAttribute('role', 'article');
    
    nuevoProducto.innerHTML = `
        <div class="navegacion-indicador" data-indicator="position">${contadorProductos}/${contadorProductos}</div>
        <img src="https://via.placeholder.com/300x200/007bff/ffffff?text=Producto+${contadorProductos}" 
             alt="Producto dinámico ${contadorProductos}" 
             class="producto-imagen atributo-modificado"
             data-image="product"
             data-loaded="false"
             loading="lazy">
        <h4 class="producto-titulo" data-title="product">Producto Dinámico ${contadorProductos}</h4>
        <p class="text-muted" data-description="product">Producto creado dinámicamente</p>
        <div class="producto-precio" data-price="${(Math.random() * 500 + 100).toFixed(2)}" data-currency="USD">
            $${(Math.random() * 500 + 100).toFixed(2)}
        </div>
        <div class="producto-acciones" data-actions="product">
            <button class="accion-btn bg-primary text-white" data-action="select" onclick="seleccionarProducto(this)">
                <i class="fas fa-check"></i> Seleccionar
            </button>
            <button class="accion-btn bg-warning text-dark" data-action="edit" onclick="editarProducto(this)">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="accion-btn bg-danger text-white" data-action="delete" onclick="eliminarProducto(this)">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
    
    grid.appendChild(nuevoProducto);
    grid.setAttribute('data-count', contadorProductos);
    
    actualizarIndicadoresNavegacion();
    mostrarInfoTecnica(`Producto creado usando createElement() y appendChild(). Total: ${contadorProductos} productos`);
    
    console.log(`Producto ${contadorProductos} creado y agregado al DOM`);
}

// ==================== NAVEGACIÓN ENTRE NODOS ====================

function navegarEntreElementos() {
    console.log('Navegando entre elementos...');
    
    const productos = document.querySelectorAll('.producto-card');
    if (productos.length === 0) return;
    
    let elementoActual = document.querySelector('[data-estado="seleccionado"]');
    
    if (!elementoActual) {
        elementoActual = productos[0];
    }
    
    let siguienteElemento = null;
    
    // Usar nextElementSibling para navegar al siguiente
    siguienteElemento = elementoActual.nextElementSibling;
    
    if (!siguienteElemento) {
        // Si no hay siguiente, usar firstElementChild del contenedor padre
        siguienteElemento = elementoActual.parentElement.firstElementChild;
    }
    
    // Quitar selección actual
    elementoActual.setAttribute('data-estado', 'normal');
    elementoActual.classList.remove('highlight-temporary');
    
    // Seleccionar nuevo elemento
    siguienteElemento.setAttribute('data-estado', 'seleccionado');
    siguienteElemento.classList.add('highlight-temporary');
    
    // Explorar jerarquía del elemento seleccionado
    explorarJerarquiaCompleta(siguienteElemento);
    
    // Scroll suave al elemento
    siguienteElemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    console.log('Navegación completada');
}

function explorarJerarquiaCompleta(elemento) {
    console.log('Explorando jerarquía completa del elemento...');
    
    let info = 'NAVEGACIÓN ENTRE NODOS:\n\n';
    
    // Explorar hacia arriba (padres) usando parentElement
    info += 'PADRES:\n';
    let padre = elemento.parentElement;
    let nivel = 1;
    while (padre && nivel <= 3) {
        info += `  Nivel ${nivel}: ${padre.tagName}`;
        if (padre.id) info += ` (id: ${padre.id})`;
        if (padre.className) info += ` (clases: ${padre.className.split(' ').slice(0,2).join(' ')})`;
        info += '\n';
        padre = padre.parentElement;
        nivel++;
    }
    
    // Explorar hijos usando children
    info += '\nHIJOS:\n';
    const hijos = elemento.children;
    for (let i = 0; i < Math.min(hijos.length, 5); i++) {
        info += `  Hijo ${i + 1}: ${hijos[i].tagName}`;
        if (hijos[i].className) info += ` (${hijos[i].className.split(' ')[0]})`;
        info += '\n';
    }
    
    // Explorar hermanos usando nextElementSibling y previousElementSibling
    info += '\nHERMANOS:\n';
    if (elemento.previousElementSibling) {
        info += `  Anterior: ${elemento.previousElementSibling.tagName}\n`;
    }
    if (elemento.nextElementSibling) {
        info += `  Siguiente: ${elemento.nextElementSibling.tagName}\n`;
    }
    
    // Usar firstElementChild y lastElementChild
    const contenedor = elemento.parentElement;
    info += '\nPOSICIÓN:\n';
    info += `  Primer hermano: ${contenedor.firstElementChild.getAttribute('data-producto-id')}\n`;
    info += `  Último hermano: ${contenedor.lastElementChild.getAttribute('data-producto-id')}\n`;
    
    mostrarInfoTecnica(info);
}

// ==================== ATRIBUTOS HTML ESTÁNDAR ====================

function modificarAtributosHTML() {
    console.log('Modificando atributos HTML estándar...');
    
    const productosCards = document.querySelectorAll('.producto-card');
    
    productosCards.forEach((card, index) => {
        // OBTENER ATRIBUTOS EXISTENTES
        const atributosOriginales = {
            id: card.getAttribute('id'),
            className: card.getAttribute('class'),
            dataEstado: card.getAttribute('data-estado'),
            tabIndex: card.getAttribute('tabindex')
        };
        
        // MODIFICAR ATRIBUTOS ESTÁNDAR
        card.setAttribute('id', `producto-modificado-${index + 1}`);
        card.setAttribute('title', `Producto ${index + 1} - Atributos modificados dinámicamente`);
        card.setAttribute('data-estado', 'modificado');
        card.setAttribute('data-timestamp', new Date().toISOString());
        card.setAttribute('data-modificado-por', 'javascript');
        
        // MODIFICAR CLASES CSS usando classList
        card.classList.add('atributo-modificado');
        card.classList.add('processing');
        
        // MODIFICAR ATRIBUTOS DE IMAGEN
        const imagen = card.querySelector('img');
        if (imagen) {
            imagen.setAttribute('data-modificado', 'true');
            imagen.setAttribute('loading', 'eager');
            imagen.setAttribute('decoding', 'sync');
            const altOriginal = imagen.getAttribute('alt');
            imagen.setAttribute('alt', `${altOriginal} - Modificado por JavaScript`);
        }
        
        // MODIFICAR ATRIBUTOS DE BOTONES
        const botones = card.querySelectorAll('button');
        botones.forEach((boton, btnIndex) => {
            boton.setAttribute('data-modificado', 'true');
            boton.setAttribute('data-btn-index', btnIndex);
            boton.setAttribute('aria-label', `Acción ${btnIndex + 1} para producto ${index + 1}`);
            const textoOriginal = boton.textContent;
            boton.setAttribute('data-texto-original', textoOriginal);
        });
        
        // MODIFICAR ESTILOS USANDO ATRIBUTOS STYLE
        card.style.setProperty('--custom-border', '#28a745');
        card.style.borderColor = 'var(--custom-border)';
        card.style.borderWidth = '3px';
        
        setTimeout(() => {
            card.classList.remove('processing');
        }, 1000);
    });
    
    // Actualizar contador usando setAttribute
    const grid = document.getElementById('productos-grid');
    grid.setAttribute('data-modificaciones', Date.now());
    
    let info = 'ATRIBUTOS HTML MODIFICADOS:\n\n';
    info += 'Atributos estándar modificados:\n';
    info += '  • id: Nuevo identificador único\n';
    info += '  • class: Clases CSS agregadas\n';
    info += '  • title: Título descriptivo\n';
    info += '  • data-*: Atributos personalizados\n';
    info += '  • style: Estilos inline\n\n';
    info += 'Atributos de imagen:\n';
    info += '  • alt: Texto alternativo actualizado\n';
    info += '  • loading: Modificado a eager\n';
    info += '  • data-modificado: Marcador de cambio\n\n';
    info += 'Atributos de botones:\n';
    info += '  • aria-label: Accesibilidad mejorada\n';
    info += '  • data-btn-index: Índice de botón\n';
    info += '  • data-texto-original: Respaldo del texto';
    
    mostrarInfoTecnica(info);
    
    console.log('Atributos HTML modificados exitosamente');
}

// ==================== ANÁLISIS DE ESTRUCTURA ====================

function analizarEstructuraCompleta() {
    console.log('Analizando estructura HTML, CSS y JavaScript...');
    
    let analisis = 'ANÁLISIS COMPLETO DE ESTRUCTURA:\n\n';
    
    // ANÁLISIS HTML
    analisis += 'ESTRUCTURA HTML:\n';
    const elementos = {
        'Navegación': document.querySelectorAll('nav').length,
        'Secciones': document.querySelectorAll('section').length,
        'Artículos': document.querySelectorAll('article').length,
        'Formularios': document.querySelectorAll('form').length,
        'Botones': document.querySelectorAll('button').length,
        'Inputs': document.querySelectorAll('input').length,
        'Imágenes': document.querySelectorAll('img').length
    };
    
    for (const [tipo, cantidad] of Object.entries(elementos)) {
        analisis += `  • ${tipo}: ${cantidad}\n`;
    }
    
    // ANÁLISIS CSS
    analisis += '\nANÁLISIS CSS:\n';
    const estilos = document.styleSheets[0];
    if (estilos) {
        analisis += `  • Hojas de estilo: ${document.styleSheets.length}\n`;
        analisis += `  • Variables CSS: Definidas en :root\n`;
        analisis += `  • Clases principales: .producto-card, .control-btn\n`;
        analisis += `  • Animaciones: @keyframes definidas\n`;
        analisis += `  • Responsive: Media queries implementadas\n`;
    }
    
    // ANÁLISIS JAVASCRIPT
    analisis += '\nANÁLISIS JAVASCRIPT:\n';
    analisis += `  • Funciones definidas: ${Object.keys(window).filter(key => typeof window[key] === 'function' && key.startsWith('crear') || key.startsWith('navegar') || key.startsWith('modificar')).length}\n`;
    analisis += `  • Event listeners: Configurados\n`;
    analisis += `  • Manipulación DOM: Activa\n`;
    analisis += `  • Gestión de atributos: Implementada\n`;
    
    // ANÁLISIS DE ATRIBUTOS
    analisis += '\nATRIBUTOS EN USO:\n';
    const todosLosElementos = document.querySelectorAll('*');
    const atributosEncontrados = new Set();
    
    todosLosElementos.forEach(el => {
        for (let attr of el.attributes) {
            atributosEncontrados.add(attr.name);
        }
    });
    
    const atributosImportantes = Array.from(atributosEncontrados)
        .filter(attr => attr.startsWith('data-') || ['id', 'class', 'role', 'aria-label', 'title'].includes(attr))
        .slice(0, 10);
    
    atributosImportantes.forEach(attr => {
        const elementos = document.querySelectorAll(`[${attr}]`);
        analisis += `  • ${attr}: ${elementos.length} elementos\n`;
    });
    
    mostrarInfoTecnica(analisis);
    
    // Destacar elementos analizados
    document.querySelectorAll('.producto-card').forEach(card => {
        card.classList.add('highlight-temporary');
        setTimeout(() => card.classList.remove('highlight-temporary'), 2000);
    });
    
    console.log('Análisis de estructura completado');
}

// ==================== FUNCIONES DE FORMULARIO ====================

function procesarFormulario(event) {
    event.preventDefault();
    console.log('Procesando formulario...');
    
    const nombre = document.getElementById('input-nombre').value;
    const precio = document.getElementById('input-precio').value;
    const imagen = document.getElementById('input-imagen').value || 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Sin+Imagen';
    const categoria = document.getElementById('select-categoria').value;
    const descripcion = document.getElementById('textarea-descripcion').value;
    
    if (!nombre || !precio) {
        alert('Por favor completa los campos obligatorios');
        return;
    }
    
    crearProductoDesdeFormulario(nombre, precio, imagen, categoria, descripcion);
    resetearFormulario();
}



function resetearFormulario() {
    const form = document.querySelector('[data-form="producto"]');
    form.reset();
    
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.removeAttribute('data-modified');
        input.classList.remove('is-valid', 'is-invalid');
    });
    
    const formularioContainer = document.getElementById('formulario-nuevo-producto');
    formularioContainer.setAttribute('data-state', 'reset');
    formularioContainer.classList.remove('activo');
}

// ==================== FUNCIONES DE PRODUCTO ====================

function seleccionarProducto(boton) {
    const card = boton.closest('.producto-card');
    
    document.querySelectorAll('.producto-card').forEach(c => {
        c.setAttribute('data-estado', 'normal');
    });
    
    card.setAttribute('data-estado', 'seleccionado');
    
    const productId = card.getAttribute('data-producto-id');
    mostrarInfoTecnica(`Producto ${productId} seleccionado usando navegación de nodos y modificación de atributos`);
}

function editarProducto(boton) {
    const card = boton.closest('.producto-card');
    const titulo = card.querySelector('[data-title="product"]');
    const precio = card.querySelector('[data-price]');
    
    card.setAttribute('data-estado', 'editando');
    titulo.setAttribute('contenteditable', 'true');
    titulo.setAttribute('data-editing', 'true');
    precio.setAttribute('contenteditable', 'true');
    precio.setAttribute('data-editing', 'true');
    
    titulo.style.border = '2px dashed #007bff';
    precio.style.border = '2px dashed #007bff';
    
    mostrarInfoTecnica('Modo edición activado. Los elementos son editables usando contenteditable');
}

function eliminarProducto(boton) {
    const card = boton.closest('.producto-card');
    const productId = card.getAttribute('data-producto-id');
    
    if (confirm('¿Eliminar este producto?')) {
        card.setAttribute('data-estado', 'eliminado');
        card.classList.add('efecto-desaparicion');
        
        setTimeout(() => {
            card.parentElement.removeChild(card);
            actualizarIndicadoresNavegacion();
            mostrarInfoTecnica(`Producto ${productId} eliminado del DOM usando removeChild()`);
        }, 300);
    }
}

// ==================== FUNCIONES AUXILIARES ====================

function actualizarIndicadoresNavegacion() {
    const productos = document.querySelectorAll('.producto-card');
    productos.forEach((producto, index) => {
        const indicador = producto.querySelector('[data-indicator="position"]');
        if (indicador) {
            indicador.textContent = `${index + 1}/${productos.length}`;
            indicador.setAttribute('data-position', index + 1);
            indicador.setAttribute('data-total', productos.length);
        }
        
        producto.setAttribute('data-index', index);
    });
    
    const grid = document.getElementById('productos-grid');
    grid.setAttribute('data-count', productos.length);
}

function mostrarInfoTecnica(mensaje) {
    const infoDiv = document.getElementById('info-tecnica');
    infoDiv.innerHTML = `<pre style="white-space: pre-wrap; font-family: 'Courier New', monospace;">${mensaje}</pre>`;
    infoDiv.setAttribute('data-updated', new Date().toISOString());
    
    infoDiv.classList.add('highlight-temporary');
    setTimeout(() => infoDiv.classList.remove('highlight-temporary'), 1000);
}

// ==================== INICIALIZACIÓN ====================

function inicializarGestionProductos() {
    console.log('Módulo de gestión de productos cargado');
    
    // Hacer funciones disponibles globalmente
    window.crearProductoDinamico = crearProductoDinamico;
    window.navegarEntreElementos = navegarEntreElementos;
    window.modificarAtributosHTML = modificarAtributosHTML;
    window.analizarEstructuraCompleta = analizarEstructuraCompleta;
    window.procesarFormulario = procesarFormulario;
    window.seleccionarProducto = seleccionarProducto;
    window.editarProducto = editarProducto;
    window.eliminarProducto = eliminarProducto;
    window.resetearFormulario = resetearFormulario;
    
    // Configurar eventos adicionales
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            navegarEntreElementos();
        }
    });
    
    // Inicializar formulario
    const formulario = document.getElementById('formulario-nuevo-producto');
    if (formulario) {
        formulario.addEventListener('click', function() {
            this.classList.add('activo');
            this.setAttribute('data-state', 'active');
        });
    }
    
    // Configurar hover effects
    document.querySelectorAll('.producto-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.setAttribute('data-hover', 'true');
        });
        
        card.addEventListener('mouseleave', function() {
            this.removeAttribute('data-hover');
        });
    });
    
    actualizarIndicadoresNavegacion();
    
    mostrarInfoTecnica(`Sistema de gestión inicializado correctamente:

✅ HTML: Estructura semántica con atributos estándar
✅ CSS: Estilos con variables y animaciones  
✅ JavaScript: Manipulación DOM y navegación entre nodos

Usa los botones del panel de control para probar las funcionalidades`);
    
    console.log('Inicialización de gestión de productos completada');
}

// Auto-inicializar cuando se carga el módulo
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('productos-grid')) {
        inicializarGestionProductos();
    }
});
function crearProductoDesdeFormulario(nombre, precio, imagen, categoria, descripcion) {
    const grid = document.getElementById('productos-grid');
    const nuevoProducto = document.createElement('article');
    
    contadorProductos++;
    
    nuevoProducto.className = 'producto-card efecto-aparicion';
    nuevoProducto.setAttribute('data-producto-id', contadorProductos);
    nuevoProducto.setAttribute('data-estado', 'creado-formulario');
    nuevoProducto.setAttribute('data-categoria', categoria);
    nuevoProducto.setAttribute('data-index', contadorProductos - 1);
    nuevoProducto.setAttribute('data-source', 'formulario');
    nuevoProducto.setAttribute('tabindex', '0');
    nuevoProducto.setAttribute('role', 'article');
    nuevoProducto.setAttribute('aria-label', `Producto ${nombre}`);
    
    nuevoProducto.innerHTML = `
        <div class="navegacion-indicador" data-indicator="position">${contadorProductos}/${contadorProductos}</div>
        <img src="${imagen}" 
             alt="${nombre}" 
             class="producto-imagen"
             data-image="product"
             data-source="form"
             loading="lazy"
             onerror="this.src='https://via.placeholder.com/300x200/dc3545/ffffff?text=Error+Imagen'">
        <h4 class="producto-titulo" data-title="product">${nombre}</h4>
        <p class="text-muted" data-description="product">${descripcion || 'Sin descripción'}</p>
        <div class="producto-precio" data-price="${precio}" data-currency="USD">$${precio}</div>
        <div class="producto-acciones" data-actions="product">
            <button class="accion-btn bg-primary text-white" data-action="select" onclick="seleccionarProducto(this)">
                <i class="fas fa-check"></i> Seleccionar
            </button>
            <button class="accion-btn bg-warning text-dark" data-action="edit" onclick="editarProducto(this)">
                <i class="fas fa-edit"></i> Editar
            </button>
            <button class="accion-btn bg-danger text-white" data-action="delete" onclick="eliminarProducto(this)">
                <i class="fas fa-trash"></i> Eliminar
            </button>
        </div>
    `;
    
    grid.appendChild(nuevoProducto);
    grid.setAttribute('data-count', contadorProductos);
    
    actualizarIndicadoresNavegacion();
    
    // ==================== SINCRONIZACIÓN CON PRODUCTOS.HTML ====================
    // Preparar datos del producto para sincronización
    const datosProducto = {
        nombre: nombre,
        precio: precio,
        imagen: imagen,
        descripcion: descripcion,
        categoria: categoria,
        marca: 'ElectroHogar',
        modelo: `Modelo-${contadorProductos}`,
        caracteristicas: descripcion || 'Características especiales',
        garantia: '1 año',
        stock: Math.floor(Math.random() * 20) + 10 // Stock aleatorio entre 10-30
    };
    
    // Intentar sincronizar con productos.html
    try {
        // Verificar si la función de sincronización está disponible
        if (typeof window.sincronizarConProductos === 'function') {
            const productoCreado = window.sincronizarConProductos(datosProducto);
            mostrarInfoTecnica(`✅ PRODUCTO CREADO Y SINCRONIZADO EXITOSAMENTE

📦 Nombre: ${nombre}
💰 Precio: $${precio}
📁 Categoría: ${categoria}
🆔 ID: ${productoCreado.id}
📊 Stock: ${datosProducto.stock}

🎯 El producto está disponible en:
✅ Panel de Gestión (aquí)
✅ Página de Productos (productos.html)
✅ Sistema de Carrito

🔄 Sincronización: COMPLETADA`);
        } else {
            // Si no está disponible, mostrar información básica
            mostrarInfoTecnica(`📦 Producto "${nombre}" creado en gestión

⚠️ Sincronización pendiente - El módulo de sincronización se cargará automáticamente.

📋 Detalles:
• Precio: $${precio}
• Categoría: ${categoria}
• Descripción: ${descripcion || 'Sin descripción'}`);
            
            // Intentar cargar el módulo de sincronización
            setTimeout(() => {
                if (typeof window.sincronizarConProductos === 'function') {
                    const productoCreado = window.sincronizarConProductos(datosProducto);
                    mostrarInfoTecnica(`🔄 ¡SINCRONIZACIÓN COMPLETADA!

El producto "${nombre}" ahora está disponible en productos.html
ID: ${productoCreado.id}`);
                }
            }, 2000);
        }
    } catch (error) {
        console.error('Error en sincronización:', error);
        mostrarInfoTecnica(`⚠️ Producto "${nombre}" creado en gestión

❌ Error en sincronización: ${error.message}

El producto se guardó localmente pero puede no aparecer en productos.html hasta refrescar la página.`);
    }
}

// Exportar funciones principales
export {
    crearProductoDinamico,
    navegarEntreElementos,
    modificarAtributosHTML,
    analizarEstructuraCompleta,
    inicializarGestionProductos
};